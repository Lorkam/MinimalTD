
export class Item{
    constructor(nom, attributs) {
        this.nom = nom;
        this.attributs = attributs;
        this.canvas = null
        this.ctx = null
        this.decouvert = false;
    }

    initialiser(div){
        this.divItem = div;
        this.canvas = this.divItem.querySelector(`canvas#${this.attributs.nom}`);
        this.ctx = this.canvas.getContext('2d');
        this.decouvert = this.divItem.querySelector(`input[name="${this.attributs.nom}"]`).value === "1";
    }
}