const menuJouer = document.querySelector('#menuMilieu');
const btnJouer = document.querySelector('#btnJouer');
const divContainerNiveaux = document.querySelector('#divContainerNiveaux');
const btnLancerNiveau = document.querySelector('#btnLancerNiveau');
const divNiveaux = document.querySelector('#divNiveaux');
var lvlActuellementSelectionne = 1;
const endroitsClickable = [
    btnJouer, 
    menuJouer, 
    divNiveaux, 
    ...document.querySelectorAll('.fleche img'), 
    btnLancerNiveau, 
    divContainerNiveaux, 
    document.querySelector('h2')
];
//console.log(endroitsClickable);

function afficherMenuJouer(){
    menuJouer.classList.remove("cachee");
    menuJouer.classList.add("apparition");
    setTimeout(() => {
        menuJouer.classList.remove("apparition");
    }, 500); // Durée de l'animation d'apparition
}

btnJouer.addEventListener('click', function() {
    if (menuJouer.classList.contains("cachee")){
        afficherMenuJouer();
    }
});
document.querySelector('body').addEventListener('click', (e) => {
    //console.log(e.target);
    if (!menuJouer.classList.contains("cachee")) {
        if (!endroitsClickable.includes(e.target)) {
            menuJouer.classList.add("disparition");
            setTimeout(() => {
                menuJouer.classList.add("cachee");
                menuJouer.classList.remove("disparition");
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
            console.log('changement de niveau : ', lvlActuellementSelectionne);
            
        } else if (divParent.id === 'flecheDroite') {
            mettreAJourNiveauSelectionne('+');
            console.log('changement de niveau : ', lvlActuellementSelectionne);
        }
    });
});

function mettreAJourNiveauSelectionne(action) {
    switch (action) {
        case '-':
            switch (lvlActuellementSelectionne) {
                case 2:
                    divNiveaux.classList.remove('from3To2');
                    divNiveaux.classList.remove('from1To2');
                    divNiveaux.classList.add('from2To1');
                    break;
                case 3:
                    divNiveaux.classList.remove('from2To3');
                    divNiveaux.classList.add('from3To2');
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
                    break;
                case 2:
                    divNiveaux.classList.remove('from3To2');
                    divNiveaux.classList.remove('from1To2');
                    divNiveaux.classList.add('from2To3');
                    break;
            }
            if (lvlActuellementSelectionne < 3) {
                lvlActuellementSelectionne++;
            }
            break;
    }
    for(let i = 1; i <= divNiveaux.children.length; i++) {
        const niveau = divNiveaux.children[i-1];
        if (i == lvlActuellementSelectionne) {
            niveau.style.visibility = 'visible';
        } else {
            setTimeout(() => {
                niveau.style.visibility = 'hidden';
            }, 500); // Durée de l'animation de disparition
        }
    }
}