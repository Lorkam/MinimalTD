import { recupAllNomSaves, selectionnerSauvegarde, creerSauvegarde } from '../sauvegarde/sauvegarde.js';

const btnJouer = document.querySelector('#btnJouer');
const btnMenuSauvegarder = document.querySelector('#btnMenuSauvegarder');
const menuMilieu = document.querySelector('#menuMilieu');
/* Menu Jouer */
const menuJouer = document.querySelector('#divContainerNiveaux');
const divContainerNiveaux = document.querySelector('#divContainerNiveaux');
const btnLancerNiveau = document.querySelector('#btnLancerNiveau');
const inputNumNiveau = document.querySelector('#numNiveau');
const divNiveaux = document.querySelector('#divNiveaux');
const divImagesNiveaux = document.querySelector('#divImagesNiveaux');
var lvlActuellementSelectionne = 1;
/* Menu Sauvegarder */
const menuSauvegarder = document.querySelector('#divContainerSauvegarder');
const divSauvegardes = document.querySelector('#divSauvegardes');
const listeDivSauvegardes = divSauvegardes.querySelectorAll('.divEmplacementSauvegarde');
const listeSauvegardes = divSauvegardes.querySelectorAll('.emplacementSauvegarde');
const listeBtnPoubelles = divSauvegardes.querySelectorAll('.poubelle');
const btnSauvegarder = document.querySelector('#btnSauvegarder');
var nomSauvegarde = document.querySelector('#nomSauvegarde').value; // Nom de la sauvegarde sélectionnée
var niveauMaxReussi = 0;

const endroitsClickable = [
    btnJouer, 
    menuMilieu, 
    divNiveaux, 
    ...divNiveaux.querySelectorAll('span'), 
    ...document.querySelectorAll('#divImagesNiveaux img'),
    ...document.querySelectorAll('.fleche img'), 
    btnLancerNiveau, 
    divContainerNiveaux, 
    divImagesNiveaux,
    ...document.querySelectorAll('h2'),
    menuSauvegarder,
    divSauvegardes,
    ...listeDivSauvegardes,
    ...listeSauvegardes,
    btnMenuSauvegarder,
    btnSauvegarder,
];
//console.log(endroitsClickable);

function affichermenuMilieu(){
    menuMilieu.classList.remove("cachee");
    menuMilieu.classList.add("apparition");
    setTimeout(() => {
        menuMilieu.classList.remove("apparition");
    }, 500); // Durée de l'animation d'apparition
}

async function affichermenuJouer(affichage){
    if(affichage == true){
        menuJouer.style.display = 'block';
    } else {
        menuJouer.style.display = 'none';
    }
    niveauMaxReussi = await getNiveauMaxReussi(nomSauvegarde);
}

function affichermenuSauvegarder(affichage){
    if(affichage == true){
        menuSauvegarder.style.display = 'block';
    } else {
        menuSauvegarder.style.display = 'none';
    }
}

btnJouer.addEventListener('click', function() {
    if (menuMilieu.classList.contains("cachee")){
        affichermenuMilieu();
    }
    affichermenuSauvegarder(false);
    affichermenuJouer(true);
});
btnMenuSauvegarder.addEventListener('click', function() {
    if (menuMilieu.classList.contains("cachee")){
        affichermenuMilieu();
    }

    console.log('nom de la save : ', document.querySelector('#nomSauvegarde').value);
    for(const save of listeSauvegardes) {
        const span = save.querySelector('span');
        if(save.firstChild.nodeValue == document.querySelector('#nomSauvegarde').value) {
            save.parentElement.classList.add('sauvegardeSelectionnee'); // Ajoute la classe de sélection à la sauvegarde correspondante
            span.textContent = '✅';
        }else{
            save.parentElement.classList.remove('sauvegardeSelectionnee'); // Ajoute la classe de sélection à la sauvegarde correspondante
            span.textContent = '';
        }
    }
    affichermenuJouer(false);
    affichermenuSauvegarder(true);
});
/* Gestion du clic en dehors du menu du milieu */
document.querySelector('body').addEventListener('click', (e) => {
    //console.log(e.target);
    if (!menuMilieu.classList.contains("cachee")) {
        if (!endroitsClickable.includes(e.target)) {
            menuMilieu.classList.add("disparition");
            setTimeout(() => {
                menuMilieu.classList.add("cachee");
                menuMilieu.classList.remove("disparition");
            }, 500); // Durée de l'animation de disparition
        }
    }
});

