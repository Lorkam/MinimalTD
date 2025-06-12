
export class Noeud {
    constructor(idHTML, prix, typePrix, enfants = []) {
        this.idHTML = idHTML;
        this.prix = prix;
        this.typePrix = typePrix;
        this.divElementHTML = document.getElementById(idHTML);
        this.imgtechnoDebloquee = this.divElementHTML.querySelector('.debloquee');
        this.imgtechnoBloquee = this.divElementHTML.querySelector('.bloquee');
        this.imgtechnoBloquee.addEventListener('mousedown', (e) => {
            if(e.button  === 0){
                this.debloquer();
            }else if(e.button  === 2){
                console.log(`Clic droit sur le noeud ${this.idHTML}.`);
            }
        });
        this.imgtechnoHiden = this.divElementHTML.querySelector('.hiden');
        this.enfants = enfants; // Enfants du noeud, s'il y en a
    }
    
    decouvrir() {
        // Disparition de l'image "hidden"
        this.imgtechnoHiden.classList.add('cachee');

        // Apparition de l'image "bloquée"
        this.imgtechnoBloquee.classList.remove('cachee');
        this.imgtechnoBloquee.classList.add('apparition');
    }

    
    debloquer() {
        // Placeholder for unlocking the node
        console.log(`Déblocage du noeud ${this.idHTML}.`);
        this.imgtechnoBloquee.classList.remove('apparition');
        this.imgtechnoBloquee.classList.add('cachee');
        this.imgtechnoDebloquee.classList.remove('cachee');
        this.imgtechnoDebloquee.classList.add('deblocage');
        for(const enfant of this.enfants){
            const noeud = new Noeud(enfant, 0, 'or');
            noeud.decouvrir(); // Découverte de l'enfant
        }
    }
}