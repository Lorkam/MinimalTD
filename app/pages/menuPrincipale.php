<?php 
session_start();
$sauvegarde = $_SESSION['nomSauvegarde']??null;
//var_dump($sauvegarde);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MinimalTD</title>
    <div id="style-container"></div>
    <script>
        const dateCSS = new Date().getTime();
        const logiqueCSS = document.createElement('link');
        logiqueCSS.href = '../css/menuPrincipale.css?v=' + dateCSS; // cache buster avec timestamp
        logiqueCSS.rel = 'stylesheet';
        document.getElementById('style-container').appendChild(logiqueCSS);
    </script>
</head>
<body>
    <input type="hidden" id="nomSauvegarde" value="<?php echo $sauvegarde; ?>">
    <div id="divBordureJeu">
    <div id="divContainerJeu">
        <div id="menuGauche">
            <div class="flex-column" id="listeBtnPrincipaux">
                <h1>MinimalTD</h1>
                <button id="btnJouer" class="btnMenuPrincipale <?php if($sauvegarde==null){echo "disabled";}?>" <?php if($sauvegarde==null){echo "disabled";}?>>Jouer</button>
                <button id="btnTechnologies" class="btnMenuPrincipale <?php if($sauvegarde==null){echo "disabled";}?>" onclick="window.location.href='technologies.php'" <?php if($sauvegarde==null){echo "disabled";}?>>Technologies</button>
                <button id="btnMenuSauvegarder" class="btnMenuPrincipale">Charger une sauvegarde</button>
                <button id="btnMenuChargerSave" class="btnMenuPrincipale">jcp quoi</button>
                <button id="btnCredits" class="btnMenuPrincipale" onclick="window.location.href='credit.html'">Crédits</button>
            </div>
        </div>
        <div class="flex-column cachee" id="menuMilieu">
            <div id="divContainerNiveaux" style="display: none;">
                <h2>Choisissez un niveau</h2>
                <div class="flex-row" id="divImagesNiveaux"><img src="../assets/img/niveau1.png"><img src="../assets/img/niveau2.png"><img src="../assets/img/niveau3.png"></div>
                <div class="flex-row" id="divNiveaux"><span>Niveau 1</span><span>Niveau 2</span><span>Niveau 3</span></div>
                <button id="flecheGauche" class="fleche"><img src="../assets/img/flecheGauche.png"></button>
                <button id="flecheDroite" class="fleche"><img src="../assets/img/flecheDroite.png"></button>
                <form id="formLancerNiveau" action="partie.php" method="post">
                    <input type="hidden" id="numNiveau" name="numNiveau" value="Niveau 1">
                    <button id="btnLancerNiveau" class="btnBasMenuMilieu">Lancer le Niveau</button>
                </form>
            </div>
            <div id="divContainerSauvegarder" style="display: none;">
                <h2>Sauvegardes</h2>
                <div class="flex-column" id="divSauvegardes">
                    <div class="divEmplacementSauvegarde flex-row"><div class="emplacementSauvegarde">Emplacement Vide<span></span><div class="posRelative"><span class="poubelle">🗑️</span></div></div></div>
                    <div class="divEmplacementSauvegarde flex-row"><div class="emplacementSauvegarde">Emplacement Vide<span></span><div class="posRelative"><span class="poubelle">🗑️</span></div></div></div>
                    <div class="divEmplacementSauvegarde flex-row"><div class="emplacementSauvegarde">Emplacement Vide<span></span><div class="posRelative"><span class="poubelle">🗑️</span></div></div></div>
                    <div class="divEmplacementSauvegarde flex-row"><div class="emplacementSauvegarde">Emplacement Vide<span></span><div class="posRelative"><span class="poubelle">🗑️</span></div></div></div>
                </div>
                <button id="btnSauvegarder" class="btnBasMenuMilieu">Sauvegarder</button>
            </div>
        </div>
    </div>
    </div>

    <div id="script-container"></div>
    <script>
        const dateJS = new Date().getTime();
        const logiqueJS = document.createElement('script');
        logiqueJS.src = '../src/fonctionnementPages/menuPrincipale.js?v=' + dateJS; // cache buster avec timestamp
        logiqueJS.type = 'module';
        document.getElementById('script-container').appendChild(logiqueJS);
    </script>
    
</body>
</html>