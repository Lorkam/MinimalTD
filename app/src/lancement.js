import { Game } from "./game.js";


let game = new Game('Niveau 1', 2);
game.play();



document.getElementById('btnRejouerVictoire').addEventListener('click', () => {
    console.log("Rejouer le jeu");
    document.getElementById('divEcranSombre').style.display = 'none'; // Masque l'écran sombre
    document.getElementById('divImgVictoire').style.display = 'none'; // Masque l'image de victoire
    game = null;
    game = new Game('Niveau 1');
    game.play();
});
document.getElementById('btnRejouerDefaite').addEventListener('click', () => {
    console.log("Rejouer le jeu");
    document.getElementById('divEcranSombre').style.display = 'none'; // Affiche l'image de défaite
    document.getElementById('divImgDefaite').style.display = 'none'; // Affiche l'image de défaite
    game = null;
    game = new Game('Niveau 1');
    game.play();
});