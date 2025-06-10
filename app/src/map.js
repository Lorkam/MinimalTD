
export const niveaux = {
  "Niveau 1": {
    chemin: [{ x: 400, y: 300 }, { x: 1000, y: 300 }],
    emplacementsTower: [
      { x: 650, y: 260 },
      { x: 750, y: 260 },
      { x: 650, y: 340 },
      { x: 750, y: 340 }
    ],
    heart: { x: 1005, y: 277, pv: 3 },
    vagues: [
      {
        ennemis: [
          { type: "classique", nb: 1, intervale: 1000 }
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "classique", nb: 3, intervale: 1250 },
          { type: "tank", nb: 1, intervale: 1250 },
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "tank", nb: 3, intervale: 1750 }
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "rapide", nb: 5, intervale: 750 }
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "rapide", nb: 20, intervale: 500 }
        ],
        derniereVague: true
      },
    ]
  }
};
