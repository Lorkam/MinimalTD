<?php 
session_start();
$sauvegarde = $_SESSION['nomSauvegarde'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technologies</title>
    <div id="style-container"></div>
    <script>
        const dateCSS = new Date().getTime();
        const logiqueCSS = document.createElement('link');
        logiqueCSS.href = '../css/styleTechnologies.css?v=' + dateCSS; // cache buster avec timestamp
        logiqueCSS.rel = 'stylesheet';
        document.getElementById('style-container').appendChild(logiqueCSS);
    </script>
</head>
<body>
    <canvas id="canvasTechno" width="1550px" height="710px"></canvas>
    <div class="arbre">
        <div class="noeud" id="centre"><img class="imgArbreTechno debloquee cachee" src="../assets/img/technoDebloquee.png"><img class="imgArbreTechno bloquee" src="../assets/img/technoBloquee.png"></div>
        <div class="noeud" id="vitesseAttaque"><img class="imgArbreTechno debloquee cachee" src="../assets/img/vitesseAttaqueDebloquee.png"><img class="imgArbreTechno bloquee cachee" src="../assets/img/vitesseAttaqueBloquee.png"><img class="imgArbreTechno hiden" src="../assets/img/technoHiden.png"></div>
        <div class="noeud" id="degats"><img class="imgArbreTechno debloquee cachee" src="../assets/img/augmDegatsDebloquee.png"><img class="imgArbreTechno bloquee cachee" src="../assets/img/augmDegatsBloquee.png"><img class="imgArbreTechno hiden" src="../assets/img/technoHiden.png"></div>
        <div class="noeud" id="orDeDepart"><img class="imgArbreTechno debloquee cachee" src="../assets/img/orDepartDebloquee.png"><img class="imgArbreTechno bloquee cachee" src="../assets/img/orDepartBloquee.png"><img class="imgArbreTechno hiden" src="../assets/img/technoHiden.png"></div>
        <div class="noeud" id="lvlUpTours"><img class="imgArbreTechno debloquee cachee" src="../assets/img/lvlUpDebloquee.png"><img class="imgArbreTechno bloquee cachee" src="../assets/img/lvlUpBloquee.png"><img class="imgArbreTechno hiden" src="../assets/img/technoHiden.png"></div>
        <div class="noeud" id="critRate"><img class="imgArbreTechno debloquee cachee" src="../assets/img/critRateDebloquee.png"><img class="imgArbreTechno bloquee cachee" src="../assets/img/critRateBloquee.png"><img class="imgArbreTechno hiden cachee" src="../assets/img/technoHiden.png"></div>
        <div class="noeud" id="critDamage"><img class="imgArbreTechno debloquee cachee" src="../assets/img/critDmgDebloquee.png"><img class="imgArbreTechno bloquee cachee" src="../assets/img/critDmgBloquee.png"><img class="imgArbreTechno hiden cachee" src="../assets/img/technoHiden.png"></div>
    </div>

    <div id="divRetourMenuPrincipale" onclick="window.location.href='menuPrincipale.php'"><img src="../assets/img/maison.png"></div>
    <div id="divMonaies" class="flex-column">
        <div id="divTriangles" class="flex-row">18 <img src="../assets/img/triangle.png"></div>
        <div id="divRonds" class="flex-row">6 <img src="../assets/img/rond.png"></div>
    </div>
    <div id="divInfoNoeud" class="cachee">coucou</div>



    <div id="script-container"></div>
    <script>
        const date = new Date().getTime();
        const logiqueJS = document.createElement('script');
        logiqueJS.src = '../src/fonctionnementPages/technologies.js?v=' + date; // cache buster avec timestamp
        logiqueJS.type = 'module';
        document.getElementById('script-container').appendChild(logiqueJS);
    </script>
</body>
</html>