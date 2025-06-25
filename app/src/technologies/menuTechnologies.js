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

    async initialiserSauvegarde(){
        /* Déblocage des technologies en fonction de la sauvegarde */
        this.sauvegarde = (await this.sauvegarde.lireSaves()).saves[this.sauvegarde.nom];
        const technos = this.sauvegarde.technologies;
        const technoDebloquees = [];
        //console.log('this.sauvegarde :', this.sauvegarde);
        for(const techno of Object.keys(technos)) {
            if (technos[techno].lvl1.debloque === true) {
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

