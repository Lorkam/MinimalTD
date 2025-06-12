
export const niveaux = {
  "Niveau 1": {
    chemin: [{ x: 400, y: 300 }, { x: 1000, y: 300 }],
    emplacementsTower: [
      { x: 560, y: 260 },
      { x: 670, y: 340 },
      { x: 780, y: 260 },
      { x: 890, y: 340 }
    ],
    heart: { x: 1005, y: 277},
    vagues: [
      {
        ennemis: [
          { type: "classique", nb: 1, intervale: 1000 }
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "classique", nb: 4, intervale: 1250 },
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
          { type: "rapide", nb: 20, intervale: 300 }
        ],
        derniereVague: true
      },
    ]
  },
  "Niveau 2": {
    chemin: [{ x: 300, y: 450 }, { x: 500, y: 450 }, { x: 500, y: 250 }, { x: 900, y: 250 }, { x: 900, y: 450 }],
    emplacementsTower: [
      { x: 460, y: 410 },
      { x: 540, y: 290 },
      { x: 700, y: 210 },
      { x: 860, y: 290 }
    ],
    heart: { x: 875, y: 460},
    vagues: [
      {
        ennemis: [
          { type: "classique", nb: 2, intervale: 1000 }
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "classique", nb: 5, intervale: 1250 },
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "tank", nb: 2, intervale: 2000 }
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "rapide", nb: 4, intervale: 750 }
        ],
        derniereVague: false
      },
      {
        ennemis: [
          { type: "rapide", nb: 10, intervale: 1000 }
        ],
        derniereVague: true
      },
    ]
  }
};
