import { TourClassique } from "./tower.js";

export class Emplacement {
    constructor(position, partie) {
        this.partie = partie
        this.x = position['x']; // Position X de l'emplacement
        this.y = position['y']; // Position Y de l'emplacement
        this.taille = 30; // Taille de l'emplacement
        this.image = new Image();
        this.image.src = '../assets/img/emplacement.png';
        this.tour = null; // Tour placée sur cet emplacement (null si aucune)
    }

    dessiner(){
        this.partie.ctx.drawImage(this.image, this.x-25, this.y-25, 50, 50);
    }

    ajouterTour(type){
        switch (type) {
            case 'classique':
                const nouvelleTour = new TourClassique({x:this.x, y:this.y}, this.partie); // Crée une nouvelle tour classique
                if (this.partie.golds >= this.partie.prixTourClassique) { // Vérifie si l'or est suffisant
                    this.tour = nouvelleTour;
                    this.partie.towers.push(this.tour); // Ajoute la tour à la liste des tours
                    const cout = this.partie.prixTourClassique
                    this.partie.prixTourClassique *=2;
                    return -1*cout; // renvoie le coût de la tour
                }else{
                    console.warn("Pas assez d'or pour acheter cette tour.");
                    return 0; // Retourne 0 si l'or est insuffisant
                }
            // Ajouter d'autres types de tours ici si nécessaire
            default:
                console.warn("Type de tour inconnu :", type);
                return 0; // Retourne 0 si le type de tour est inconnu
        }
    }


    actionsDuTour() {
        // Vérifie si une tour est déjà placée sur cet emplacement
        if (this.tour) {
            this.tour.dessiner(this.partie.ctx);
            const ennemiProche = this.tour.chercherEnnemi(); // Cherche un ennemi à portée de la tour
            if (ennemiProche) {
                this.tour.tirer(ennemiProche);
            }
            this.tour.majBalles(this.partie.ctx);
        }else{
            // Si aucune tour n'est placée, dessine l'emplacement
            this.dessiner(this.partie.ctx);
        }
    }

    clicEmplacement(mouseEvent){
        // Vérifie si une tour est déjà placée sur cet emplacement
        if (this.tour) {
            if(mouseEvent.which == 3) { // Clic droit
                if(this.partie.modificateurs.lvlUpTours==true){
                    return this.tour.ameliorer();
                }else{
                    console.warn("Vous n'avez pas débloqué l'amélioration des tours.");
                    return 0; // Retourne 0 si l'amélioration est désactivée
                }
            } else {
                //console.log(this.tour);
                return 0; // Retourne l'or sans rien faire si une tour est déjà placée
            }
        } else {
            return this.ajouterTour('classique'); // Ajoute une tour classique si l'emplacement est libre
        }
    }
}