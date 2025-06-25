import { Enemy } from "./enemy.js";
import { Tower } from "./tower.js";


export class Projectile {
    /**
     * Crée une nouvelle instance de Projectile.
     * @param {Tower} tower - L'objet tour qui tire le projectile.
     * @param {Enemy} cible - La cible visée par le projectile.
     * @property {Tower} tower - Référence à la tour qui a tiré le projectile.
     * @property {Enemy} cible - La cible du projectile.
     * @property {number} x - Coordonnée x de la position de départ du projectile.
     * @property {number} y - Coordonnée y de la position de départ du projectile.
     * @property {number} speed - Vitesse à laquelle le projectile se déplace.
     * @property {number} damage - Quantité de dégâts infligés par le projectile.
     */
    constructor(tour, cible) {
        this.tour = tour;
        this.cible = cible;
        this.x = tour.position.x;
        this.y = tour.position.y;
        this.couleur = "yellow"; // Couleur du projectile
        this.speed = 10;
        var degatsInfliges;
        console.log(this.tour);
        if(Math.random(100) < this.tour.tauxCrit){
            degatsInfliges = this.tour.degats * this.tour.multiplicateurCrit; // Dégâts infligés en cas de critique
            this.couleur = "red"; // Change la couleur du projectile en rouge pour indiquer un coup critique
        }else{
            degatsInfliges = this.tour.degats; // Dégâts normaux
        }
        this.degats = degatsInfliges; // Dégâts infligés par le projectile
    }

    /**
     * Inflige des dégâts à l'ennemi ciblé, en tenant compte des coups critiques.
     * Si un coup critique est déclenché (en fonction du tauxCrit de la tour), 
     * applique un multiplicateur de dégâts et change la couleur du projectile en rouge.
     * Réduit les points de vie (pv) de la cible en conséquence.
     */
    toucherEnnemi() {
        this.cible.pv -= this.degats; // Applique les dégâts à l'ennemi
    }

    /**
     * Met à jour la position du projectile vers sa cible.
     * Si le projectile atteint la cible, applique les dégâts et indique la fin.
     * 
     * @returns {boolean} Retourne true si le projectile a atteint sa cible et appliqué les dégâts, false sinon.
     */
    update() {
        const dx = this.cible.x - this.x;
        const dy = this.cible.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.speed) {
            // Si le projectile atteint la cible, inflige des dégâts et supprime le projectile
            this.toucherEnnemi();
            return true; // Indique que le projectile a atteint sa cible
        } else {
            // Déplace le projectile vers la cible
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
            return false; // Indique que le projectile n'a pas encore atteint sa cible
        }
    }

    /**
     * Dessine le projectile sur le canvas.
     * @param {CanvasRenderingContext2D} ctx - Le contexte du canvas sur lequel dessiner.
     */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur; // Couleur du projectile
        ctx.translate(this.x, this.y);
        // Calcule l'angle vers la cible
        const dx = this.cible.x - this.x;
        const dy = this.cible.y - this.y;
        const angle = Math.atan2(dy, dx);
        ctx.rotate(angle);
        ctx.beginPath();
        // Dessine une ellipse (ovale) centrée sur (0, 0), inclinée vers la cible
        ctx.ellipse(0, 0, 8, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

}