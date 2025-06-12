import { Noeud } from "./noeuds.js";

class MenuTechnologies {
    constructor() {
        this.noeuds = [
            new Noeud("centre", 100, "or", this, ['vitesseAttaque', 'degats', 'orDeDepart', 'lvlUpTours']),
            new Noeud("vitesseAttaque", 200, "or", this),
            new Noeud("degats", 300, "or", this, ['critRate', 'critDamage']),
            new Noeud("orDeDepart", 400, "or", this),
            new Noeud("lvlUpTours", 500, "or", this),
            new Noeud("critRate", 500, "or", this),
            new Noeud("critDamage", 500, "or", this)
        ];

        this.canvas = document.querySelector('#canvasTechno');
        this.ctx = this.canvas.getContext('2d');




        // Désactivation du menu contextuel de google Chrome
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    }


    dessinerLiensNoeuds() {
        for(const noeud of this.noeuds) {
            const positionNoeud = noeud.getPosition();

            const posNoeudX = positionNoeud.x-noeud.divElementHTML.offsetWidth/2;
            const posNoeudY = positionNoeud.y-noeud.divElementHTML.offsetHeight/2;
            
            
            for(const enfantId of noeud.enfants) {
                const enfant = this.noeuds.find(n => n.idHTML === enfantId);
                if (!enfant) continue;
                if (enfant.estCache()) continue; // Si l'enfant est caché, on ne le dessine pas
                const positionEnfant = enfant.getPosition();
                
                const posEnfantX = positionEnfant.x-enfant.divElementHTML.offsetWidth/2;
                const posEnfantY = positionEnfant.y-enfant.divElementHTML.offsetHeight/2;
                this.ctx.beginPath();
                this.ctx.moveTo(posEnfantX, posEnfantY);
                this.ctx.lineTo(posNoeudX, posNoeudY);
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            this.ctx.beginPath();
            this.ctx.arc(posNoeudX, posNoeudY-2, 24, 0, Math.PI * 2);
            this.ctx.fillStyle = 'white';
            this.ctx.fill();
        }
    }
}



const menuTechnologies = new MenuTechnologies();
menuTechnologies.dessinerLiensNoeuds();

