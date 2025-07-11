
export class Noeud {
    constructor(idHTML, titre, description, top, left, prix, typePrix, menuTechonologies, enfants, nbLvl, etat = 'cache') {
        this.idHTML = idHTML;
        this.titre = titre;
        this.description = description;
        this.typePrix = typePrix;
        this.prix = prix;
        this.prixAmelioration = this.prix*2; // Prix de l'amélioration, initialisé à 0
        this.debloque = false;
        this.etat = etat; // possibilités : 'cache' | 'inconnu' | 'bloque' | 'lvlMin' | 'lvlMax'
        this.lvl = 0;
        this.nbLvl = nbLvl; // Nombre de niveaux possibles pour cette technologie
        this.menuTechonologies = menuTechonologies;
        this.divElementHTML = document.getElementById(idHTML);
        this.divElementHTML.style.top = top + 'px';
        this.divElementHTML.style.left = left + 'px';
        this.imgtechno = this.divElementHTML.querySelector('.debloquee');
        this.imgtechnoHiden = this.divElementHTML.querySelector('.hiden');
        this.enfants = enfants; // Enfants du noeud, s'il y en a
        this.divInfoNoeud = document.querySelector('#divInfoNoeud');

        this.imgtechno.addEventListener('mousedown', (e) => {
            if(e.button === 2){
                if(this.lvl > 1) {
                    this.vendreAmeliorationNoeud();
                }else{
                    this.vendre();
                }
            }else if(e.button === 0){
                if(this.debloque) {
                    this.ameliorerNoeud();
                }else {
                    this.debloquer();
                }
            }
        });
        this.imgtechno.addEventListener('mouseenter', () => this.detectionMouseOver());
        this.imgtechno.addEventListener('mouseleave', () => this.detectionMouseLeave());
        
    }

    getPosition(){
        return {
            x: this.divElementHTML.offsetLeft + (this.divElementHTML.offsetWidth / 2),
            y: this.divElementHTML.offsetTop + (this.divElementHTML.offsetHeight / 2)
        };
    }
    estCache() {
        return (this.imgtechno.classList.contains('cachee') && this.imgtechnoHiden.classList.contains('cachee'));
    }

    decouvrir() {
        // Disparition de l'image "inconnu"
        this.imgtechnoHiden.classList.remove('cachee');
        this.imgtechnoHiden.classList.add('apparition');
        this.etat = 'inconnu';
    }
    decouvrirMieux() {
        // Disparition de l'image "inconnu"
        this.imgtechnoHiden.classList.add('cachee');
        // Apparition de l'icone de la technologie
        this.imgtechno.classList.remove('cachee');
        this.imgtechno.classList.add('deblocage');
        this.etat = 'bloque';
    }
    async debloquer(source = 'clic') {
        this.debloque = true;
        this.prixAmelioration = this.prix * (this.lvl + 1); // Augmentation du prix pour l'amélioration
        this.etat = this.lvl==this.nbLvl ? 'lvlMax' : 'lvlMin';
        if(source === 'clic'){
            // Vérification du prix
            const monnaies = this.menuTechonologies.sauvegarde.monnaies;
            //console.log(monnaies);
            if (monnaies[this.typePrix] >= this.prix) {
                // enregistrement de la technologie débloquée
                await this.changerNivNoeud('+');
                this.lvl=1;
                this.prixAmelioration = this.prix * ((this.lvl+1)>this.nbLvl ? this.lvl : this.lvl+1);
                this.etat = this.lvl == this.nbLvl ? 'lvlMax' : 'lvlMin';
                this.menuTechonologies.sauvegarde.monnaies[this.typePrix] -= this.prix;
                // mise à jour des monnaies
                this.majMonnaies();
            }else {
                console.warn(`Pas assez de ${this.typePrix} pour débloquer la technologie ${this.idHTML} (${monnaies[this.typePrix]}/${this.prix}).`);
                return;
            }
        }
        // animation de déblocage
        this.imgtechno.classList.remove('cachee');
        this.imgtechno.classList.add('deblocage');
        // Decouverte des enfans
        for(const enfantId of this.enfants){
            const noeud = this.menuTechonologies.noeuds.find(n => n.idHTML === enfantId);
            noeud.decouvrirMieux();
            for(const enfantDenfantId of noeud.enfants){
                const enfantNoeud = this.menuTechonologies.noeuds.find(n => n.idHTML === enfantDenfantId);
                enfantNoeud.decouvrir();
            }
        }
        // dessin des liens vers les enfants
        this.menuTechonologies.dessinerLiensNoeuds();
    }
    async vendre(n=0) {
        //console.log(`Vente du noeud ${this.idHTML} - n = ${n}`);
        if(this.debloque) {
            while(this.lvl > 1) {
                // On vend les améliorations avant de vendre le noeud
                this.vendreAmeliorationNoeud();
            }
            await this.changerNivNoeud('-');
            this.debloque = false;
            this.menuTechonologies.sauvegarde.monnaies[this.typePrix] += this.prix*this.lvl; // On récupère le prix de l'amélioration
            this.lvl=0;
            this.etat = 'bloque';
        }
        switch (n) {
            case 0:
                // On ne fait rien de plus, on a juste vendu le noeud
                break;
            case 1:
                // On vend le noeud et on le remet en "hidden"
                this.etat = 'inconnu';
                this.imgtechno.classList.remove('deblocage');
                this.imgtechno.classList.add('cachee');
                this.imgtechnoHiden.classList.remove('cachee');
                this.imgtechnoHiden.classList.add('apparition');
                break;
            default:
                this.etat = 'cache';
                this.imgtechno.classList.remove('deblocage');
                this.imgtechno.classList.add('cachee');
                this.imgtechnoHiden.classList.remove('apparition');
                this.imgtechnoHiden.classList.add('cachee');
        }
        for(const enfantId of this.enfants) {
            const noeud = this.menuTechonologies.noeuds.find(n => n.idHTML === enfantId);
            await noeud.vendre(n+1); // On attend que tout soit bien vendu récursivement
        }
        // dessin des liens vers les enfants
        this.menuTechonologies.dessinerLiensNoeuds();
        this.majMonnaies();
    }

