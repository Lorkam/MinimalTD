import { Item } from '../bestiaire/item.js';

async function getEnnemis() {
    const url = '../serv/gestionTours&Ennemis.php';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=chargerStatEnnemis'
        });

        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Erreur récupération Ennemis :', error);
    }
}
async function getTours() {
    const url = '../serv/gestionTours&Ennemis.php';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=chargerStatTours'
        });

        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.error('Erreur récupération Tours :', error);
    }
}

function creerListeItem(listeTours, listeEnnemis) {
    var listeItem = [];
    for(const tour of Object.keys(listeTours)) {
        listeItem.push(new Item(tour, listeTours[tour]));
    }
    for(const ennemi of Object.keys(listeEnnemis)) {
        listeItem.push(new Item(ennemi, listeEnnemis[ennemi]));
    }
    const divEnnemisNormaux = document.querySelector('#ennmisNormaux div.grilleCase');
    const divEnnemisBoss = document.querySelector('#Boss div.grilleCase');
    const divTours = document.querySelector('#Tours div.grilleCase');
    for(const item of listeItem) {
        let type = item.attributs.nom;
        type = type.includes('Boss') ? 'boss' : type.includes('Ennemi') ? 'ennemi' : 'tour';

        const divItem = document.createElement('div');
        divItem.classList.add('item', 'flex-column');

        const canvaItem = document.createElement('canvas');
        canvaItem.id = item.attributs.nom;
        canvaItem.width = 120;
        canvaItem.height = 120;

        const pItem = document.createElement('p');
        pItem.textContent = item.attributs.nomBestiaire;

        const inputItem = document.createElement('input');
        inputItem.type = 'hidden';
        inputItem.value = "1";                               // A changer dynamiquement
        inputItem.name = item.attributs.nom;

        divItem.appendChild(canvaItem);
        divItem.appendChild(pItem);
        divItem.appendChild(inputItem);
        switch(type) {
            case 'tour':
                divTours.appendChild(divItem);
                break;
            case 'ennemi':
                divEnnemisNormaux.appendChild(divItem);
                break;
            case 'boss':
                divEnnemisBoss.appendChild(divItem);
                break;
            default:
                console.warn(`Type d'item inconnu : ${type}`);
                break;
        }
        item.initialiser(divItem);
    }
    return listeItem;
}

function dessinerCadenas(ctx, canvas) {
    //aze
}
function dessinerTourClassique(ctx, canvas) {
    //aze
}

function dessinerCanvas(listeItem) {
    for (const item of listeItem) {
        const ctx = item.ctx;
        const canvas = item.canvas;
        const { width, height } = canvas;

        // Nettoyage du canvas
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, width, height);

        if (item.decouvert) {
            // Dessiner l'item découvert
            ctx.fillStyle = item.attributs.couleur;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, item.attributs.taille * 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Dimensions du cadenas
            const cadenasWidth = width / 2;
            const cadenasHeight = height / 2.5;
            const arcRadius = cadenasWidth / 2 - 5;
            const arcLineWidth = 5;
            const totalCadenasHeight = arcRadius + arcLineWidth + cadenasHeight;

            // Calcul pour centrer verticalement
            const startY = (height - totalCadenasHeight) / 2;

            // Corps du cadenas (rectangle)
            const cadenasX = width / 4;
            const cadenasY = startY + arcRadius + arcLineWidth;

            ctx.fillStyle = '#444';
            ctx.fillRect(cadenasX, cadenasY, cadenasWidth, cadenasHeight);

            // Anse du cadenas (arc de cercle)
            const arcCenterX = width / 2;
            const arcCenterY = startY + arcRadius+3;

            ctx.beginPath();
            ctx.strokeStyle = '#444';
            ctx.lineWidth = arcLineWidth;
            ctx.arc(arcCenterX, arcCenterY, arcRadius, -Math.PI * 1.05, Math.PI * 1.05, false);
            ctx.stroke();

            // Point d'interrogation
            ctx.fillStyle = '#fff';
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', arcCenterX, cadenasY + cadenasHeight / 2);
        }
    }
}





const listeTours = await getTours();
const listeEnnemis = await getEnnemis();
const listeItem = creerListeItem(listeTours, listeEnnemis);
dessinerCanvas(listeItem);
