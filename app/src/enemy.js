
export class Enemy {
    constructor(chemin) {
        this.chemin = chemin;
        this.x = chemin[0].x;
        this.y = chemin[0].y;
        this.speed = 1;
        this.cheminIndex = 0;
        this.distanceParcourue = 0; // Distance parcourue par l'ennemi
        this.couleur = 'black';
        this.pvMax = 1;
        this.pv = this.pvMax;
        this.taille = 10; // pour la détection de souris
        this.recompense = 0; // Récompense pour la destruction de l'ennemi
    }

    /**
     * Met à jour la position des ennemis en fonction du chemin.
     */
    update(coeur) {
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
            return false; // Indique que l'ennemi n'est plus en vie
        }else {
            if (this.cheminIndex >= this.chemin.length - 1) {
                coeur.pv--; // Retire un point de vie au coeur du joueur
                console.log("L'ennemi a atteint la fin du chemin : pv du coeur = " + coeur.pv);
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
}

export class EnemyClassique extends Enemy {
    constructor(chemin) {
        super(chemin);
        this.couleur = 'red';
        this.pvMax = 40;
        this.pv = this.pvMax;
        this.taille = 10; // pour la détection de souris
        this.recompense = 2;
    }
}

export class EnemyTank extends Enemy {
    constructor(chemin) {
        super(chemin);
        this.couleur = 'rgb(15, 89, 0)';
        this.pvMax = 150;
        this.pv = this.pvMax;
        this.taille = 10; // pour la détection de souris
        this.speed = 0.5;
        this.recompense = 4;
    }
}
export class EnemyRapide extends Enemy {
    constructor(chemin) {
        super(chemin);
        this.couleur = 'rgb(184, 197, 0)';
        this.pvMax = 20;
        this.pv = this.pvMax;
        this.taille = 7; // pour la détection de souris
        this.speed = 3;
        this.recompense = 3;
    }
}