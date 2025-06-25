import { Enemy } from "./enemy.js";
import { Projectile } from "./projectiles.js";

export class Tower {
    constructor(type, portee, position, partie) {
        this.partie = partie; // Référence à la partie à laquelle appartient la tour
        this.type = type;
        this.portee = portee;
        this.position = position;
        this.listeBalles = []; // Liste des projectiles tirés par la tour
        this.prix = 1; // Prix de la tour
        this.tauxCrit = 0;
        this.multiplicateurCrit = 1.2;
    }
    getDetails() {
        return `Tower type: ${this.type}, portee: ${this.portee}m, position: (${this.position.x}, ${this.position.y})`;
    }

    /**
     * Cherche l'ennemi le plus proche du coeur (ayant la plus grande distanceParcourue)
     * qui est à portée de la tour.
     *
     * @param {Array<Enemy>} listeEnnemis - Liste des ennemis à vérifier.
     * @returns {Enemy|undefined} L'ennemi le plus avancé dans la portée, ou undefined si aucun.
     */
    chercherEnnemi() {
        let cible = undefined;
        let maxDistanceParcourue = -Infinity;
        for (const ennemi of this.partie.ennemies) {
            const distance = Math.sqrt(
                Math.pow(ennemi.x - this.position.x, 2) +
                Math.pow(ennemi.y - this.position.y, 2)
            );
            if (distance <= this.portee && ennemi.distanceParcourue > maxDistanceParcourue) {
                cible = ennemi;
                maxDistanceParcourue = ennemi.distanceParcourue;
            }
        }
        return cible;
    }

    tirer(enemy) {
        if (Date.now() - this.derniereAttaque < this.attaqueSpeed) {
            return; // Ne tire pas si le temps de recharge n'est pas écoulé
        }
        this.listeBalles.push(new Projectile(this, enemy));
        this.derniereAttaque = Date.now(); // Met à jour le temps de la dernière attaque
    }

    majBalles(){
        for (let i = this.listeBalles.length - 1; i >= 0; i--) {
            const balle = this.listeBalles[i];
            if (balle.update()) {
                // Si la balle a atteint sa cible, on la supprime de la liste
                this.listeBalles.splice(i, 1);
            }
            balle.draw(this.partie.ctx);
        }
    }


}

export class TourClassique extends Tower {
    constructor(position, partie) {
        const toursClassiques = partie.modificateurs.toursClassiques;
        super('Classique', 100*toursClassiques.portee, position, partie);
        this.prix = 10*toursClassiques.prix; // Prix de la tour
        this.degats = 10*toursClassiques.degats; // Dégâts infligés par la tour
        this.attaqueSpeed = 1000/toursClassiques.vitesseAttaque; // Temps de recharge en millisecondes
        this.derniereAttaque = Date.now();
        this.afficherPortee = false; // Indique si la portée de la tour doit être affichée
        this.tauxCrit = toursClassiques.critRate; // Taux de critique de la tour
        this.multiplicateurCrit = toursClassiques.critDamage; // Taux de critique de la tour
    }

    dessiner() {
        this.partie.ctx.fillStyle = "blue";
        this.partie.ctx.beginPath();
        // Dessiner un carré bleu à bords arrondis centré sur la position
        const x = this.position.x - 15;
        const y = this.position.y - 15;
        const width = 30;
        const height = 30;
        const radius = 7;
        this.partie.ctx.moveTo(x + radius, y);
        this.partie.ctx.lineTo(x + width - radius, y);
        this.partie.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.partie.ctx.lineTo(x + width, y + height - radius);
        this.partie.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.partie.ctx.lineTo(x + radius, y + height);
        this.partie.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.partie.ctx.lineTo(x, y + radius);
        this.partie.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.partie.ctx.closePath();
        this.partie.ctx.fill();

        // Dessiner un cercle blanc au centre
        this.partie.ctx.beginPath();
        this.partie.ctx.arc(this.position.x, this.position.y, 7, 0, Math.PI * 2);
        this.partie.ctx.fillStyle = "white";
        this.partie.ctx.fill();
        this.partie.ctx.beginPath(); // Pour éviter que le stroke du carré ne touche le cercle
        this.partie.ctx.fill();
        this.partie.ctx.strokeStyle = "black";
        this.partie.ctx.lineWidth = 2;
        this.partie.ctx.stroke();

        // Dessiner la portée de la tour
        if(this.afficherPortee){
            this.partie.ctx.beginPath();
            this.partie.ctx.arc(this.position.x, this.position.y, this.portee, 0, 2 * Math.PI);
            this.partie.ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
            this.partie.ctx.lineWidth = 2;
            this.partie.ctx.stroke();
        }
    }
}