import * as THREE from 'https://esm.sh/three@0.150.1/build/three.module.js';
import { GLTFLoader } from 'https://esm.sh/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';
import { clone } from 'https://esm.sh/three@0.150.1/examples/jsm/utils/SkeletonUtils.js';

export class Model3D {
    constructor(partie, idCanva3D = 'gameCanvas3D') {
        this.partie = partie;

        const canvas3D = document.querySelector(`#${idCanva3D}`);
        const width = canvas3D.clientWidth;
        const height = canvas3D.clientHeight;

        // 💡 Caméra orthographique = vue sans perspective
        this.camera = new THREE.OrthographicCamera(
            0, width,    // left, right
            height, 0,   // top, bottom (haut = 0)
            -1000, 1000
        );
        this.camera.position.set(0, 0, 10); // caméra qui regarde dans l'axe Z
        this.camera.lookAt(0, 0, 0);

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        // Lumières
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(0, 0, 100);
        this.scene.add(directionalLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
        fillLight.position.set(0, 0, -100);
        this.scene.add(fillLight);

        this.models = [];
        this.mixers = [];
        this.loadedGLB = {};

        this.clock = new THREE.Clock();
        this.reRender3D = this.reRender3D.bind(this);
        this.reRender3D();
    }

    async loadGLB(path) {
        if (this.loadedGLB[path]) return this.loadedGLB[path];
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(path);
        this.loadedGLB[path] = gltf;
        return gltf;
    }

    /**
     * Charge de façon asynchrone un modèle 3D GLB, le centre et le met à l'échelle, le positionne dans la scène,
     * l'ajoute à la scène et au mixer d'animation, et retourne son index dans le tableau des modèles.
     *
     * @async
     * @param {string} fichierGLB - Le chemin ou l'URL du fichier GLB à charger.
     * @param {{ x: number, y: number }} [position={ x: 0, y: 0 }] - La position 2D où placer le modèle dans la scène.
     * @param {number} [taille] - Le facteur d'échelle à appliquer au modèle.
     * @param {number} [numAnimation] - Index de l'animation à jouer.
     * @returns {Promise<number>} L'index du modèle ajouté dans le tableau des modèles.
     */
    async addModel(fichierGLB, position = { x: 0, y: 0 }, taille, numAnimation) {
        const gltf = await this.loadGLB(fichierGLB);
        const model = clone(gltf.scene);
        model.scale.set(taille, taille, taille);

        // Centrer le modèle
        const bbox = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        model.position.sub(center);
        model.rotation.x = Math.PI / 2;
        //model.rotation.y = Math.PI / 2;

        // 💡 Position 2D directe dans l'espace 3D
        model.position.set(position.x, this.renderer.domElement.height - position.y, 0);
        this.scene.add(model);

        const mixer = new THREE.AnimationMixer(model);
        if (gltf.animations.length > numAnimation) {
            mixer.clipAction(gltf.animations[numAnimation]).play();
        }

        const index = this.models.length;
        this.models.push({ model, mixer, lastPosition: new THREE.Vector2(position.x, position.z), gltf });
        this.mixers.push(mixer);

        return index;
    }

    updateFrom2DPosition(index, x2D, y2D) {
        const entry = this.models[index];
        if (!entry) return;

        const model = entry.model;
        const newY = this.renderer.domElement.height - y2D;
        model.position.set(x2D, newY, 0);

        const last = entry.lastPosition;
        const dx = x2D - last.x;
        const dy = newY - last.y;

        const distance = Math.hypot(dx, dy);
        if (distance > 0.1) {
            const angle = Math.atan2(dy, dx);
            // 💡 Tourner autour de Y si le modèle est couché
            model.rotation.y = angle + Math.PI / 2;
            last.set(x2D, newY);
        }
    }

    async animationMort(index, indexAnimationMort, ennemi) {
        //console.log("boss mort");
        ennemi.id3D = null;
        const entry = this.models[index];
        if (!entry) return false;

        const { model, mixer, gltf } = entry;
        if (!gltf) return false;
        
        const clip = gltf.animations[indexAnimationMort];
        if (!clip) return false;
        
        // Stop les autres animations
        mixer.stopAllAction();

        // Joue l'animation de mort une seule fois
        const action = mixer.clipAction(clip);
        action.reset();
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.play();
        //await new Promise(r => setTimeout(r, 1500)); // Attendre un peu pour que l'animation commence

        // Retourne une promesse qui se résout quand l'animation est finie
        return new Promise(resolve => {
            const onFinished = (event) => {
                if (event.action === action) {
                    mixer.removeEventListener('finished', onFinished);
                    console.log("animation de mort terminée");
                    resolve(true);
                }
            };
            mixer.addEventListener('finished', onFinished);
        });
    }


    removeModel(index) {
        const entry = this.models[index];
        if (!entry) return;
        this.scene.remove(entry.model);
        this.models[index] = null;
        this.mixers[index] = null;
    }

    reRender3D() {
        requestAnimationFrame(this.reRender3D);

        if(this.partie!=null){
            for (const ennemi of this.partie.ennemies) {
                if (typeof ennemi.id3D !== "undefined") {
                    this.updateFrom2DPosition(ennemi.id3D, ennemi.x, ennemi.y);
                }
            }
        }

        const delta = this.clock.getDelta();
        this.mixers.forEach(mixer => {
            if (mixer) mixer.update(delta);
        });

        this.renderer.render(this.scene, this.camera);
    }
}
