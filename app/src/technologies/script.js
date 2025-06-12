import { Noeud } from "./noeuds.js";


console.log("Script de gestion des technologies chargé");
// Désactivation du menu contextuel de google Chrome
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

const noeuds = [
    new Noeud("centre", 100, "or", ['vitesseAttaque', 'degats', 'orDeDepart', 'lvlUpTours']),
    new Noeud("vitesseAttaque", 200, "or"),
    new Noeud("degats", 300, "or", ['critRate', 'critDamage']),
    new Noeud("orDeDepart", 400, "or"),
    new Noeud("lvlUpTours", 500, "or"),
    new Noeud("critRate", 500, "or"),
    new Noeud("critDamage", 500, "or")
];