import { MenuTechnologies } from "../technologies/menuTechnologies.js";

const nomSauvegarde = document.querySelector('#nomSauvegarde').value;

const menuTechnologies = new MenuTechnologies(nomSauvegarde);
menuTechnologies.initialiserSauvegarde();
menuTechnologies.dessinerLiensNoeuds();



const listeNoeuds = document.querySelectorAll('.noeud');