import { Enemy } from "./enemy.js";
import { Projectile } from "./projectiles.js";

export class Tower {
    constructor(type, portee, position) {
        this.type = type;
        this.portee = portee;
        this.position = position;
        this.listeBalles = []; // Liste des projectiles tirés par la tour
    }
    getDetails() {
        return `Tower type: ${this.type}, portee: ${this.portee}m, position: (${this.position.x}, ${this.position.y})`;
    }


}

export class TourClassique extends Tower {
    constructor(position) {
        super('Classique', 100, position);
        this.degats = 10; // Dégâts infligés par la tour
        this.attaqueSpeed = 1000; // Temps de recharge en millisecondes
        this.derniereAttaque = Date.now();
        this.afficherPortee = false; // Indique si la portée de la tour doit être affichée
    }

    dessiner(ctx) {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        // Dessiner un carré bleu à bords arrondis centré sur la position
        const x = this.position.x - 15;
        const y = this.position.y - 15;
        const width = 30;
        const height = 30;
        const radius = 7;
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Dessiner un cercle blanc au centre
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.beginPath(); // Pour éviter que le stroke du carré ne touche le cercle
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dessiner la portée de la tour
        if(this.afficherPortee){
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.portee, 0, 2 * Math.PI);
            ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    /**
     * Searches for the first enemy within the tower's range.
     *
     * @param {Array<Enemy>} listeEnnemis - The list of enemy objects to search through. Each enemy should have `x` and `y` properties.
     * @returns {Enemy|undefined} The first enemy object found within range, or `undefined` if none are found.
     */
    chercherEnnemi(listeEnnemis) {
        for (const ennemi of listeEnnemis) {
            const distance = Math.sqrt(
                Math.pow(ennemi.x - this.position.x, 2) +
                Math.pow(ennemi.y - this.position.y, 2)
            );
            if (distance <= this.portee) {
                return ennemi; // Retourne le premier ennemi trouvé dans la portée
            }
        }
    }

    tirer(enemy) {
        if (Date.now() - this.derniereAttaque < this.attaqueSpeed) {
            return; // Ne tire pas si le temps de recharge n'est pas écoulé
        }
        this.listeBalles.push(new Projectile(this, enemy));
        this.derniereAttaque = Date.now(); // Met à jour le temps de la dernière attaque
    }

    majBalles(ctx){
        for (let i = this.listeBalles.length - 1; i >= 0; i--) {
            const balle = this.listeBalles[i];
            if (balle.update()) {
                // Si la balle a atteint sa cible, on la supprime de la liste
                this.listeBalles.splice(i, 1);
            }
            balle.draw(ctx);
        }
    }

}