document.querySelectorAll('.fleche img').forEach((fleche) => {
    const divParent = fleche.parentElement;
    divParent.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la propagation de l'événement click
        if (divParent.id === 'flecheGauche') {
            mettreAJourNiveauSelectionne('-');
            //console.log('changement de niveau : ', lvlActuellementSelectionne);
            
        } else if (divParent.id === 'flecheDroite') {
            mettreAJourNiveauSelectionne('+');
            //console.log('changement de niveau : ', lvlActuellementSelectionne);
        }
    });
});

function mettreAJourNiveauSelectionne(action) {
    const nomsNiveaux = ['Niveau 1', 'Niveau 2', 'Niveau 3'];
    switch (action) {
        case '-':
            switch (lvlActuellementSelectionne) {
                case 2:
                    divNiveaux.classList.remove('from3To2');
                    divNiveaux.classList.remove('from1To2');
                    divNiveaux.classList.add('from2To1');
                    divImagesNiveaux.classList.remove('from3To2');
                    divImagesNiveaux.classList.remove('from1To2');
                    divImagesNiveaux.classList.add('from2To1');
                    break;
                case 3:
                    divNiveaux.classList.remove('from2To3');
                    divNiveaux.classList.add('from3To2');
                    divImagesNiveaux.classList.remove('from2To3');
                    divImagesNiveaux.classList.add('from3To2');
                    break;
            }
            if (lvlActuellementSelectionne > 1) {
                lvlActuellementSelectionne--;
            }
            break;
        case '+':
            switch (lvlActuellementSelectionne) {
                case 1:
                    divNiveaux.classList.remove('from2To1');
                    divNiveaux.classList.add('from1To2');
                    divImagesNiveaux.classList.remove('from2To1');
                    divImagesNiveaux.classList.add('from1To2');
                    break;
                case 2:
                    divNiveaux.classList.remove('from3To2');
                    divNiveaux.classList.remove('from1To2');
                    divNiveaux.classList.add('from2To3');
                    divImagesNiveaux.classList.remove('from3To2');
                    divImagesNiveaux.classList.remove('from1To2');
                    divImagesNiveaux.classList.add('from2To3');
                    break;
            }
            if (lvlActuellementSelectionne < 3) {
                lvlActuellementSelectionne++;
            }
            break;
    }
    inputNumNiveau.value = nomsNiveaux[lvlActuellementSelectionne-1];
    if (lvlActuellementSelectionne <= niveauMaxReussi+1) {
        btnLancerNiveau.disabled = false; // Active le bouton Lancer Niveau
        btnLancerNiveau.classList.remove('disabled'); // Enlève la classe disabled
    } else {
        btnLancerNiveau.disabled = true; // Désactive le bouton Lancer Niveau
        btnLancerNiveau.classList.add('disabled'); // Ajoute la classe disabled
    }
}

/**  Gestion des sauvegardes **/
async function afficherSauvegardes() {
    const listeSaves = await recupAllNomSaves();
    for(let i=0; i<listeSaves.length; i++){
        listeSauvegardes[i].firstChild.nodeValue = listeSaves[i];
    }
}
afficherSauvegardes();

