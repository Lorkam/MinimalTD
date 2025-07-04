<?php
session_start();
$nomSauvegarde = $_SESSION['nomSauvegarde'] ?? null;
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../assets/img/iconeJeu.png" />
    <title>Bestiaire</title>
    <div id="style-container"></div>
    <script>
        const dateCSS = new Date().getTime();
        const logiqueCSS = document.createElement('link');
        logiqueCSS.href = '../css/bestiaire.css?v=' + dateCSS; // cache buster avec timestamp
        logiqueCSS.rel = 'stylesheet';
        document.getElementById('style-container').appendChild(logiqueCSS);
    </script>
</head>
<body>
    <div id="divBordureJeu">
    <div id="divContainerJeu">
        <input type="hidden" name="nomSauvegarde" value="<?php echo $nomSauvegarde; ?>">
        <div id="divRetourMenuPrincipale" onclick="window.location.href='menuPrincipale.php'"><img src="../assets/img/maison.png"></div>
        <div class="flex-row"><h1>Bestiaire</h1></div>
        <div id="grilleBestiaire">
            <div id="listeTours" class="case">
                <div id="Tours" class="case2">
                    <h2>Les tours</h2>
                    <div class="grilleCase"></div>
                </div>
            </div>
            <div id="listeEnnemis" class="case flex-column gap">
                <div id="ennmisNormaux" class="case2">
                    <h2>Les Ennemis normaux</h2>
                    <div class="grilleCase"></div>
                </div>
                <div id="Boss" class="case2">
                    <h2>Les Boss</h2>
                    <div class="grilleCase"></div>
                </div>
            </div>
        </div>
        <div id="infoItem" class="flex-column">
            <h2 id="titreItem">Titre par défaut</h2>
            <p id="description">Description par défaut</p>
            <div id="statItem">
                <div class="ligneAttribut"><span class="nomAttribut">Attribut 1 : </span><span class="valeurAttribut">42</span></div>
                <div class="ligneAttribut"><span class="nomAttribut">Attribut 2 : </span><span class="valeurAttribut">79</span></div>
                <div class="ligneAttribut"><span class="nomAttribut">Attribut 3 : </span><span class="valeurAttribut">3</span></div>
            </div>
        </div>
    </div>
    </div>

    <div id="script-container"></div>
    <script>
        const dateJS = new Date().getTime();
        const logiqueJS = document.createElement('script');
        logiqueJS.src = '../src/fonctionnementPages/bestiaire.js?v=' + dateJS; // cache buster avec timestamp
        logiqueJS.type = 'module';
        document.getElementById('script-container').appendChild(logiqueJS);
    </script>
</body>
</html>