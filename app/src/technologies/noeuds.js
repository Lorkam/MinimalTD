
export class Noeud {
    constructor(idHTML, prix, typePrix, menuTechonologies, enfants = []) {
        this.idHTML = idHTML;
        this.prix = prix;
        this.typePrix = typePrix;
        this.menuTechonologies = menuTechonologies;
        this.divElementHTML = document.getElementById(idHTML);
        this.imgtechnoDebloquee = this.divElementHTML.querySelector('.debloquee');
        this.imgtechnoBloquee = this.divElementHTML.querySelector('.bloquee');
        this.imgtechnoHiden = this.divElementHTML.querySelector('.hiden');
        this.enfants = enfants; // Enfants du noeud, s'il y en a
        this.divInfoNoeud = document.querySelector('#divInfoNoeud');


        this.imgtechnoBloquee.addEventListener('mousedown', (e) => {
            if(e.button  === 0){
                this.debloquer();
            }else if(e.button  === 2){
                console.log(`Clic droit sur le noeud ${this.idHTML}.`);
            }
        });
        this.imgtechnoDebloquee.addEventListener('mouseenter', () => this.detectionMouseOver());
        this.imgtechnoBloquee.addEventListener('mouseenter', () => this.detectionMouseOver());

        this.imgtechnoDebloquee.addEventListener('mouseleave', () => this.detectionMouseLeave());
        this.imgtechnoBloquee.addEventListener('mouseleave', () => this.detectionMouseLeave());
    }

    getPosition(){
        return {
            x: this.divElementHTML.offsetLeft + (this.divElementHTML.offsetWidth / 2),
            y: this.divElementHTML.offsetTop + (this.divElementHTML.offsetHeight / 2)
        };
    }
    estCache() {
        return (this.imgtechnoDebloquee.classList.contains('cachee') && this.imgtechnoBloquee.classList.contains('cachee') && this.imgtechnoHiden.classList.contains('cachee'));
    }

    decouvrir() {
        this.imgtechnoHiden.classList.remove('cachee');
        this.imgtechnoHiden.classList.add('apparition');
    }
    decouvrirMieux() {
        // Disparition de l'image "hidden"
        this.imgtechnoHiden.classList.add('cachee');

        // Apparition de l'image "bloquée"
        this.imgtechnoBloquee.classList.remove('cachee');
        this.imgtechnoBloquee.classList.add('apparition');
    }
    debloquer() {
        // Placeholder for unlocking the node
        this.imgtechnoBloquee.classList.remove('apparition');
        this.imgtechnoBloquee.classList.add('cachee');
        this.imgtechnoDebloquee.classList.remove('cachee');
        this.imgtechnoDebloquee.classList.add('deblocage');
        // Decouverte des enfans
        for(const enfantId of this.enfants){
            const noeud = this.menuTechonologies.noeuds.find(n => n.idHTML === enfantId);
            noeud.decouvrirMieux();
            for(const enfantDenfantId of noeud.enfants){
                const enfantNoeud = this.menuTechonologies.noeuds.find(n => n.idHTML === enfantDenfantId);
                enfantNoeud.decouvrir();
            }
        }
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
    }
    cacherInfo() {
        this.divInfoNoeud.classList.remove('apparition');
        this.divInfoNoeud.classList.add('cachee');
    }
}