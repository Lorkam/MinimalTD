
console.log("Chargement du menu principal");
const menuJouer = document.querySelector('#menuMilieu');
const btnJouer = document.querySelector('#btnJouer');

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
    if (!menuJouer.classList.contains("cachee")) {
        const endroitsClickable = [btnJouer, menuJouer, document.querySelector('#niveau')];
        if (!endroitsClickable.includes(e.target)) {
            menuJouer.classList.add("disparition");
            setTimeout(() => {
                menuJouer.classList.add("cachee");
                menuJouer.classList.remove("disparition");
            }, 500); // Durée de l'animation de disparition
        }
    }
});