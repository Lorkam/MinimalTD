
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
        ]
      },
      {
        ennemis: [
          { type: "classique", nb: 3, intervale: 1250 }
        ]
      },
      {
        ennemis: [
          { type: "classique", nb: 10, intervale: 1250 }
        ]
      }
    ]
  }
};
