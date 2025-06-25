
export class Enemy {
    constructor(partie) {
        this.partie = partie; // Référence à la partie à laquelle appartient l'ennemi
        this.chemin = partie.chemin;
        this.x = this.chemin[0].x;
        this.y = this.chemin[0].y;
        this.speed = 1;
        this.cheminIndex = 0;
        this.distanceParcourue = 0; // Distance parcourue par l'ennemi
        this.couleur = 'black';
        this.pvMax = 1;
        this.pv = this.pvMax;
        this.taille = 10; // pour la détection de souris
        this.recompense = {'or':0, 'triangles':0, 'ronds':0, 'hexagones':0}; // Récompense pour la destruction de l'ennemi
    }

    /**
     * Met à jour la position des ennemis en fonction du chemin.
     */
    update() {
        const target = this.chemin[this.cheminIndex + 1];
        if (!target) return;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        this.distanceParcourue += this.speed; // Met à jour la distance parcourue par l'ennemi
        if (dist < this.speed) {
            this.cheminIndex++;
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        if(this.pv <= 0) {// Si les points de vie de l'ennemi sont à 0 ou moins, il est considéré comme mort
            this.mort('tour'); // Appelle la méthode mort pour gérer la mort de l'ennemi
            return false; // Indique que l'ennemi n'est plus en vie
        }else {
            if (this.cheminIndex >= this.chemin.length - 1) {
                this.partie.heartPV--; // Retire un point de vie au coeur du joueur
                console.log("L'ennemi a atteint la fin du chemin : pv du coeur = " + this.partie.heartPV);
                this.mort('coeur'); // Appelle la méthode mort pour gérer la mort de l'ennemi
                return false; // Indique que l'ennemi n'est plus en vie
            }   
            return true; // Indique que l'ennemi est toujours en vie
        }
    }
    
    /**
     * Dessine les ennemis sur le canvas.
     * @param {CanvasRenderingContext2D} ctx - Le canvas sur lequel déssiner.
     */
    draw(ctx) {
        ctx.fillStyle = this.couleur;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.taille, 0, Math.PI * 2);
        ctx.fill();
        if (this.pv < this.pvMax) {
            const barWidth = this.taille * 2;
            const barHeight = 4;
            const barX = this.x - this.taille;
            const barY = this.y + this.taille + 4;
            ctx.fillStyle = 'gray';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = 'green';
            ctx.fillRect(barX, barY, barWidth * (this.pv / this.pvMax), barHeight);
        }
    }

    /**
     * Change la couleur de l'ennemi.
     * @param {string} couleur - La nouvelle couleur de l'ennemi.
     */
    changeCouleur(couleur) {
        this.couleur = couleur;
    }

    mort(type){
        if (type=='tour') {
            this.partie.golds += this.recompense.or + this.partie.modificateurs.economie.goldsBonusParEnnemis; // Ajoute la récompense au joueur
            for(const monnaie of Object.keys(this.partie.monnaies)) {
                this.partie.monnaies[monnaie] += this.recompense[monnaie] //+ this.partie.modificateurs.economie[`${monnaie}BonusParEnnemis`]; // Ajoute la récompense de chaque type de monnaie
            }
        } // Ajoute la récompense au joueur
        // Si l'ennemi n'est plus en vie, on le retire de la liste
        this.partie.nbEnnemisMorts++;
        const index = this.partie.ennemies.indexOf(this);
        if (index > -1) {
            this.partie.ennemies.splice(index, 1);
        }
    }
}

export class EnemyClassique extends Enemy {
    constructor( partie) {
        super(partie);
        this.couleur = 'red';
        this.pvMax = 20;
        this.pv = this.pvMax;
        this.taille = 10; // pour la détection de souris
        this.recompense.or = 2;
        this.recompense.triangles = 1;
    }
}

export class EnemyTank extends Enemy {
    constructor(partie) {
        super(partie);
        this.couleur = 'rgb(15, 89, 0)';
        this.pvMax = 100;
        this.pv = this.pvMax;
        this.taille = 10; // pour la détection de souris
        this.speed = 0.5;
        this.recompense.or = 4;
        this.recompense.triangles = 2;
    }
}

export class EnemyRapide extends Enemy {
    constructor(partie) {
        super(partie);
        this.couleur = 'rgb(184, 197, 0)';
        this.pvMax = 15;
        this.pv = this.pvMax;
        this.taille = 7; // pour la détection de souris
        this.speed = 3;
        this.recompense.or = 1;
        this.recompense.triangles = 1;
    }

    /**
     * Dessine les ennemis sur le canvas sous forme de triangle pointant vers la direction de déplacement.
     * @param {CanvasRenderingContext2D} ctx - Le canvas sur lequel dessiner.
     */
    draw(ctx) {
        // Calculer la direction du mouvement
        let angle = 0;
        const target = this.chemin[this.cheminIndex + 1];
        if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            angle = Math.atan2(dy, dx);
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);

        // Dessiner un triangle pointant vers la droite (0 radian)
        ctx.beginPath();
        ctx.moveTo(this.taille, 0); // pointe du triangle
        ctx.lineTo(-this.taille, this.taille / 1.5);
        ctx.lineTo(-this.taille, -this.taille / 1.5);
        ctx.closePath();
        ctx.fillStyle = this.couleur;
        ctx.fill();

        ctx.restore();

        // Barre de vie
        if (this.pv < this.pvMax) {
            const barWidth = this.taille * 2;
            const barHeight = 4;
            const barX = this.x - this.taille;
            const barY = this.y + this.taille + 4;
            ctx.fillStyle = 'gray';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = 'green';
            ctx.fillRect(barX, barY, barWidth * (this.pv / this.pvMax), barHeight);
        }
    }
}