
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

    async initModel(cheminModel, tailleModel, runAnimation) {
        this.id3D = await this.partie.scene3D.addModel(cheminModel, {x: this.x, y: this.y}, tailleModel, runAnimation);
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
        /*switch (this.partie.statEnnemis[this.constructor.name].formeDessin) {
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
        }*/
        if (this.pv < this.pvMax) {
            const barWidth = this.taille * 2;
            const barHeight = 4;
            const barX = this.x - this.taille;
            const barY = this.y +10+ this.taille + 4;
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

    async mort(type){
        if (this.id3D != null) {
            const id3D = this.id3D;
            if(this.constructor.name.includes("Boss")) await this.partie.scene3D.animationMort(id3D, this.indexAnimationMort, this);
            this.partie.scene3D.removeModel(id3D);
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
            console.log("suppression de l'ennemi");
            this.partie.nbEnnemisMorts++;
            const index = this.partie.ennemies.indexOf(this);
            if (index > -1) {
                this.partie.ennemies.splice(index, 1);
            }
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
        const statEnnemiClassique = this.partie.statEnnemis.EnnemiClassique;
        this.couleur = statEnnemiClassique.couleur;
        this.pvMax = statEnnemiClassique.pvMax;
        this.pv = this.pvMax;
        this.cheminIndex = cheminIndex;
        this.degatAuCoeur = statEnnemiClassique.degatAuCoeur;
        this.speed = statEnnemiClassique.vitesse;
        this.taille = statEnnemiClassique.taille;
        this.recompense.or = statEnnemiClassique.or;
        this.recompense.triangles = statEnnemiClassique.triangles;
        this.initModel(statEnnemiClassique.cheminModel, statEnnemiClassique.tailleModel, statEnnemiClassique.runAnimation);
    }
}
export class EnnemiTank extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        const statEnnemiTank = this.partie.statEnnemis.EnnemiTank;
        this.couleur = statEnnemiTank.couleur;
        this.pvMax = statEnnemiTank.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = statEnnemiTank.degatAuCoeur;
        this.taille = statEnnemiTank.taille;
        this.speed = statEnnemiTank.vitesse;
        this.recompense.or = statEnnemiTank.or;
        this.recompense.triangles = statEnnemiTank.triangles;
        this.initModel(statEnnemiTank.cheminModel, statEnnemiTank.tailleModel, statEnnemiTank.runAnimation);
    }
}
export class EnnemiRapide extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        const statEnnemiRapide = this.partie.statEnnemis.EnnemiRapide;
        this.couleur = statEnnemiRapide.couleur;
        this.pvMax = statEnnemiRapide.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = statEnnemiRapide.degatAuCoeur;
        this.taille = statEnnemiRapide.taille;
        this.speed = statEnnemiRapide.vitesse;
        this.recompense.or = statEnnemiRapide.or;
        this.recompense.triangles = statEnnemiRapide.triangles;
        this.initModel(statEnnemiRapide.cheminModel, statEnnemiRapide.tailleModel, statEnnemiRapide.runAnimation);
    }
}
export class EnnemiReplicateur extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        const statEnnemiReplicateur = this.partie.statEnnemis.EnnemiReplicateur;
        this.couleur = statEnnemiReplicateur.couleur;
        this.pvMax = statEnnemiReplicateur.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = statEnnemiReplicateur.degatAuCoeur;
        this.taille = statEnnemiReplicateur.taille;
        this.speed = statEnnemiReplicateur.vitesse;
        this.recompense.or = statEnnemiReplicateur.or;
        this.recompense.triangles = statEnnemiReplicateur.triangles;
        this.recompense.ronds = statEnnemiReplicateur.ronds;
        this.recompense.hexagones = statEnnemiReplicateur.hexagones;
        this.initModel(statEnnemiReplicateur.cheminModel, statEnnemiReplicateur.tailleModel, statEnnemiReplicateur.runAnimation);
    }

    mort(type){
        if (this.id3D != null) {
            this.partie.scene3D.removeModel(this.id3D);
        }
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
        const statEnnemiReplique = this.partie.statEnnemis.EnnemiReplique;
        this.couleur = statEnnemiReplique.couleur;
        this.pvMax = statEnnemiReplique.pvMax;
        this.pv = this.pvMax;
        this.cheminIndex = cheminIndex;
        this.degatAuCoeur = statEnnemiReplique.degatAuCoeur;
        this.taille = statEnnemiReplique.taille;
        this.speed = statEnnemiReplique.vitesse;
        this.recompense.or = statEnnemiReplique.or;
        this.recompense.triangles = statEnnemiReplique.triangles;
        this.recompense.ronds = statEnnemiReplique.ronds;
        this.recompense.hexagones = statEnnemiReplique.hexagones;
        this.initModel(statEnnemiReplique.cheminModel, statEnnemiReplique.tailleModel, statEnnemiReplique.runAnimation);
    }
}

