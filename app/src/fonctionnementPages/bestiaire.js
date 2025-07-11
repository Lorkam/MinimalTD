import { Item } from '../bestiaire/item.js';
import { Sauvegarde } from '../sauvegarde/sauvegarde.js';

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

async function creerListeItem(listeTours, listeEnnemis) {
    let saves = new Sauvegarde();
    saves = await saves.lireSaves();
    let nomSaveActuelle = (document.querySelector('#nomSauvegarde').value=== '')? 'aucune' : document.querySelector('#nomSauvegarde').value;
    const ennemisRencontres = (nomSaveActuelle=='aucune')? [] : saves.saves[nomSaveActuelle]['ennemisRencontres'];
    let listeItem = [];
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

        const decouvert = (ennemisRencontres.includes(item.attributs.nom))? true : (type == 'tour') ? true : false;

        const pItem = document.createElement('p');
        pItem.textContent = decouvert?item.attributs.nomBestiaire:"inconnu";

        const inputItem = document.createElement('input');
        inputItem.type = 'hidden';
        inputItem.name = item.attributs.nom;
        inputItem.value = decouvert?"1":"0";

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

function dessinerCadenas(ctx, width, height) {
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

const multiplicateurTaille = 2;

function dessinerTourClassique(ctx, widthCanvas, heightCanvas, item) {
    //console.log(`Dessiner une tour carrée pour l'item : ${item.attributs.nom}`);
    const taille = item.attributs.taille * multiplicateurTaille;
    ctx.fillStyle = "blue";
    ctx.beginPath();
    // Dessiner un carré bleu à bords arrondis centré sur la position
    const x = widthCanvas/2 - taille/2;
    const y = heightCanvas/2 - taille/2;
    const width = taille; // Largeur du carré
    const height = taille; // Largeur du carré;
    const radius = taille/4.5;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    // Dessiner un cercle blanc au centre
    ctx.beginPath();
    ctx.arc(widthCanvas/2, heightCanvas/2, radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
}
function dessinerTourRalentissante(ctx, widthCanvas, heightCanvas, item) {
    const x = widthCanvas/2;
    const y = heightCanvas/2;

    // Corps principal de la tour : cercle bleu clair
    ctx.beginPath();
    ctx.arc(x, y, 15*multiplicateurTaille, 0, Math.PI * 2);
    ctx.fillStyle = "#00bfff"; // bleu clair
    ctx.fill();

    // Motif de spirale centrale pour représenter le ralentissement
    ctx.beginPath();
    ctx.strokeStyle = "#ffffff"; // blanc
    ctx.lineWidth = 2;

    const spiraleTours = 2.5;
    const rayonMax = 12*multiplicateurTaille;
    const points = 100;

    for (let i = 0; i < points; i++) {
        const angle = i / points * spiraleTours * 2 * Math.PI;
        const rayon = (i / points) * rayonMax;
        const spiraleX = x + Math.cos(angle) * rayon;
        const spiraleY = y + Math.sin(angle) * rayon;

        if (i == 0) ctx.moveTo(spiraleX, spiraleY);
        else ctx.lineTo(spiraleX, spiraleY);
    }
    ctx.stroke();
}
function dessinerTourExplosive(ctx, widthCanvas, heightCanvas, item) {
    const taille = item.attributs.taille * multiplicateurTaille;
    const width = taille;
    const height = taille;
    const x = widthCanvas/2 - width/2;
    const y = heightCanvas/2 - height/2;
    const radius = 7*multiplicateurTaille;

    // Dessin du carré arrondi
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = "#1e90ff";
    ctx.fill();

    // Dessin de l'étoile
    const centerX = widthCanvas/2;
    const centerY = heightCanvas/2;
    const spikes = 8;
    const outerRadius = 11*multiplicateurTaille;
    const innerRadius = 5*multiplicateurTaille;
    ctx.save();
    ctx.beginPath();
    ctx.translate(centerX, centerY);
    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (Math.PI / spikes) * i;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        ctx.lineTo(Math.sin(angle) * r, -Math.cos(angle) * r);
    }
    ctx.closePath();
    ctx.fillStyle = "#ffd700";
    ctx.shadowColor = "#ffae00";
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
    ctx.shadowBlur = 0;
}

function dessinerCercle(ctx, widthCanvas, heightCanvas, item) {
    ctx.fillStyle = item.attributs.couleur;
    ctx.beginPath();
    ctx.arc(widthCanvas / 2, heightCanvas / 2, item.attributs.taille * multiplicateurTaille, 0, Math.PI * 2);
    ctx.fill();
}
function dessinerTriangle(ctx, widthCanvas, heightCanvas, item) {
    const taille = item.attributs.taille * multiplicateurTaille;
    // Calculer la direction du mouvement
    let angle = 0;
    const target = {x:widthCanvas, y:heightCanvas / 2};
    if (target) {
        const dx = target.x - widthCanvas/2;
        const dy = target.y - heightCanvas/2;
        angle = Math.atan2(dy, dx);
    }

    ctx.save();
    ctx.translate(widthCanvas/2, heightCanvas/2);
    ctx.rotate(angle);

    // Dessiner un triangle pointant vers la droite (0 radian)
    ctx.beginPath();
    ctx.moveTo(taille, 0); // pointe du triangle
    ctx.lineTo(-taille, taille / 1.5);
    ctx.lineTo(-taille, -taille / 1.5);
    ctx.closePath();
    ctx.fillStyle = item.attributs.couleur;
    ctx.fill();

    ctx.restore();
}
function dessinerEllipse(ctx, widthCanvas, heightCanvas, item) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(widthCanvas/2, heightCanvas/2, item.attributs.taille*multiplicateurTaille, item.attributs.taille*multiplicateurTaille * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = item.attributs.couleur;
    ctx.fill();
    ctx.restore();
}

function dessinerCanvas(listeItem) {
    for (const item of listeItem) {
        const ctx = item.ctx;
        const { width, height } = item.canvas;

        // Nettoyage du canvas
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, width, height);

        if (item.decouvert) {
            switch (item.attributs.formeDessin) {
                case 'cercle':
                    dessinerCercle(ctx, width, height, item);
                    break;
                case 'triangle':
                    dessinerTriangle(ctx, width, height, item);
                    break;
                case 'ellipse':
                    dessinerEllipse(ctx, width, height, item);
                    break;
                case 'TourClassique':
                    dessinerTourClassique(ctx, width, height, item);
                    break;
                case 'TourRalentissante':
                    dessinerTourRalentissante(ctx, width, height, item);
                    break;
                case 'TourExplosive':
                    dessinerTourExplosive(ctx, width, height, item);
                    break;
                default:
                    console.warn(`Forme de dessin inconnue : ${item.attributs.formeDessin} pour l'item ${item.attributs.nom}`);
                    break;
            }
        } else {
            dessinerCadenas(ctx, width, height);
        }
    }
}

const listeTours = await getTours();
const listeEnnemis = await getEnnemis();
const listeItem = await creerListeItem(listeTours, listeEnnemis);
dessinerCanvas(listeItem);
