import { Partie } from "./game.js";

const niveauChoisi = document.getElementById('niveauChoisi').value;
const parametrePartie = [niveauChoisi, 1]; // Paramètres du jeu, par exemple le niveau et la difficulté
let partie = new Partie(parametrePartie[0], parametrePartie[1]); // Création d'une instance de Partie avec les paramètres
partie.play();

function reset() {
    document.getElementById('divEcranSombre').style.display = 'none';
    document.getElementById('divImgVictoire').style.display = 'none';
    document.getElementById('divImgDefaite').style.display = 'none';
    partie = null;
    console.clear();
    partie = new Partie(parametrePartie[0], parametrePartie[1]);
    partie.play();
}

document.getElementById('btnRejouerVictoire').addEventListener('click', reset);
document.getElementById('btnRejouerDefaite').addEventListener('click', reset);
