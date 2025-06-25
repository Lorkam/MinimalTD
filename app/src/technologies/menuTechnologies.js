import { Noeud } from "./noeuds.js";
import { Sauvegarde } from "../sauvegarde/sauvegarde.js";

export class MenuTechnologies {
    constructor(nomSauvegarde) {
        this.noeuds = [];

        this.canvas = document.querySelector('#canvasTechno');
        this.ctx = this.canvas.getContext('2d');

        this.sauvegarde = new Sauvegarde(nomSauvegarde);
        this.nomSauvegarde = nomSauvegarde;
        this.divContainerNoeuds = document.querySelector('#divContainerNoeuds');


        // Désactivation du menu contextuel de google Chrome
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    }

    /**
     * Initialise le menu des technologies en fonction de l'état de la sauvegarde.
     * 
     * - Charge les données sauvegardées pour l'utilisateur/profil courant.
     * - Débloque les technologies marquées comme débloquées dans la sauvegarde.
     * - Met à jour les nœuds de l'UI pour refléter les technologies débloquées.
     * - Met à jour l'affichage des monnaies à partir de la sauvegarde.
     * 
     * @async
     * @returns {Promise<void>} Résout lorsque l'initialisation est terminée.
     */
    async initialiserSauvegarde(){
        /* Déblocage des technologies en fonction de la sauvegarde */
        this.sauvegarde = (await this.sauvegarde.lireSaves()).saves[this.sauvegarde.nom];
        const technos = this.sauvegarde.technologies;
        const technoDebloquees = [];
        //console.log('this.sauvegarde :', this.sauvegarde);
        for(const techno of Object.keys(technos)) {
            if (technos[techno]['lvl1'].debloque === true) {
                //console.log("Technologie " + techno + " OK");
                technoDebloquees.push(techno);
            }
        }
        for(const noeud of this.noeuds) {
            if (technoDebloquees.includes(noeud.idHTML)) {
                noeud.debloquer('sauvegarde');
            }
        }
        /* Récupération des monaies de la sauvegarde */
        this.noeuds[0].majMonnaies();
    }

