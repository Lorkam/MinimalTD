import { Enemy } from "./enemy.js";
import { Tower } from "./tower.js";


export class Projectile {
    /**
     * Crée une nouvelle instance de Projectile.
     * @param {Tower} tower - L'objet tour qui tire le projectile.
     * @param {Enemy} target - La cible visée par le projectile.
     * @property {Tower} tower - Référence à la tour qui a tiré le projectile.
     * @property {Enemy} target - La cible du projectile.
     * @property {number} x - Coordonnée x de la position de départ du projectile.
     * @property {number} y - Coordonnée y de la position de départ du projectile.
     * @property {number} speed - Vitesse à laquelle le projectile se déplace.
     * @property {number} damage - Quantité de dégâts infligés par le projectile.
     */
    constructor(tower, target) {
        this.tower = tower;
        this.target = target;
        this.x = tower.position.x;
        this.y = tower.position.y;
        this.speed = 5;
        this.damage = tower.degats;
    }

    /**
     * Met à jour la position du projectile vers sa cible.
     * Si le projectile atteint la cible, applique les dégâts et indique la fin.
     *
     * @returns {boolean} Retourne true si le projectile a atteint sa cible et appliqué les dégâts, false sinon.
     */
    update() {
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.speed) {
            // Si le projectile atteint la cible, inflige des dégâts et supprime le projectile
            this.target.pv -= this.damage;
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
        ctx.fillStyle = "yellow"; // Couleur du projectile
        ctx.translate(this.x, this.y);
        // Calcule l'angle vers la cible
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const angle = Math.atan2(dy, dx);
        ctx.rotate(angle);
        ctx.beginPath();
        // Dessine une ellipse (ovale) centrée sur (0, 0), inclinée vers la cible
        ctx.ellipse(0, 0, 8, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

}