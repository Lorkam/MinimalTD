
export class Item{
    constructor(nom, attributs) {
        this.nom = nom;
        this.attributs = attributs;
        this.canvas = document.querySelector(`canvas#${this.attributs.nom}`);
        this.ctx = this.canvas.getContext('2d');
        this.decouvert = false;
    }
}