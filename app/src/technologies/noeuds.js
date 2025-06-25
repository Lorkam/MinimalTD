
export class Noeud {
    constructor(idHTML, description, top, left, prix, typePrix, menuTechonologies, enfants, nbLvl, etat = 'cache') {
        this.idHTML = idHTML;
        this.description = description;
        this.prix = prix;
        this.typePrix = typePrix;
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
                console.log(`Clic droit sur le noeud ${this.idHTML}.`);
                this.vendre();
            }else if(e.button === 0){
                this.debloquer();
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
        this.lvl=1;
        this.etat = this.lvl==this.nbLvl ? 'lvlMax' : 'lvlMin';
        if(source === 'clic'){
            // Vérification du prix
            const monnaies = this.menuTechonologies.sauvegarde.monnaies;
            //console.log(monnaies);
            if (monnaies[this.typePrix] >= this.prix) {
                // enregistrement de la technologie débloquée
                await this.menuTechonologies.enregisterActionTechno(this.idHTML, this.typePrix, this.prix, 'achat');
                // mise à jour des monnaies
                this.majMonnaies();
            }else {
                console.error(`Pas assez de ${this.typePrix} pour débloquer la technologie ${this.idHTML} (${monnaies[this.typePrix]}/${this.prix}).`);
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
        console.log(`Vente du noeud ${this.idHTML} - n = ${n}`);
        if(this.debloque) {
            await this.menuTechonologies.enregisterActionTechno(this.idHTML, this.typePrix, this.prix, 'vente');
            this.majMonnaies();
            this.debloque = false;
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
        this.divInfoNoeud.firstChild.nodeValue = this.description;
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