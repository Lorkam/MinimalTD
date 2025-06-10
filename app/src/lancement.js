import { Game } from "./game.js";

const parametreGame = ['Niveau 1', 5]; // Paramètres du jeu, par exemple le niveau et la difficulté
let game = new Game(parametreGame[0], parametreGame[1]); // Création d'une instance de Game avec les paramètres
game.play();

function reset() {
    console.log("Réinitialisation du niveau");
    document.getElementById('divEcranSombre').style.display = 'none';
    document.getElementById('divImgVictoire').style.display = 'none';
    document.getElementById('divImgDefaite').style.display = 'none';
    game = null;
    game = new Game(parametreGame[0], parametreGame[1]);
    game.play();
}

document.getElementById('btnRejouerVictoire').addEventListener('click', reset);
document.getElementById('btnRejouerDefaite').addEventListener('click', reset);
