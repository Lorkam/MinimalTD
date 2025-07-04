import { Partie } from "./game.js";

const niveauChoisi = document.getElementById('niveauChoisi').value;
const nomSauvegarde = document.getElementById('nomSauvegarde').value;
const parametrePartie = [niveauChoisi, 5, nomSauvegarde]; // Paramètres du jeu, par exemple le niveau et la difficulté
let partie = new Partie(...parametrePartie); // Création d'une instance de Partie avec les paramètres
partie.play();

function reset() {
    document.getElementById('divEcranSombre').style.display = 'none';
    document.getElementById('divImgVictoire').style.display = 'none';
    document.getElementById('divImgDefaite').style.display = 'none';
    partie = null;
    console.clear();
    partie = new Partie(...parametrePartie);
    partie.play();
}

document.getElementById('btnRejouerVictoire').addEventListener('click', reset);
document.getElementById('btnRejouerDefaite').addEventListener('click', reset);
