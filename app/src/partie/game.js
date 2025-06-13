import { niveaux } from "./map.js";
import { EnemyClassique, EnemyTank, EnemyRapide } from "./enemy.js";
import { Emplacement } from "./emplacement.js";


export class Partie {
    constructor(niveau, vague=1) {
        this.niveau = JSON.parse(JSON.stringify(niveaux[niveau])); // Copie profonde du niveau pour éviter les modifications directes
        this.ennemies = []; // Liste des ennemis
        this.ennemiesASpawn = {}; // Liste des ennemis
        this.emplacements = []; // Liste des emplacements pour les tours
        this.towers = []; // Liste des tours
        this.projectiles = []; // Liste des projectiles
        this.heartPos = this.niveau.heart; // Copie profonde du coeur du joueur
        this.heartPV = 3; // Copie profonde du coeur du joueur
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.chemin = this.niveau.chemin;
        this.imageCoeur = new Image();
        this.imageCoeur.src = '../assets/img/heart.png';
        this.chemin = this.niveau.chemin;
        this.jeuDemarre = false; // Indique si le jeu a démarré
        this.jeuTermine = false; // Indique si le jeu a démarré
        this.HTMLnumVague = document.getElementById('numVague');
        this.HTMLnbEnnemisRestants = document.getElementById('nbEnnemisRestants');
        this.HTMLnbEnnemisMorts = document.getElementById('nbEnnemisMorts');
        this.HTMLgolds = document.getElementById('golds');

        this.vague = vague; // Compteur de vagues
        this.golds = 100; // Or du joueur
    
        this.totalEnnemis = 0; // Nombre total d'ennemis à spawn dans la vague
        this.nbEnnemisMorts = 0; // Compteur d'ennemis morts

        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });

    }

    /**
     * Initialise la vague actuelle d'ennemis en configurant le nombre et l'intervalle de spawn
     * pour chaque type d'ennemi selon la configuration de la vague en cours.
     * Met à jour l'objet `ennemiesASpawn` avec les détails de spawn des ennemis et incrémente le nombre total d'ennemis.
     * Affiche les détails de l'initialisation dans la console.
     */
    initialisationVague() {
        console.log("Initialisation de la vague :" + this.vague);
        this.nbEnnemisMorts = 0; // Réinitialise le compteur d'ennemis morts
        this.totalEnnemis = 0; // Réinitialise le nombre total d'ennemis à spawn
        for( const typeEnemy of this.niveau.vagues[this.vague-1].ennemis) {
            //console.log(typeEnemy);
            this.ennemiesASpawn[typeEnemy.type] = {
                nb: typeEnemy.nb, // Nombre d'ennemis à spawn
                intervale: typeEnemy.intervale // Intervalle de spawn en millisecondes
            };
            this.totalEnnemis += typeEnemy.nb; // Ajoute le nombre d'ennemis à spawn au total
        }
    }

    /**
     * Fait apparaître un nouvel ennemi si l'intervalle de spawn est écoulé et que le nombre maximum d'ennemis n'est pas atteint.
     * Met à jour le temps du dernier spawn, ajoute une nouvelle instance d'Enemy au tableau des ennemis et incrémente le compteur d'ennemis.
     */
    spawnEnnemis() {
        const currentTime = Date.now();

        for (const [type, data] of Object.entries(this.ennemiesASpawn)) {
            // Si le nombre d'ennemis à spawn pour ce type est déjà atteint, on passe au suivant
            if (data.nb <= 0) continue;

            // Initialise le temps de spawn s'il n'existe pas
            if (!data.lastSpawnTime) {
                data.lastSpawnTime = 0;
            }

            // Si le temps depuis le dernier spawn de ce type est suffisant
            if (currentTime - data.lastSpawnTime >= data.intervale) {
                // Création de l'ennemi en fonction du type
                let ennemi;
                switch (type) {
                    case "classique":
                        ennemi = new EnemyClassique(this); // Tu peux faire évoluer ça selon le type
                        break;
                    case "tank":
                        ennemi = new EnemyTank(this); // Tu peux faire évoluer ça selon le type
                        break;
                    case "rapide":
                        ennemi = new EnemyRapide(this); // Tu peux faire évoluer ça selon le type
                        break;
                    default:
                        console.warn("Type d'ennemi inconnu :", type);
                        continue;
                }

                this.ennemies.push(ennemi);
                data.nb--; // Un ennemi de moins à spawn
                data.lastSpawnTime = currentTime; // Mise à jour du dernier spawn
            }
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
        for (const enemy of this.ennemies) {
            if (enemy.update()) {
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
        this.ctx.lineWidth = 30;
        this.ctx.beginPath();
        this.ctx.moveTo(this.chemin[0].x, this.chemin[0].y);
        for (let i = 1; i < this.chemin.length; i++) {
            this.ctx.lineTo(this.chemin[i].x, this.chemin[i].y);
        }
        this.ctx.stroke();
        // Affichage du coeur
        this.ctx.beginPath();
        this.ctx.fillStyle = "white";
        this.ctx.arc(this.heartPos.x+25, this.heartPos.y+22, 35, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.drawImage(this.imageCoeur, this.heartPos.x, this.heartPos.y, 50, 50);
    }

    gestionStructures() {
        for (const emplacement of this.emplacements) {
            emplacement.actionsDuTour();
        }
    }

    /**
     * Met à jour l'interface utilisateur pour refléter l'état actuel du jeu,
     * notamment le numéro de la vague, le nombre d'ennemis restants et le nombre d'ennemis morts.
     * Si tous les ennemis d'une vague sont éliminés, initialise la vague suivante,
     * réactive le bouton de lancement de vague, et réinitialise les compteurs appropriés.
     */
    majUI() {
        this.HTMLnumVague.textContent = `Vague ${this.vague}`;
        this.HTMLnbEnnemisRestants.textContent = this.totalEnnemis - this.nbEnnemisMorts;
        this.HTMLnbEnnemisMorts.textContent = this.nbEnnemisMorts;
        this.HTMLgolds.textContent = this.golds;
    }

    verifChangementVague() {
        const lancerVagueBtn = document.getElementById('lancerVagueBtn');
        if (this.nbEnnemisMorts == this.totalEnnemis && this.niveau.vagues[this.vague - 1].derniereVague==false) {
            console.log("Fin de la vague " + (this.vague ) + ", passage à la vague " + (this.vague+1));
            this.vague++;
            this.initialisationVague();
            lancerVagueBtn.disabled = false; // Réactive le bouton pour la prochaine vague
            this.jeuDemarre = false; // Indique que le jeu n'est plus en cours
        }else if(this.nbEnnemisMorts == this.totalEnnemis && this.niveau.vagues[this.vague - 1].derniereVague==true) {
            console.log("Fin de la dernière vague");
            console.log("Félicitations ! Vous avez terminé le jeu !");
            this.jeuDemarre = false; // Indique que le jeu n'est plus en cours
            this.jeuTermine = true; // Indique que le jeu est terminé
            lancerVagueBtn.disabled = false;
            document.getElementById('divEcranSombre').style.display = 'flex'; // Affiche l'image de victoire
            document.getElementById('divImgVictoire').style.display = 'flex'; // Affiche l'image de victoire
        }else if(this.heartPV <= 0) {
            console.log("Game Over ! Vous avez perdu !");
            this.jeuDemarre = false; // Indique que le jeu n'est plus en cours
            this.jeuTermine = true; // Indique que le jeu est terminé
            lancerVagueBtn.disabled = false;
            document.getElementById('divEcranSombre').style.display = 'flex'; // Affiche l'image de défaite
            document.getElementById('divImgDefaite').style.display = 'flex'; // Affiche l'image de défaite
        }
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
    
        this.gestionStructures();
    
        // Maj des ennemis
        if (this.jeuDemarre) this.majEnnemis();

        // Mise à jour de l'interface utilisateur
        this.majUI();
        if (!this.jeuTermine) this.verifChangementVague();
        // boucle suivante
        requestAnimationFrame(() => this.boucleDeJeu());
    }

    /**
     * Initialise et démarre la boucle principale du jeu.
     * - Place des tours par défaut sur tous les emplacements disponibles.
     * - Configure l'événement mousemove pour afficher la portée d'une tour lors du survol.
     * - Configure le bouton "lancerVagueBtn" pour démarrer une nouvelle vague et le désactive après clic.
     * - Lance la boucle principale du jeu via `boucleDeJeu`.
     */
    play(){
        for (const emplacement of this.niveau.emplacementsTower) {
            this.emplacements.push(new Emplacement(emplacement, this)); // Ajoute l'emplacement à la liste des emplacements
        }
        this.canvas.addEventListener("mousemove", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            for (const emplacement of this.emplacements) {
                const dx = mouseX - emplacement.x;
                const dy = mouseY - emplacement.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= 20) {
                    if (emplacement.tour) emplacement.tour.afficherPortee = true; // Affiche la portée de la tour
                } else {
                    if (emplacement.tour) emplacement.tour.afficherPortee = false; // Masque la portée de la tour
                }
            }
        });

        this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            for (const emplacement of this.emplacements) {
                const dx = mouseX - emplacement.x;
                const dy = mouseY - emplacement.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= emplacement.taille / 2) {
                    this.golds += emplacement.clicEmplacement(); // Gère le clic sur l'emplacement
                }
            }
        });

        const lancerVagueBtn = document.getElementById('lancerVagueBtn');
        lancerVagueBtn.addEventListener('click', () => {
            lancerVagueBtn.disabled = true; // Désactive le bouton pour éviter les clics multiples
            this.jeuDemarre = true; // Indique que le jeu a démarré
            for(const [type, data] of Object.entries(this.ennemiesASpawn)) {
                data.lastSpawnTime = Date.now(); // Réinitialise le temps de dernier spawn
            }
        });
        this.initialisationVague(); // Initialise les ennemis de la vague
        this.spawnEnnemis(); // Lance le spawn des ennemis
        this.boucleDeJeu();
    }
}