
export class Ennemi {
    constructor(partie, position) {
        this.partie = partie; // Référence à la partie à laquelle appartient l'ennemi
        this.chemin = partie.chemin;
        if (position) {
            this.x = position.x;
            this.y = position.y;
        }else {
            this.x = this.chemin[0].x;
            this.y = this.chemin[0].y;
        }
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
        switch (this.partie.statEnnemis[this.constructor.name].formeDessin) {
            case 'cercle':
                ctx.fillStyle = this.couleur;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.taille, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'triangle':
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
                break;
            case 'ellipse':
                ctx.save();
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, this.taille, this.taille * 0.6, 0, 0, Math.PI * 2);
                ctx.fillStyle = this.couleur;
                ctx.fill();
                ctx.restore();
                break;
            default:
                console.warn(`Forme de dessin inconnue : ${this.partie.statEnnemis[this.constructor.name].formeDessin}`);
        }
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
        }else{
            console.log(this.partie.heartPV, this.degatAuCoeur);
            this.partie.heartPV -= this.degatAuCoeur;
            this.partie.console.ecrire("Un ennemi a atteint le coeur -> PV : " + this.partie.heartPV);
        }
        // Si l'ennemi n'est plus en vie, on le retire de la liste
        this.partie.nbEnnemisMorts++;
        const index = this.partie.ennemies.indexOf(this);
        if (index > -1) {
            this.partie.ennemies.splice(index, 1);
        }
    }

    action() {
        // Méthode utile seulement pour les ennemis qui ont une action spécifique ( à définir dans les classes filles)
        return;
    }
}

function random(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
}

export class EnnemiClassique extends Ennemi {
    constructor( partie, position = null, cheminIndex = 0) {
        super(partie, position);
        this.couleur = this.partie.statEnnemis.EnnemiClassique.couleur;
        this.pvMax = this.partie.statEnnemis.EnnemiClassique.pvMax;
        this.pv = this.pvMax;
        this.cheminIndex = cheminIndex;
        this.degatAuCoeur = this.partie.statEnnemis.EnnemiClassique.degatAuCoeur;
        this.speed = this.partie.statEnnemis.EnnemiClassique.vitesse;
        this.taille = this.partie.statEnnemis.EnnemiClassique.taille;
        this.recompense.or = this.partie.statEnnemis.EnnemiClassique.or;
        this.recompense.triangles = this.partie.statEnnemis.EnnemiClassique.triangles;
    }
}
export class EnnemiTank extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        this.couleur = this.partie.statEnnemis.EnnemiTank.couleur;
        this.pvMax = this.partie.statEnnemis.EnnemiTank.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = this.partie.statEnnemis.EnnemiTank.degatAuCoeur;
        this.taille = this.partie.statEnnemis.EnnemiTank.taille;
        this.speed = this.partie.statEnnemis.EnnemiTank.vitesse;
        this.recompense.or = this.partie.statEnnemis.EnnemiTank.or;
        this.recompense.triangles = this.partie.statEnnemis.EnnemiTank.triangles;
    }
}
export class EnnemiRapide extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        this.couleur = this.partie.statEnnemis.EnnemiRapide.couleur;
        this.pvMax = this.partie.statEnnemis.EnnemiRapide.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = this.partie.statEnnemis.EnnemiRapide.degatAuCoeur;
        this.taille = this.partie.statEnnemis.EnnemiRapide.taille;
        this.speed = this.partie.statEnnemis.EnnemiRapide.vitesse;
        this.recompense.or = this.partie.statEnnemis.EnnemiRapide.or;
        this.recompense.triangles = this.partie.statEnnemis.EnnemiRapide.triangles;
    }
}
export class EnnemiReplicateur extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        this.couleur = this.partie.statEnnemis.EnnemiReplicateur.couleur;
        this.pvMax = this.partie.statEnnemis.EnnemiReplicateur.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = this.partie.statEnnemis.EnnemiReplicateur.degatAuCoeur;
        this.taille = this.partie.statEnnemis.EnnemiReplicateur.taille;
        this.speed = this.partie.statEnnemis.EnnemiReplicateur.vitesse;
        this.recompense.or = this.partie.statEnnemis.EnnemiReplicateur.or;
        this.recompense.triangles = this.partie.statEnnemis.EnnemiReplicateur.triangles;
        this.recompense.ronds = this.partie.statEnnemis.EnnemiReplicateur.ronds;
        this.recompense.hexagones = this.partie.statEnnemis.EnnemiReplicateur.hexagones;
    }

    mort(type){
        if (type=='tour') {
            this.partie.golds += this.recompense.or + this.partie.modificateurs.economie.goldsBonusParEnnemis; // Ajoute la récompense au joueur
            for(const monnaie of Object.keys(this.partie.monnaies)) {
                this.partie.monnaies[monnaie] += this.recompense[monnaie] // Ajoute la récompense de chaque type de monnaie
            }
            for (let i = 0; i < this.partie.statEnnemis.EnnemiReplicateur.nbRepliques; i++) {
                const replique = new EnnemiReplique(this.partie, {x:this.x+(i-1)*10, y:this.y+(i-1)*5}, this.cheminIndex); // Création une nouvelle réplique de l'ennemi
                this.partie.ennemies.push(replique); // Ajoute la réplique à la liste des ennemis
                this.partie.totalEnnemis++;
                this.partie.majUI(); // Met à jour l'interface utilisateur
            }
        }
        this.partie.nbEnnemisMorts++;
        const index = this.partie.ennemies.indexOf(this);
        if (index > -1) {
            this.partie.ennemies.splice(index, 1);
        }
    }
}
export class EnnemiReplique extends Ennemi {
    constructor(partie, position = null, cheminIndex = 0) {
        super(partie, position);
        this.couleur = this.partie.statEnnemis.EnnemiReplique.couleur;
        this.pvMax = this.partie.statEnnemis.EnnemiReplique.pvMax;
        this.pv = this.pvMax;
        this.cheminIndex = cheminIndex;
        this.degatAuCoeur = this.partie.statEnnemis.EnnemiReplique.degatAuCoeur;
        this.taille = this.partie.statEnnemis.EnnemiReplique.taille;
        this.speed = this.partie.statEnnemis.EnnemiReplique.vitesse;
        this.recompense.or = this.partie.statEnnemis.EnnemiReplique.or;
        this.recompense.triangles = this.partie.statEnnemis.EnnemiReplique.triangles;
        this.recompense.ronds = this.partie.statEnnemis.EnnemiReplique.ronds;
        this.recompense.hexagones = this.partie.statEnnemis.EnnemiReplique.hexagones;
    }
}

