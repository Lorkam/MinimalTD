import { Ennemi } from "./enemy.js";
import { Tower } from "./tower.js";


export class Projectile {
    /**
     * Crée une nouvelle instance de Projectile.
     * @param {Tower} tower - L'objet tour qui tire le projectile.
     * @param {Ennemi} cible - La cible visée par le projectile.
     * @property {Tower} tower - Référence à la tour qui a tiré le projectile.
     * @property {Ennemi} cible - La cible du projectile.
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

export class Onde extends Projectile {
    /**
     * Crée une nouvelle instance d'Onde, qui est un type de projectile.
     * @param {Tower} tower - L'objet tour qui tire l'onde.
     */
    constructor(tour, cible) {
        super(tour, cible);
        this.rayon = 5; // Rayon initial de l'onde
        this.couleur = "#00bfff77"; // Couleur de l'onde
        this.speed = 5; // Vitesse de l'onde
        this.ralentissement = this.tour.ralentissement; // Ralentissement appliqué par l'onde
        this.dureeRalentissement = this.tour.dureeRalentissement; // Durée du ralentissement
    }

    toucherEnnemi(cible) {
        if (typeof cible.ralenti === "undefined") cible.ralenti = false; // Initialise ralenti si non défini
        if (typeof cible.vitesseInitiale === "undefined") cible.vitesseInitiale = cible.speed;


        cible.speed = cible.vitesseInitiale * this.ralentissement;
        cible.ralenti = true;
        
        if (cible.ralentiTimeout) {
            clearTimeout(cible.ralentiTimeout);
        }
        cible.ralentiTimeout = setTimeout(() => {
            cible.ralenti = false;
            cible.speed = cible.vitesseInitiale;
            cible.ralentiTimeout = null; // Nettoyage
        }, this.dureeRalentissement);
    }

    update() {
        this.rayon += this.speed; // Augmente le rayon de l'onde à chaque mise à jour
        for(const ennemi of this.tour.partie.ennemies) {
            const dx = ennemi.x - this.x;
            const dy = ennemi.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= this.rayon) {
                this.toucherEnnemi(ennemi);
            }
        }
        if (this.rayon > this.tour.portee) {
            return true; // Indique que l'onde a atteint sa portée maximale
        }
        return false; // L'onde a pas atteint sa portée maximale
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = this.couleur;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rayon, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

}