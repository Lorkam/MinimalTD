<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini Tower Defense</title>
    <div id="style-container"></div>
    <script>
        const dateCSS = new Date().getTime();
        const logiqueCSS = document.createElement('link');
        logiqueCSS.href = '../css/style.css?v=' + dateCSS; // cache buster avec timestamp
        logiqueCSS.rel = 'stylesheet';
        document.getElementById('style-container').appendChild(logiqueCSS);
    </script>
</head>
<body>
    <input type="hidden" id="niveauChoisi" value="<?php echo $_POST['niveau']; ?>">
    <div id="divRetourMenuPrincipale" onclick="window.location.href='menuPrincipale.html'"><img src="../assets/img/maison.png"></div>
    <canvas id="gameCanvas" width="1550" height="710"></canvas>


    <div class="" id="divInfoVague">
      <p>Vague actuelle : <span id="numVague">1</span></p>
      <p>Ennemis restants : <span id="nbEnnemisRestants">0</span></p>
      <p>Ennemis tués : <span id="nbEnnemisMorts">0</span></p>
    </div>
    <div id="divGolds">
      <span id="golds">0</span><img id="imgGolds" src="../assets/img/euro.png" alt="gold">
    </div>
    
    <div id="divEcranSombre" style="display: none;"></div>
    <div id="divImgVictoire" style="display: none;">
        <img src="../assets/img/victoire.png" alt="victoire">
        <div class="flex-row">
            <button id="btnRejouerVictoire">Rejouer</button>
            <button class="btnMainMenu">Revenir au menu principale</button>
        </div>
    </div>
    <div id="divImgDefaite" style="display: none;">
        <img src="../assets/img/defaite.png" alt="defaite">
        <div class="flex-row">
            <button id="btnRejouerDefaite">Réessayer</button>
            <button class="btnMainMenu">Revenir au menu principale</button>
        </div>
    </div>


    
    <button id="lancerVagueBtn">Lancer la Prochaine Vague</button>






    <div id="script-container"></div>
    <script>
        const date = new Date().getTime();
        const logiqueJS = document.createElement('script');
        logiqueJS.src = '../src/partie/lancement.js?v=' + date; // cache buster avec timestamp
        logiqueJS.type = 'module';
        document.getElementById('script-container').appendChild(logiqueJS);
    </script>
</body>
</html>