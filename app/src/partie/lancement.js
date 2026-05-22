import { Partie } from "./game.js";

const niveauChoisi = document.getElementById('niveauChoisi').value;
const nomSauvegarde = document.getElementById('nomSauvegarde').value;
const parametrePartie = [niveauChoisi, 1, nomSauvegarde]; // Paramètres du jeu, par exemple le niveau et la difficulté
let partie = new Partie(...parametrePartie); // Création d'une instance de Partie avec les paramètres
partie.play();

/**
 * Réinitialise le niveau actuel en rechargeant la page avec les paramètres du niveau choisi.
 * @function
 */
function reset() {
    const body = document.querySelector('body')
    const form = document.createElement('form');
    const url = 'partie.php';
    form.method = 'POST';
    form.action = url;
    form.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'numNiveau';
    input.id = 'numNiveau';
    input.value = niveauChoisi;
    form.appendChild(input);
    body.appendChild(form);
    form.submit();
}

document.getElementById('btnRejouerVictoire').addEventListener('click', reset);
document.getElementById('btnRejouerDefaite').addEventListener('click', reset);
