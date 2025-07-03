import { EnnemiClassique, EnnemiTank, EnnemiRapide, EnnemiReplicateur, EnnemiReplique, BossMontagne, BossInvocateur } from "./enemy.js";
import { Emplacement } from "./emplacement.js";
import { Sauvegarde } from "../sauvegarde/sauvegarde.js";


export class Partie {
    constructor(niveau, vague, nomSauvegarde) {
        this.sauvegarde = new Sauvegarde(nomSauvegarde); // Instance de la classe Sauvegarde
        this.nomSauvegarde = nomSauvegarde;
        /* Chargement du niveau */
        this.niveau = {};
        this.statTours = {}; // Statistiques des tours
        this.statEnnemis = {}; // Statistiques des ennemis
        this.nomNiveau = niveau; // Nom du niveau
        this.ennemies = []; // Liste des ennemis
        this.ennemiesASpawn = {}; // Liste des ennemis
        this.emplacements = []; // Liste des emplacements pour les tours
        this.towers = []; // Liste des tours
        this.projectiles = []; // Liste des projectiles
        this.heartPV = 3; // Points de vie du coeur
        
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.imageCoeur = new Image();
        this.imageCoeur.src = '../assets/img/heart.png';
        this.jeuDemarre = false; // Indique si le jeu a démarré
        this.jeuTermine = false; // Indique si le jeu a démarré
        this.HTMLnumVague = document.getElementById('numVague');
        this.HTMLnbEnnemisRestants = document.getElementById('nbEnnemisRestants');
        this.HTMLnbEnnemisMorts = document.getElementById('nbEnnemisMorts');
        this.HTMLgolds = document.getElementById('golds');

        this.vague = vague; // Compteur de vagues
        this.golds = 10; // Or du joueur
        this.monnaies = {'triangles':0, 'ronds':0, 'hexagones':0}; // Monnaie pour les technologies
    
        this.totalEnnemis = 0; // Nombre total d'ennemis à spawn dans la vague
        this.nbEnnemisMorts = 0; // Compteur d'ennemis morts

        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });

    }

    /**
     * Initialise le niveau en récupérant les données depuis le serveur via une requête POST.
     * Met à jour les propriétés `niveau`, `chemin` et `heartPos` de l'instance avec les données reçues.
     * 
     * @async
     * @returns {Promise<void>} Une promesse qui se résout lorsque les données du niveau sont chargées.
     * @throws {Error} Affiche une erreur dans la console si la récupération des données échoue.
     */
    async initialiserNiveau() {
        const url = '../serv/gestionNiveaux.php';
        console.log(this.nomNiveau);
        try {
            // Création de la requête pour accéder au PHP
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=chargerNiveau' + '&niveau=' + encodeURIComponent(this.nomNiveau)
            });

            const data = await response.json();
            //console.log(data);
            this.niveau = data; // Récupère le niveau depuis la réponse
            this.chemin = this.niveau.chemin;
            this.heartPos = this.niveau.heart;
        } catch (error) {
            console.error('Erreur récupération données :', error);
        }
    }
    /**
     * Récupère et charge de manière asynchrone les statistiques des tours depuis le serveur.
     * Envoie une requête POST au backend PHP pour obtenir les statistiques des tours, puis met à jour
     * les propriétés `statTours` et `prixTourClassique` de l'instance avec les données reçues.
     *
     * @async
     * @returns {Promise<void>} Résout lorsque les statistiques des tours ont été chargées et définies.
     * @throws Affiche une erreur dans la console si la récupération ou le traitement des données échoue.
     */
    async chargerStatTours() {
        const url = '../serv/gestionTours&Ennemis.php';
        try {
            // Création de la requête pour accéder au PHP
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=chargerStatTours'
            });

            const data = await response.json();
            //console.log(data);
            this.statTours = data; // Récupère les statistiques des tours depuis la réponse
            this.prixTourClassique = this.statTours.TourClassique.prix; // Prix de la tour classique
        } catch (error) {
            console.error('Erreur récupération données :', error);
        }
    }
    /**
     * Récupère et charge de manière asynchrone les statistiques des ennemis depuis le serveur.
     * Envoie une requête POST au backend PHP pour obtenir les statistiques des ennemis, puis met à jour
     * la propriété `statEnnemis` de l'instance avec les données reçues.
     *
     * @async
     * @returns {Promise<void>} Résout lorsque les statistiques des ennemis ont été chargées et définies.
     * @throws Affiche une erreur dans la console si la récupération ou le traitement des données échoue.
     */
    async chargerStatEnnemis() {
        const url = '../serv/gestionTours&Ennemis.php';
        try {
            // Création de la requête pour accéder au PHP
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=chargerStatEnnemis'
            });

            const data = await response.json();
            //console.log(data);
            this.statEnnemis = data; // Récupère les statistiques des ennemis depuis la réponse
        } catch (error) {
            console.error('Erreur récupération données :', error);
        }
    }
    /**
     * Initialise les modificateurs de la partie à partir de la sauvegarde.
     * Applique les bonus d'or de départ et de points de vie du cœur selon les modificateurs.
     * @returns {void}
     */
    initialiserModificateurs() {
        this.modificateurs = this.sauvegarde.modificateurs; // Liste des modificateurs de la partie
        this.golds += this.modificateurs.economie.goldsBonusDepart; // Ajoute le bonus d'or de départ
        this.heartPV += this.modificateurs.coeurBonus; // Ajoute le bonus de points de vie du coeur
        //console.log(this.modificateurs);
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
        for( const typeEnnemi of this.niveau.vagues[this.vague-1].ennemis) {
            //console.log(typeEnnemi);
            this.ennemiesASpawn[typeEnnemi.type] = {
                nb: typeEnnemi.nb, // Nombre d'ennemis à spawn
                intervale: typeEnnemi.intervale // Intervalle de spawn en millisecondes
            };
            this.totalEnnemis += typeEnnemi.nb; // Ajoute le nombre d'ennemis à spawn au total
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
                        ennemi = new EnnemiClassique(this); // Tu peux faire évoluer ça selon le type
                        break;
                    case "tank":
                        ennemi = new EnnemiTank(this); // Tu peux faire évoluer ça selon le type
                        break;
                    case "rapide":
                        ennemi = new EnnemiRapide(this); // Tu peux faire évoluer ça selon le type
                        break;
                    case "EnnemiReplicateur":
                        ennemi = new EnnemiReplicateur(this); // Tu peux faire évoluer ça selon le type
                        console.log('Spawn d\'un ennemi replicateur');
                        break;
                    case "EnnemiReplique":
                        ennemi = new EnnemiReplique(this); // Tu peux faire évoluer ça selon le type
                        console.log('Spawn d\'un ennemi réplique');
                        break;
                    case "BossMontagne":
                        ennemi = new BossMontagne(this); // Tu peux faire évoluer ça selon le type
                        break;
                    case "BossInvocateur":
                        ennemi = new BossInvocateur(this); // Tu peux faire évoluer ça selon le type
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
        for (const ennemi of this.ennemies) {
            if (ennemi.update()) {
                ennemi.action(); // Appelle l'action de l'ennemi
                ennemi.draw(this.ctx);
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

    /**
     * Gère les actions de toutes les structures en parcourant chaque emplacement
     * et en invoquant ses actions pour le tour actuel.
     * @returns {void}
     */
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

    /**
     * Sauvegarde l'état actuel de la partie, y compris le résultat du niveau et les monnaies gagnées, sur le serveur.
     * Envoie une requête POST au backend PHP pour enregistrer la progression du joueur.
     *
     * @async
     * @param {boolean} reussite - Indique si le niveau a été réussi.
     * @returns {Promise<void>} Résout lorsque l'opération de sauvegarde est terminée.
     */
    async sauvegarder(reussite) {
        // Sauvegarde le passage(ou pas) du niveau et les monnaies gagnées
        const url = '../serv/gestionSaves.php';
        
        try {
            // création de la requete pour accéder au php
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=sauvegarder' + '&nom=' + encodeURIComponent(this.nomSauvegarde) +
                      '&niveau=' + encodeURIComponent(this.niveau.nom) + '&reussiteNiveau=' + encodeURIComponent(reussite) +
                      '&monnaies=' + encodeURIComponent(JSON.stringify(this.monnaies))
            });

            const data = await response.text();
            //console.log(data);
            return ;
        } catch (error) {
            console.error('Erreur récupération données :', error);
        }
    }

    /**
     * Vérifie et gère les transitions entre les vagues d'ennemis dans le jeu.
     * 
     * - Passe à la vague suivante si tous les ennemis de la vague actuelle sont vaincus et que ce n'est pas la dernière vague.
     * - Termine le niveau et affiche l'écran de victoire si la dernière vague est terminée.
     * - Termine la partie et affiche l'écran de défaite si les points de vie du joueur atteignent zéro.
     * 
     * Met à jour l'état du jeu, active/désactive les boutons et affiche les écrans de victoire/défaite selon le cas.
     */
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
            console.log("Félicitations ! Vous avez terminé ce niveau !");
            console.log(this.monnaies);
            this.sauvegarder(true); // Sauvegarde l'état du jeu
            this.jeuDemarre = false; // Indique que le jeu n'est plus en cours
            this.jeuTermine = true; // Indique que le jeu est terminé
            lancerVagueBtn.disabled = false;
            document.getElementById('divEcranSombre').style.display = 'flex'; // Affiche l'image de victoire
            document.getElementById('divImgVictoire').style.display = 'flex'; // Affiche l'image de victoire
        }else if(this.heartPV <= 0) {
            console.log("Game Over ! Vous avez perdu !");
            console.log(this.monnaies);
            this.sauvegarder(false); // Sauvegarde l'état du jeu
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
    async play(){
        await this.chargerStatTours();
        await this.chargerStatEnnemis();
        this.sauvegarde = (await this.sauvegarde.lireSaves()).saves[this.sauvegarde.nom]; // Récupère la sauvegarde actuelle
        this.initialiserModificateurs(); // Initialise les modificateurs de la partie
        await this.initialiserNiveau(); // Initialise les modificateurs de la partie
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

        const divOptionsEmplacement = document.querySelector('#divOptionsEmplacement')
        const divOptionsTour = document.querySelector('#divOptionsTour')
        this.canvas.addEventListener("mousedown", (e) => {
            divOptionsEmplacement.style.display = 'none'; // Masque les options de l'emplacement
            divOptionsTour.style.display = 'none'; // Masque les options de l'emplacement
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            for (const emplacement of this.emplacements) {
                const dx = mouseX - emplacement.x;
                const dy = mouseY - emplacement.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance <= emplacement.taille / 2) {
                    emplacement.clicEmplacement(e); // Gère le clic sur l'emplacement
                }
            }
        });
        divOptionsEmplacement.addEventListener('click', (e) => {
            this.golds += this.emplacementSelectionne.ajouterTour(e.target.id); // Ajoute une tour selon l'option sélectionnée
            divOptionsEmplacement.style.display = 'none'; // Masque les options de l'emplacement après l'ajout de la tour
        });
        divOptionsTour.addEventListener('click', (e) => {
            if(this.emplacementSelectionne.tour) this.golds += this.emplacementSelectionne.tour.actionTour(e.target.id); // Ajoute une tour selon l'option sélectionnée
            divOptionsTour.style.display = 'none'; // Masque les options de l'emplacement après l'ajout de la tour
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
        console.log(this);
        this.spawnEnnemis(); // Lance le spawn des ennemis
        this.boucleDeJeu();
    }


}// fin de la class Partie