    ameliorerNoeud() {
        if(this.lvl < this.nbLvl) {
            if(this.menuTechonologies.sauvegarde.monnaies[this.typePrix] < this.prixAmelioration) {
                console.warn(`Pas assez de ${this.typePrix} pour améliorer le noeud ${this.idHTML} (${this.menuTechonologies.sauvegarde.monnaies[this.typePrix]}/${this.prixAmelioration}).`);
                return;
            }
            if (!this.changerNivNoeud('+')) return;
            this.menuTechonologies.sauvegarde.monnaies[this.typePrix] -= this.prixAmelioration;
            this.majMonnaies();
            const lvlCible = this.lvl + 1;
            this.lvl = lvlCible;
            this.prixAmelioration = this.prix * ((lvlCible+1)>this.nbLvl ? lvlCible : lvlCible+1); // Augmentation du prix pour l'amélioration

            this.etat = this.lvl == this.nbLvl ? 'lvlMax' : 'lvlMin';
            // Mise à jour de l'image
            this.menuTechonologies.dessinerLiensNoeuds();
        }else {
            console.warn(`La technologie '${this.idHTML}' est déjà au niveau maximum : ${this.nbLvl}`);
        }
    }
    vendreAmeliorationNoeud() {
        //console.log(`Vente de l'amélioration du noeud ${this.idHTML} - niveau actuel : ${this.lvl}`);
        if(this.lvl > 1) {
            if(!this.changerNivNoeud('-')) return;
            const lvlCible = this.lvl - 1;
            this.lvl = lvlCible;
            const prixRembourse = this.prixAmelioration;
            this.prixAmelioration = this.prix * (lvlCible); // Réduction du prix pour l'amélioration
            this.menuTechonologies.sauvegarde.monnaies[this.typePrix] += prixRembourse;
            this.majMonnaies();
            this.etat = 'lvlMin'; // Mise à jour de l'état
            // Mise à jour de l'image
            this.menuTechonologies.dessinerLiensNoeuds();
        }
    }

    async changerNivNoeud(direction) {
        const lvlCible = direction == '+' ? this.lvl + 1 : this.lvl - 1;
        const montant = direction == '+' ? this.prix*(this.lvl + 1) : this.prix*this.lvl;
        //console.log('prix = ',(montant));
        const url = "../serv/gestionSaves.php";
        try {
            // création de la requete pour accéder au php
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=ameliorerTechno'+'&typeMonnaie=' + this.typePrix + '&montant=' + montant + 
                      '&nom=' + this.menuTechonologies.nomSauvegarde + '&nomTechno=' + this.idHTML + '&direction=' + (direction=='+'?'up':'down') + '&lvl=' + lvlCible
            });

            const data = await response.text();
            console.log(data);
            return data.resultat === true;//'succes';
        } catch (error) {
            console.error('Erreur récupération données :', error);
        }
    }



    detectionMouseOver() {
        // Démarre un timer de 0.5s
        this.timerSurvol = setTimeout(() => {
            this.afficherInfo();
        }, 500);
    }
    detectionMouseLeave(){
        // Stoppe le timer si la souris quitte avant 0.5s
        clearTimeout(this.timerSurvol);
        this.cacherInfo();
    }

    afficherInfo(){
        this.divInfoNoeud.style.top = `${this.divElementHTML.offsetTop - this.divInfoNoeud.offsetHeight - 35}px`;
        this.divInfoNoeud.style.left = `${this.divElementHTML.offsetLeft - (this.divInfoNoeud.offsetWidth/2)}px`;
        this.divInfoNoeud.classList.remove('cachee');
        this.divInfoNoeud.classList.add('apparition');
        this.divInfoNoeud.querySelector('#titre').firstChild.nodeValue = this.titre;
        this.divInfoNoeud.querySelector('#lvl').firstChild.nodeValue = 'Niveau : ' + this.lvl + '/' + this.nbLvl;
        this.divInfoNoeud.querySelector('#prix').firstChild.nodeValue = 'Prix : ' + (this.lvl<this.nbLvl?((this.lvl==0) ? this.prix : this.prixAmelioration):'Max');
        this.divInfoNoeud.querySelector('#description').firstChild.nodeValue = this.description;
    }
    cacherInfo() {
        this.divInfoNoeud.classList.remove('apparition');
        this.divInfoNoeud.classList.add('cachee');
    }

    majMonnaies() {
        const monnaies = this.menuTechonologies.sauvegarde.monnaies;
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
}