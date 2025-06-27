import { Enemy } from "./enemy.js";
import { Projectile } from "./projectiles.js";

export class Tower {
    constructor(type, position, partie) {
        this.partie = partie; // Référence à la partie à laquelle appartient la tour
        this.type = type;
        this.portee = 100;
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

    actionTour(action) {
        switch (action) {
            case 'ameliorer':
                return this.ameliorer(); // Améliore la tour et retourne le coût négatif de l'amélioration
            case 'vendre':
                return this.vendre(); // Vends la tour et retourne le montant d'or gagné
            default:
                console.warn("Action inconnue pour la tour :", action);
                return 0; // Retourne 0 si l'action est inconnue
        }
    }


}

export class TourClassique extends Tower {
    constructor(position, partie) {
        const modificateursToursClassiques = partie.modificateurs.toursClassiques;
        const statToursClassiques = partie.statTours.TourClassique;
        super('Classique', position, partie);
        this.lvl = 1; // Niveau de la tour
        this.prix = statToursClassiques.prix * modificateursToursClassiques.prix; // Prix de la tour
        this.prixAmelioration = this.prix * this.lvl;
        this.valeur = this.prix;
        this.degats = statToursClassiques.degats * modificateursToursClassiques.degats; // Dégâts infligés par la tour
        this.attaqueSpeed = statToursClassiques.attaqueSpeed / modificateursToursClassiques.vitesseAttaque; // Temps de recharge en millisecondes
        this.portee = statToursClassiques.portee + modificateursToursClassiques.portee
        this.derniereAttaque = Date.now();
        this.afficherPortee = false; // Indique si la portée de la tour doit être affichée
        this.tauxCrit = modificateursToursClassiques.critRate; // Taux de critique de la tour
        this.multiplicateurCrit = modificateursToursClassiques.critDamage; // dégats supplémentaires en cas de coup critique
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

    /**
     * Améliore la tour en augmentant ses statistiques (dégâts, vitesse d'attaque, portée)
     * selon le niveau cible. Le coût d'amélioration est mis à jour à chaque niveau.
     * Ne permet pas d'améliorer au-delà du niveau 3.
     *
     * @returns {number} Le coût négatif de l'amélioration si réussie, ou 0 si le niveau maximum est atteint.
     */
    ameliorer(){
        if(this.partie.golds < this.prixAmelioration) {
            console.warn("Pas assez d'or pour améliorer cette tour.");
            return 0;
        }
        const lvlCible = this.lvl + 1;
        switch (lvlCible) {
            case 1:
                this.degats *= 1.5;
                this.attaqueSpeed *= 0.9;
                this.portee *= 1.1;
                break;
            case 2:
                this.degats *= 2;
                this.attaqueSpeed *= 0.8;
                this.portee *= 1.2;
                break;
            case 3:
                this.degats *= 2.5;
                this.attaqueSpeed *= 0.7;
                this.portee *= 1.3;
                break;
            default:
                console.error("Cette tour ne peut pas être améliorée au-delà du niveau 3.");
                return 0;
        }
        this.lvl++;
        const cout = this.prixAmelioration;
        this.valeur += cout; // Augmente la valeur de la tour
        this.prixAmelioration = this.prix * this.lvl * this.lvl;
        return -cout;
    }

    vendre(){
        this.partie.emplacementSelectionne.tour = null; // Retire la tour de l'emplacement
        this.partie.towers = this.partie.towers.filter(tour => tour !== this); // Retire la tour de la liste des tours
        this.partie.prixTourClassique /= 2; // Réduit le prix de la tour classique pour la prochaine fois
        return this.valeur; // Retourne la valeur de la tour pour la vendre
    }
}