export class BossMontagne extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        const statBossMontagne = this.partie.statEnnemis.BossMontagne;
        this.couleur = statBossMontagne.couleur;
        this.pvMax = statBossMontagne.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = statBossMontagne.degatAuCoeur;
        this.taille = statBossMontagne.taille;
        this.speed = statBossMontagne.vitesse;
        this.recompense.or = statBossMontagne.or;
        this.recompense.triangles = statBossMontagne.triangles;
        this.recompense.ronds = statBossMontagne.ronds;
        this.recompense.hexagones = statBossMontagne.hexagones;
        this.indexAnimationMort = statBossMontagne.deathAnimation; // Index de l'animation de mort
        this.indexAnimationBestiaire = statBossMontagne.bestiaireAnimation; // Index de l'animation pour le bestiaire
        this.initModel(statBossMontagne.cheminModel, statBossMontagne.tailleModel, statBossMontagne.runAnimation);
    }
}
export class BossInvocateur extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        const statBossInvocateur = this.partie.statEnnemis.BossInvocateur;
        this.couleur = statBossInvocateur.couleur;
        this.pvMax = statBossInvocateur.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = statBossInvocateur.degatAuCoeur;
        this.taille = statBossInvocateur.taille;
        this.speed = statBossInvocateur.vitesse;
        this.recompense.or = statBossInvocateur.or;
        this.recompense.triangles = statBossInvocateur.triangles;
        this.recompense.ronds = statBossInvocateur.ronds;
        this.recompense.hexagones = statBossInvocateur.hexagones;
        this.indexAnimationMort = statBossInvocateur.deathAnimation; // Index de l'animation de mort
        this.indexAnimationBestiaire = statBossInvocateur.bestiaireAnimation; // Index de l'animation pour le bestiaire
        this.initModel(statBossInvocateur.cheminModel, statBossInvocateur.tailleModel, statBossInvocateur.runAnimation);
        this.dernierreInvocation = Date.now();
    }

    action() {
        if(Date.now() - this.dernierreInvocation >= this.partie.statEnnemis.BossInvocateur.intervalInvocation) {
            for(let i=0;i<this.partie.statEnnemis.BossInvocateur.nbInvocation; i++) {
                const ennemi = new EnnemiClassique(this.partie, {x: this.x + random(-10, 10), y: this.y + random(-10, 10)}, this.cheminIndex);
                this.partie.ennemies.push(ennemi);
                this.partie.totalEnnemis++;
                //console.log("Un ennemi classique a été invoqué par le boss invocateur.");
            }
            this.partie.majUI();
            this.dernierreInvocation = Date.now();
        }
    }
}
export class BossAmplificateur extends Ennemi {
    constructor(partie, position = null) {
        super(partie, position);
        const statBossAmplificateur = this.partie.statEnnemis.BossAmplificateur;
        this.couleur = statBossAmplificateur.couleur;
        this.pvMax = statBossAmplificateur.pvMax;
        this.pv = this.pvMax;
        this.degatAuCoeur = statBossAmplificateur.degatAuCoeur;
        this.taille = statBossAmplificateur.taille;
        this.speed = statBossAmplificateur.vitesse;
        this.recompense.or = statBossAmplificateur.or;
        this.recompense.triangles = statBossAmplificateur.triangles;
        this.recompense.ronds = statBossAmplificateur.ronds;
        this.recompense.hexagones = statBossAmplificateur.hexagones;
        this.indexAnimationMort = statBossAmplificateur.deathAnimation; // Index de l'animation de mort
        this.indexAnimationBestiaire = statBossAmplificateur.bestiaireAnimation; // Index de l'animation pour le bestiaire
        this.initModel(statBossAmplificateur.cheminModel, statBossAmplificateur.tailleModel, statBossAmplificateur.runAnimation);
        this.amplification = statBossAmplificateur.valeurAmplification;
        this.portee = statBossAmplificateur.porteeAmplification;
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