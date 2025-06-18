import { Noeud } from "./noeuds.js";
import { Sauvegarde } from "../sauvegarde/sauvegarde.js";

export class MenuTechnologies {
    constructor(nomSauvegarde) {
        this.noeuds = [
            new Noeud("centre", 1, "triangle", this, ['vitesseAttaque', 'degats', 'orDeDepart', 'lvlUpTours']),
            new Noeud("vitesseAttaque", 5, "triangle", this),
            new Noeud("degats", 5, "triangle", this, ['critRate', 'critDamage']),
            new Noeud("orDeDepart", 7, "triangle", this),
            new Noeud("lvlUpTours", 10, "triangle", this),
            new Noeud("critRate", 20, "triangle", this),
            new Noeud("critDamage", 20, "triangle", this)
        ];

        this.canvas = document.querySelector('#canvasTechno');
        this.ctx = this.canvas.getContext('2d');

        this.sauvegarde = new Sauvegarde(nomSauvegarde);


        // Désactivation du menu contextuel de google Chrome
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        // Ajustement de la taille du canvas
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.dessinerLiensNoeuds();
        });
    }

    async initialiserSauvegarde(){
        /* Déblocage des technologies en fonction de la sauvegarde */
        this.sauvegarde = (await this.sauvegarde.lireSaves()).saves[this.sauvegarde.nom];
        const technos = this.sauvegarde.technologies;
        const technoDebloquees = [];
        //console.log(technos);
        for(const techno of Object.keys(technos)) {
            if (technos[techno].lvl1 === true) {
                //console.log("Technologie " + techno + " OK");
                technoDebloquees.push(techno);
            }
        }
        for(const noeud of this.noeuds) {
            if (technoDebloquees.includes(noeud.idHTML)) {
                noeud.debloquer();
            }
        }
        /* Récupération des monaies de la sauvegarde */
        const monnaies = this.sauvegarde.monnaies;
        const monaieTriangle = document.querySelector('#divTriangles span');
        const monaieRonds = document.querySelector('#divRonds span');
        const monaieHexagones = document.querySelector('#divHexagones span');
        for(const monnaie of Object.keys(monnaies)) {
            switch (monnaie) {
                case 'triangles':
                    monaieTriangle.innerHTML = monnaies[monnaie];
                    break;
                case 'ronds':
                    monaieRonds.innerHTML = monnaies[monnaie];
                    break;
                case 'hexagones':
                    monaieHexagones.innerHTML = monnaies[monnaie];
                    break;
                default:
                    break;
            }
        }
    }

    dessinerLiensNoeuds() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(const noeud of this.noeuds) {
            const positionNoeud = noeud.getPosition();

            const posNoeudX = positionNoeud.x-noeud.divElementHTML.offsetWidth/2;
            const posNoeudY = positionNoeud.y-noeud.divElementHTML.offsetHeight/2;
            
            
            for(const enfantId of noeud.enfants) {
                const enfant = this.noeuds.find(n => n.idHTML === enfantId);
                if (!enfant) continue;
                if (enfant.estCache()) continue; // Si l'enfant est caché, on ne le dessine pas
                const positionEnfant = enfant.getPosition();
                
                const posEnfantX = positionEnfant.x-enfant.divElementHTML.offsetWidth/2;
                const posEnfantY = positionEnfant.y-enfant.divElementHTML.offsetHeight/2;
                this.ctx.beginPath();
                this.ctx.moveTo(posEnfantX, posEnfantY);
                this.ctx.lineTo(posNoeudX, posNoeudY);
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            if (!noeud.estCache()){
                this.ctx.beginPath();
                this.ctx.arc(posNoeudX, posNoeudY-2, 30, 0, Math.PI * 2);
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fill();
            }
        }
    }
}