function clicSauvegarde(cible){
    if (!cible.parentElement.classList.contains('sauvegardeSelectionnee')/* && cible.textContent !== 'Emplacement Vide'*/) { // à changer
        cible.parentElement.classList.add('sauvegardeSelectionnee');
        nomSauvegarde = cible.firstChild.nodeValue; // Met à jour la variable nomSauvegarde avec le nom de la sauvegarde sélectionnée
        for(const save of listeSauvegardes) {
            if (save !== cible) {
                save.parentElement.classList.remove('sauvegardeSelectionnee');
            }
        }
    } else {
        console.warn("L'élément cliqué n'est pas une sauvegarde valide.");
    }
}
listeDivSauvegardes.forEach((divSauvegarde) => {
    divSauvegarde.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la propagation de l'événement click
        clicSauvegarde(divSauvegarde.querySelector('.emplacementSauvegarde'));
    });
});
btnSauvegarder.addEventListener('click', async (e) => {
    e.stopPropagation(); // Empêche la propagation de l'événement click
    if (nomSauvegarde !== '') {
        if( nomSauvegarde === 'Emplacement Vide') {
            nomSauvegarde = prompt("Entrez le nouveau nom de la sauvegarde :");
            if(nomSauvegarde!=null) {
                nomSauvegarde = nomSauvegarde.trim();
                await creerSauvegarde(nomSauvegarde);
            }else {
                console.warn("Aucun nom de sauvegarde n'a été entré.");
                nomSauvegarde = ''; // Réinitialise la variable nomSauvegarde
                return; // Si l'utilisateur annule, on ne fait rien
            }
        }
        try {
            await selectionnerSauvegarde(nomSauvegarde);
            const sauvegardeSelectionnee = document.querySelector('.sauvegardeSelectionnee').firstChild;
            for(const save of listeSauvegardes) {
                const span = save.querySelector('span');
                if(save == sauvegardeSelectionnee) {
                    save.firstChild.nodeValue = nomSauvegarde; // Met à jour le nom de la sauvegarde sélectionnée
                    span.textContent = '✅'; // met le ✅ sur la sauvegarde sélectionnée
                }else {
                    span.textContent = ''; // Enlève le ✅ des autres sauvegardes
                }
            }
            btnJouer.disabled = false; // Active le bouton Jouer
            btnJouer.classList.remove('disabled'); // Enlève la classe disabled
            const btnTechnologies = document.querySelector("#btnTechnologies");
            btnTechnologies.disabled = false; // Active le bouton Jouer
            btnTechnologies.classList.remove('disabled'); // Enlève la classe disabled
            const btnBestiaire = document.querySelector('#btnBestiaire');
            btnBestiaire.disabled = false; // Active le bouton Jouer
            btnBestiaire.classList.remove('disabled'); // Enlève la classe disabled
            document.querySelector('#nomSauvegarde').value = sauvegardeSelectionnee.firstChild.nodeValue; // Met à jour le champ de saisie avec le nom de la sauvegarde sélectionnée
            nomSauvegarde = document.querySelector('#nomSauvegarde').value; // Met à jour la variable nomSauvegarde
            niveauMaxReussi = await getNiveauMaxReussi(nomSauvegarde);

        } catch (error) {
            console.error('Erreur lors de la sélection de la sauvegarde :', error);
        }
    } else {
        console.error("Aucune sauvegarde n'a été sélectionnée.");
    }
});

async function getNiveauMaxReussi(nomSauvegarde2) {
    const url = '../serv/gestionSaves.php';
    try {
        // Création de la requête pour accéder au PHP
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=getNiveauMaxReussi' + '&nom=' + encodeURIComponent(nomSauvegarde2)
        });

        const data = await response.text();
        //console.log(nomSauvegarde2, ':', data);
        return parseInt(data, 10);
    } catch (error) {
        console.error('Erreur récupération données :', error);
    }
}

/* Gestion de la suppression des sauvegardes */
async function suppressionSauvegarde(poubelle){
    const divSauvegardeSupr = poubelle.parentElement.parentElement;
    const nomSauvegardeSupr = divSauvegardeSupr.firstChild.nodeValue;
    //console.log(divSauvegardeSupr);
    if (nomSauvegardeSupr !== 'Emplacement Vide') {
        try{
            const url = '../serv/gestionSaves.php';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=supprimerSauvegarde' + '&nom=' + encodeURIComponent(nomSauvegardeSupr)
            });
            const data = await response.text();
            //console.log(data);
        } catch (error) {
            console.error('Erreur lors de la suppression de la sauvegarde :', error);
        }
    }
    if(divSauvegardeSupr.parentElement.classList.contains('sauvegardeSelectionnee')) {
        divSauvegardeSupr.parentElement.classList.remove('sauvegardeSelectionnee'); //
        divSauvegardeSupr.querySelector('span').textContent = ''; // Enlève le ✅
        nomSauvegarde = ''; // Réinitialise la variable nomSauvegarde
        btnJouer.disabled = true; // Désactive le bouton Jouer
        btnJouer.classList.add('disabled'); // Ajoute la classe disabled
        const btnTechnologies = document.querySelector("#btnTechnologies");
        btnTechnologies.disabled = true; // Désactive le bouton Technologies
        btnTechnologies.classList.add('disabled'); // Ajoute la classe disabled
        const btnBestiaire = document.querySelector('#btnBestiaire');
        btnBestiaire.disabled = true; // Désactive le bouton Technologies
        btnBestiaire.classList.add('disabled'); // Ajoute la classe disabled
    }
    divSauvegardeSupr.firstChild.nodeValue = 'Emplacement Vide'; // Réinitialise le nom de la sauvegarde
}
listeBtnPoubelles.forEach((poubelle) => {
    poubelle.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la propagation de l'événement click
        if( !confirm("Êtes-vous sûr de vouloir supprimer cette sauvegarde ?")) {
            return; // Si l'utilisateur annule, on ne fait rien
        }
        suppressionSauvegarde(poubelle);
    });
});