    /**
     * Charge de façon asynchrone les nœuds de technologies depuis le serveur et crée leurs éléments HTML associés.
     * Récupère les données des nœuds via une requête POST, puis pour chaque nœud :
     * - Crée une div conteneur avec les classes et IDs appropriés.
     * - Ajoute une image cachée ou visible représentant l'état de la technologie.
     * - Ajoute l'élément du nœud au conteneur dans le DOM.
     * - Instancie et stocke un objet Noeud avec les propriétés du nœud.
     *
     * @async
     * @returns {Promise<void>} Résout lorsque tous les nœuds sont chargés et affichés.
     */
    async chargerNoeuds(){
        //console.log('test', this.divContainerNoeuds);
        const url = '../serv/gestionTechno.php'
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=chargerNoeud'
        });
        const data = await response.json();
        //console.log(data);
        for(const noeud of Object.keys(data)) {
            // Création de l'élément HTML pour le noeud
            const elementHTML = document.createElement('div');
            elementHTML.id = data[noeud].nom;
            elementHTML.classList.add('noeud');
            // Image hiden
            const imgTechnoHiden = document.createElement('img');
            imgTechnoHiden.src = "../assets/img/pointInterrogation.png";
            imgTechnoHiden.classList.add('imgArbreTechno', 'hiden', 'cachee');
            if(data[noeud].etatParDefaut=="inconnu") imgTechnoHiden.classList.remove('cachee');
            elementHTML.appendChild(imgTechnoHiden);
            // Icone technologie
            const imgTechno = document.createElement('img');
            imgTechno.src = data[noeud].lienImage1;
            imgTechno.classList.add('imgArbreTechno', 'debloquee', 'cachee');
            if(data[noeud].etatParDefaut=="visible") imgTechno.classList.remove('cachee');
            elementHTML.appendChild(imgTechno);
            // Ajout des div dans la page
            this.divContainerNoeuds.appendChild(elementHTML);
            const etat = data[noeud].nom=='centre' ? 'bloque' : 'inconnu';
            // Ajout des noeuds dans le tableau
            this.noeuds.push(new Noeud(data[noeud].nom, 
                data[noeud].description, 
                data[noeud].position.y, 
                data[noeud].position.x, 
                data[noeud].prix.quantite, 
                data[noeud].prix.type, 
                this, 
                data[noeud].technologiesFille, 
                data[noeud].nbLvl,
                etat
            ));
        }
    }

    /**
     * Met à jour **l'état** (`etat`) et le niveau (`lvl`) de chaque noeud de technologie (`noeud`) en fonction des données de sauvegarde.
     * 
     * Pour chaque noeud :
     * - Compte le nombre de niveaux débloqués (`debloque`).
     * - Définit `noeud.lvl` au nombre de niveaux débloqués.
     * - Définit `noeud.etat` à "lvlMax" si tous les niveaux sont débloqués, ou à "lvlMin" si seul le premier niveau est débloqué.
     *
     * Suppose que chaque noeud possède une propriété `idHTML` pour correspondre avec les technologies sauvegardées,
     * et que chaque technologie contient des objets de niveau avec une propriété booléenne `debloque`.
     */
    chargerEtatNoeuds() {
        const technologies = this.sauvegarde.technologies;
        for (const noeud of this.noeuds) {
            const tech = technologies[noeud.idHTML];
            if (!tech) continue;
            
            const niveaux = Object.values(tech);
            //console.log(noeud.idHTML, niveaux);
            var nblvlDebloque = 0;
            for (const niveau of niveaux) {
                if (niveau.debloque === true) {
                    nblvlDebloque++;
                }
            }
            noeud.lvl = nblvlDebloque;
            noeud.prixAmelioration = noeud.prix*(noeud.lvl+1);

            const tousDebloques = nblvlDebloque == niveaux.length;
            const lvl1Debloque = tech.lvl1?.debloque === true;
            //console.log(noeud, 'tousDebloques:', tousDebloques, 'lvl1Debloque:', lvl1Debloque);

            if (tousDebloques) {
                noeud.etat = "lvlMax";
            } else if (lvl1Debloque) {
                noeud.etat = "lvlMin";
            }
        }
    }

    /**
     * Enregistre une action technologique en envoyant une requête POST à un script PHP.
     *
     * @async
     * @param {string} nomTechno - Le nom de la technologie concernée par l'action.
     * @param {string} type - Le type de monnaie utilisé pour l'action.
     * @param {number} montant - Le montant de monnaie dépensé ou utilisé.
     * @param {string} actionTechno - Le type d'action technologique à enregistrer.
     * @returns {Promise<void>} Une promesse qui se résout lorsque l'action est enregistrée.
     */
    async enregisterActionTechno(nomTechno, type, montant, actionTechno) {
        const url = "../serv/gestionSaves.php";
        try {
            // création de la requete pour accéder au php
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=enregisterActionTechno'+'&typeMonnaie=' + type + '&montant=' + montant + '&nom=' + this.nomSauvegarde + '&nomTechno=' + nomTechno + '&actionTechno='+actionTechno
            });

            const data = await response.text();
            //console.log(data);
            this.sauvegarde.monnaies[type] = parseInt(data, 10);
            return;
        } catch (error) {
            console.error('Erreur récupération données :', error);
        }
    }

    /**
     * Dessine les liens entre les nœuds et les nœuds eux-mêmes sur le canvas.
     * 
     * - Efface le canvas avant de dessiner.
     * - Pour chaque nœud, dessine les liens vers ses enfants visibles.
     * - Dessine un cercle pour chaque nœud visible, avec un style différent selon son état :
     *   - 'inconnu' ou 'bloque' : cercle en pointillés noirs.
     *   - 'lvlMin' : cercle en pointillés orange, la longueur des pointillés dépend du niveau.
     *   - 'lvlMax' : cercle en trait continu bleu.
     * 
     * Prend en compte la position et la taille des éléments HTML associés aux nœuds pour le placement.
     * Ignore les nœuds enfants cachés.
     */
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
                if (noeud.etat=='inconnu'||noeud.etat=='bloque') {
                    this.ctx.beginPath();
                    this.ctx.setLineDash([5, 5]);
                    this.ctx.arc(posNoeudX, posNoeudY - 2, 30, 0, Math.PI * 2);
                    this.ctx.strokeStyle = '#000000';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
                }else if(noeud.etat == "lvlMin") {
                    this.ctx.beginPath();
                    this.ctx.setLineDash([5*(noeud.nbLvl - noeud.lvl), 5*(noeud.nbLvl - noeud.lvl)]);
                    this.ctx.arc(posNoeudX, posNoeudY - 2, 30, 0, Math.PI * 2);
                    this.ctx.strokeStyle = '#ff7300';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    this.ctx.setLineDash([]);
                }else if(noeud.etat == "lvlMax") {
                    this.ctx.beginPath();
                    this.ctx.setLineDash([5, 0]); // 5px trait, 0px espace
                    this.ctx.arc(posNoeudX, posNoeudY - 2, 30, 0, Math.PI * 2);
                    this.ctx.strokeStyle = '#00b9d1';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    this.ctx.setLineDash([]); // Réinitialise le style pour les dessins suivants
                }
            }
            //console.log(noeud);
        }
    }
}