export class BossMontagne extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        this.couleur = this.partie.statEnnemis.BossMontagne.couleur;
        this.pvMax = this.partie.statEnnemis.BossMontagne.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = this.partie.statEnnemis.BossMontagne.degatAuCoeur;
        this.taille = this.partie.statEnnemis.BossMontagne.taille;
        this.speed = this.partie.statEnnemis.BossMontagne.vitesse;
        this.recompense.or = this.partie.statEnnemis.BossMontagne.or;
        this.recompense.triangles = this.partie.statEnnemis.BossMontagne.triangles;
        this.recompense.ronds = this.partie.statEnnemis.BossMontagne.ronds;
        this.recompense.hexagones = this.partie.statEnnemis.BossMontagne.hexagones;
    }
}
export class BossInvocateur extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        this.couleur = this.partie.statEnnemis.BossInvocateur.couleur;
        this.pvMax = this.partie.statEnnemis.BossInvocateur.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = this.partie.statEnnemis.BossInvocateur.degatAuCoeur;
        this.taille = this.partie.statEnnemis.BossInvocateur.taille;
        this.speed = this.partie.statEnnemis.BossInvocateur.vitesse;
        this.recompense.or = this.partie.statEnnemis.BossInvocateur.or;
        this.recompense.triangles = this.partie.statEnnemis.BossInvocateur.triangles;
        this.recompense.ronds = this.partie.statEnnemis.BossInvocateur.ronds;
        this.recompense.hexagones = this.partie.statEnnemis.BossInvocateur.hexagones;
        this.dernierreInvocation = Date.now();
    }

    action() {
        if(Date.now() - this.dernierreInvocation >= this.partie.statEnnemis.BossInvocateur.intervalInvocation) {
            for(let i=0;i<this.partie.statEnnemis.BossInvocateur.nbInvocation; i++) {
                const ennemi = new EnnemiClassique(this.partie, {x: this.x + random(-10, 10), y: this.y + random(-10, 10)}, this.cheminIndex);
                this.partie.ennemies.push(ennemi);
                this.partie.totalEnnemis++;
                console.log("Un ennemi classique a été invoqué par le boss invocateur.");
            }
            this.partie.majUI();
            this.dernierreInvocation = Date.now();
        }
    }
}
export class BossAmplificateur extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        this.couleur = this.partie.statEnnemis.BossAmplificateur.couleur;
        this.pvMax = this.partie.statEnnemis.BossAmplificateur.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = this.partie.statEnnemis.BossAmplificateur.degatAuCoeur;
        this.taille = this.partie.statEnnemis.BossAmplificateur.taille;
        this.speed = this.partie.statEnnemis.BossAmplificateur.vitesse;
        this.recompense.or = this.partie.statEnnemis.BossAmplificateur.or;
        this.recompense.triangles = this.partie.statEnnemis.BossAmplificateur.triangles;
        this.recompense.ronds = this.partie.statEnnemis.BossAmplificateur.ronds;
        this.recompense.hexagones = this.partie.statEnnemis.BossAmplificateur.hexagones;
        this.amplification = this.partie.statEnnemis.BossAmplificateur.valeurAmplification;
        this.portee = this.partie.statEnnemis.BossAmplificateur.porteeAmplification;
    }

    action() {
        const listeEnnemis = this.partie.ennemies.filter(ennemi => ennemi !== this);
        for(const ennemi of listeEnnemis) {
            if(ennemi.amplifie) continue; // Ignore les ennemis déjà amplifiés
            const distance = Math.sqrt((ennemi.x - this.x) ** 2 + (ennemi.y - this.y) ** 2);
            if(distance <= this.partie.statEnnemis.BossAmplificateur.porteeAmplification) {
                ennemi.amplifie = true; // Indique que l'ennemi est amplifié par le boss
                ennemi.pvMax *= this.partie.statEnnemis.BossAmplificateur.valeurAmplification;
                ennemi.pv *= this.partie.statEnnemis.BossAmplificateur.valeurAmplification;
                ennemi.taille += 2;
                ennemi.speed *= 1.7;
            }
        }
        // dessin de la portee de l'amplification en pointillés
        this.partie.ctx.save();
        this.partie.ctx.setLineDash([6, 6]);
        this.partie.ctx.beginPath();
        this.partie.ctx.arc(this.x, this.y, this.portee, 0, 2 * Math.PI);
        this.partie.ctx.strokeStyle = this.couleur;
        this.partie.ctx.lineWidth = 2;
        this.partie.ctx.stroke();
        this.partie.ctx.setLineDash([]);
        this.partie.ctx.restore();
    }
}