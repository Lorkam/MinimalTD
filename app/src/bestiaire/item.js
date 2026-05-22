
export class Item{
    constructor(nom, attributs, dimension) {
        this.nom = nom;
        this.attributs = attributs;
        this.canvas = null;
        this.ctx = null;
        this.decouvert = false;
        this.dimension = dimension;
        this.index3D = null; // Index du modèle 3D dans la scène
    }

    initialiser(div){
        this.divItem = div;
        this.canvas = this.divItem.querySelector(`canvas#${this.attributs.nom}`);
        this.ctx = this.canvas.getContext('2d');
        this.decouvert = this.divItem.querySelector(`input[name="${this.attributs.nom}"]`).value === "1";

        const divInfoItem = document.querySelector('#infoItem');
        this.canvas.addEventListener('mouseenter', () => {
            if(this.decouvert) {
                divInfoItem.classList.remove('cacher');
                divInfoItem.classList.add('visible');
                // Remplissage des informations de l'item
                divInfoItem.querySelector('#titreItem').textContent = this.attributs.nomBestiaire;
                divInfoItem.querySelector('#description').textContent = this.attributs.description;
                const divStatItem = divInfoItem.querySelector('#statItem');
                divStatItem.innerHTML = ''; // Réinitialiser les attributs
                const infoApasMontrer = ['nomBestiaire', 'description', 'nom', 'formeDessin', 'couleur', 'taille', 'runAnimation', 'deathAnimation', 'tailleModel', 'cheminModel', 'bestiaireAnimation'];
                for(const [key, value] of Object.entries(this.attributs)) {
                    if(!infoApasMontrer.includes(key)) {
                        const ligneAttribut = document.createElement('div');
                        ligneAttribut.classList.add('ligneAttribut');
                        const spanNom = document.createElement('span');
                        spanNom.classList.add('nomAttribut');
                        spanNom.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)} : `;
                        const spanValeur = document.createElement('span');
                        spanValeur.classList.add('valeurAttribut');
                        spanValeur.textContent = value;
                        ligneAttribut.appendChild(spanNom);
                        ligneAttribut.appendChild(spanValeur);
                        divStatItem.appendChild(ligneAttribut);
                    }
                }
                // placement du divInfoItem
                divInfoItem.style.top = this.canvas.offsetTop + this.canvas.offsetHeight/2 - divInfoItem.offsetHeight/2 + 'px';
                divInfoItem.style.left = this.canvas.offsetLeft + this.canvas.offsetWidth + 'px';
                if(divInfoItem.offsetLeft + divInfoItem.offsetWidth > window.innerWidth) {
                    divInfoItem.style.left = this.canvas.offsetLeft - divInfoItem.offsetWidth + 'px';
                }
            }
        });
        this.canvas.addEventListener('mouseleave', () => {
            if(this.decouvert) {
                divInfoItem.classList.remove('visible');
                divInfoItem.classList.add('cacher');
            }
        });
        if(!this.attributs.formeDessin) {
            this.attributs.formeDessin = 'ennemi';
        }
    }
}