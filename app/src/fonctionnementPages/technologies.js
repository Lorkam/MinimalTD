import { MenuTechnologies } from "../technologies/menuTechnologies.js";

const nomSauvegarde = document.querySelector('#nomSauvegarde').value;

const menuTechnologies = new MenuTechnologies(nomSauvegarde);

await menuTechnologies.chargerNoeuds();
await menuTechnologies.initialiserSauvegarde();
menuTechnologies.dessinerLiensNoeuds();
