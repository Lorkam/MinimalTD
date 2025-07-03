<?php
session_start();
$nomSauvegarde = $_SESSION['nomSauvegarde'] ?? null;
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>bestiaire</title>
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
        <h1>Bestiaire</h1>
        <div id="grilleBestiaire">
            <div id="listeTours" class="case">
                <h2>Les tours</h2>
                <div class="item flex-column"><canvas id="TourClassique"></canvas><p>Classique</p><input type="hidden" name="TourClassique" value="1"></div>
            </div>
            <div id="listeEnnemis" class="case flex-column gap">
                <div id="ennmisNormaux" class="case2">
                    <h2>Les Ennemis normaux</h2><div class="grilleCase">
                    <div class="item flex-column"><canvas id="EnnemiClassique"></canvas><p>Classique</p><input type="hidden" name="EnnemiClassique" value="1"></div>
                    <div class="item flex-column"><canvas id="EnnemiTank"></canvas><p>Tank</p><input type="hidden" name="EnnemiTank" value="1"></div>
                    <div class="item flex-column"><canvas id="EnnemiRapide"></canvas><p>Rapide</p><input type="hidden" name="EnnemiRapide" value="1"></div>
                    <div class="item flex-column"><canvas id="EnnemiReplicateur"></canvas><p>Réplicateur</p><input type="hidden" name="EnnemiReplicateur" value="1"></div>
                    <div class="item flex-column"><canvas id="EnnemiReplique"></canvas><p>Répliqué</p><input type="hidden" name="EnnemiReplique" value="1"></div>
                    <div class="item flex-column"><canvas id="EnnemiReplique"></canvas><p>Répliqué</p><input type="hidden" name="EnnemiReplique" value="1"></div>
                    <div class="item flex-column"><canvas id="EnnemiReplique"></canvas><p>Répliqué</p><input type="hidden" name="EnnemiReplique" value="1"></div>
                </div></div>
                <div id="Boss" class="case2">
                    <h2>Les Boss</h2><div class="grilleCase">
                    <div class="item flex-column"><canvas id="BossMontagne"></canvas><p>Montagne</p><input type="hidden" name="BossMontagne" value="1"></div>
                    <div class="item flex-column"><canvas id="BossInvocateur"></canvas><p>Invocateur</p><input type="hidden" name="BossInvocateur" value="1"></div>
                </div></div>
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