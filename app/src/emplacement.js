import { TourClassique } from "./tower.js";

export class Emplacement {
    constructor(position) {
        this.x = position['x']; // Position X de l'emplacement
        this.y = position['y']; // Position Y de l'emplacement
        this.taille = 30; // Taille de l'emplacement
        this.image = new Image();
        this.image.src = './app/assets/img/emplacement.png';
        this.tour = null; // Tour placée sur cet emplacement (null si aucune)
    }

    dessiner(ctx){
        ctx.drawImage(this.image, this.x-15, this.y-15, 30, 30);
    }

    ajouterTour(type){
        switch (type) {
            case 'classique':
                this.tour = new TourClassique(this.x, this.y);
                break;
            // Ajouter d'autres types de tours ici si nécessaire
            default:
                console.error("Type de tour inconnu :", type);
        }
    }


    actionsDuTour(ctx) {
        // Vérifie si une tour est déjà placée sur cet emplacement
        if (this.tour) {
            console.log(this.tour);
            this.tour.dessiner(ctx);
        }else{
            // Si aucune tour n'est placée, dessine l'emplacement
            this.dessiner(ctx);
        }
    }
}