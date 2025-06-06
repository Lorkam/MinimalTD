const intervale = 1250; // Intervalle (ms) de spawn des ennemis
const nbEnemyMax = 5; // nombre d'enemies du niveau

const chemin = [
    {x: 400, y: 300 },
    {x: 1000, y: 300 }
];
const emplacementsTower = [
  {x: 650, y: 260 },
  {x: 750, y: 260 },
  {x: 650, y: 340 },
  {x: 750, y: 340 }
];
const heart = {x:1005, y:277, pv:3}; // Coeur du joueur

export const niveaux = {
  "Niveau 1":{
    chemin: chemin, intervale: intervale, nbEnemyMax: nbEnemyMax, emplacementsTower:emplacementsTower, heart:heart},
}