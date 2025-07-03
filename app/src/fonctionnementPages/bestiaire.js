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
    return listeItem;
}





const listeTours = await getTours();
const listeEnnemis = await getEnnemis();
const listeItem = creerListeItem(listeTours, listeEnnemis);
console.log(listeItem);
