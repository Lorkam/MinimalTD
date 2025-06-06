import {niveaux} from "./map.js";
import { Enemy } from "./enemy.js";
import { TourClassique } from "./tower.js";


export class Game {
    constructor(niveau) {
        this.niveau = niveaux[niveau]; // Niveau actuel du jeu
        this.enemies = []; // Liste des ennemis
        this.towers = []; // Liste des tours
        this.projectiles = []; // Liste des projectiles
        this.heart = niveau.heart; // Coeur du joueur
        this.spawnInterval = niveau.intervale; // Intervalle de spawn des ennemis
        this.lastSpawnTime = Date.now();// Temps du dernier spawn d'ennemi
        this.enemyCount = 0; // Compteur d'ennemis
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.chemin = this.niveau.chemin;
        this.imageCoeur = new Image();
        this.imageCoeur.src = './app/assets/img/heart.png';
        this.nbEnemy = 0;
        this.jeuDemarre = false; // Indique si le jeu a démarré
    }

    /**
     * Fait apparaître un nouvel ennemi si l'intervalle de spawn est écoulé et que le nombre maximum d'ennemis n'est pas atteint.
     * Met à jour le temps du dernier spawn, ajoute une nouvelle instance d'Enemy au tableau des ennemis et incrémente le compteur d'ennemis.
     */
    spawnEnnemis() {
        if (Date.now() - this.lastSpawnTime >= this.niveau.intervale && this.niveau.nbEnemyMax > this.nbEnemy) {
            this.lastSpawnTime = Date.now();
            this.enemies.push(new Enemy(this.chemin));
            this.nbEnemy++;
        }
    }

    /**
     * Met à jour l'état de tous les ennemis dans le jeu.
     * 
     * Parcourt la liste des ennemis et met à jour chacun d'eux. Si un ennemi n'est plus en vie
     * (c'est-à-dire que sa méthode `update()` retourne false), il est retiré de la liste des ennemis.
     * Sinon, l'ennemi est dessiné sur le contexte du canvas.
     */
    majEnnemis() {
        for (const enemy of this.enemies) {
            if (!enemy.update(this.niveau.heart)){
                // Si l'ennemi n'est plus en vie, on le retire de la liste
                const index = this.enemies.indexOf(enemy);
                if (index > -1) {
                    this.enemies.splice(index, 1);
                }
            }else{
                enemy.draw(this.ctx);
            }
        }
    }

    /**
     * Dessine le niveau actuel sur le canvas.
     * Efface le canvas, trace le chemin défini par `this.chemin` et affiche l'image du cœur à la position spécifiée.
     *
     * @throws {Error} Si le contexte du canvas (`this.ctx`) ou les images nécessaires ne sont pas définis.
     */
    dessinerNiveau() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // déssine le chemin
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(this.chemin[0].x, this.chemin[0].y);
        for (let i = 1; i < this.chemin.length; i++) {
            this.ctx.lineTo(this.chemin[i].x, this.chemin[i].y);
        }
        this.ctx.stroke();
        // Affichage du coeur
        this.ctx.drawImage(this.imageCoeur, this.niveau.heart.x, this.niveau.heart.y, 50, 50);
    }

    /**
     * Met à jour et gère toutes les tours du jeu.
     * 
     * Pour chaque tour :
     * - Dessine la tour sur le canvas.
     * - Cherche l'ennemi le plus proche.
     * - Tire sur l'ennemi le plus proche s'il y en a un.
     * - Met à jour et dessine les balles de la tour.
     */
    surveillanceTours() {
        for (const tower of this.towers) {
            tower.dessiner(this.ctx);
            const enemyProche = tower.chercherEnnemi(this.enemies);
            if (enemyProche) {
                tower.tirer(enemyProche);
            }
            tower.majBalles(this.ctx);
        }
    }

    /**
     * Ajoute une tour au jeu en fonction du type et de l'emplacement spécifiés.
     *
     * @param {string} type - Le type de la tour à ajouter (par exemple, 'classique').
     * @param {*} emplacement - L'emplacement où la tour doit être placée.
     */
    ajouterTour(type, emplacement) {
        let tower;
        switch (type) {
            case 'classique':
                tower = new TourClassique(emplacement);
                break;
            default:
                console.error("Type de tour inconnu :", type);
        }
        this.towers.push(tower);
    }

    /**
     * Boucle principale du jeu qui gère le rendu du niveau, le spawn des ennemis,
     * la surveillance des tours, la mise à jour des états des ennemis et l'ordonnancement
     * de la prochaine frame. Cette fonction est appelée récursivement via requestAnimationFrame
     * pour créer une boucle de jeu continue.
     */
    boucleDeJeu() {
        this.dessinerNiveau();
        // Spawn des ennemis
        if (this.jeuDemarre) this.spawnEnnemis();
    
        this.surveillanceTours();
    
        // Maj des ennemis
        if (this.jeuDemarre) this.majEnnemis();

        // boucle suivante
        requestAnimationFrame(() => this.boucleDeJeu());
    }




    play(){
        for (const emplacement of this.niveau.emplacementsTower) {
            this.ajouterTour('classique', emplacement);
        }
        this.canvas.addEventListener("mousemove", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            for (const tower of this.towers) {
                const dx = mouseX - tower.position.x;
                const dy = mouseY - tower.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= 20) {
                    tower.afficherPortee = true; // Affiche la portée de la tour
                } else {
                    tower.afficherPortee = false; // Masque la portée de la tour
                }
            }
        });

        const lancerVagueBtn = document.getElementById('lancerVagueBtn');
        lancerVagueBtn.addEventListener('click', () => {
            lancerVagueBtn.disabled = true; // Désactive le bouton pour éviter les clics multiples
            this.jeuDemarre = true; // Indique que le jeu a démarré
        });
        this.boucleDeJeu();

        //this.boucleDeJeu();
    }
}