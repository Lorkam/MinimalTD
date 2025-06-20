<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
$action = $_POST['action']??'enregisterActionTechno';
$nom = $_POST['nom']?? 'test'; // Nom de la sauvegarde, par défaut 'test'
$saves = json_decode(file_get_contents('saves.json'), true);

switch ($action){
    case 'lireSaves':
        echo json_encode($saves);
        break;
    case 'selectionnerSauvegarde':
        $_SESSION['nomSauvegarde'] = $nom;
        break;
    case 'enregisterActionTechno':
        enregisterActionTechno($saves, $nom);
        break;
    case 'sauvegarder':
        sauvegarder($saves, $nom);
        break;
    case 'getNiveauMaxReussi':
        getNiveauMaxReussi($saves, $nom);
        break;
    default:
        echo 'action non reconnue';
        break;
}

function enregisterActionTechno(&$saves, $nom){
    $typeMonnaie = $_POST['typeMonnaie'];
    $nouveauMontant = (int) $_POST['montant'];
    $nomTechno = $_POST['nomTechno']; // Nom de la technologie, par défaut 'centre'
    $action = $_POST['actionTechno']; // Action à effectuer, par défaut 'achat'
    $technos = $saves['saves'][$nom]['technologies'];
    $modificateurs = $saves['saves'][$nom]['modificateurs'];
    require_once 'effetsTechno.php';

    // Modification des valeurs
    if($action == 'achat'){
        $saves['saves'][$nom]['monnaies'][$typeMonnaie] -= $nouveauMontant;
        if(function_exists($nomTechno)) {
            $nomTechno($action, $technos, $modificateurs);
        }
    } elseif ($action == 'vente') {
        $saves['saves'][$nom]['monnaies'][$typeMonnaie] += $nouveauMontant;
        if(function_exists($nomTechno)) {
            $nomTechno($action, $technos, $modificateurs);
        }
    }
    $saves['saves'][$nom]['technologies'] = $technos;
    $saves['saves'][$nom]['modificateurs'] = $modificateurs;
    //echo '<br><br>';print_r($technos);echo '<br><br>';
    //print_r($modificateurs);

    // Remplacement dans le fichier JSON
    file_put_contents('saves.json', json_encode($saves, JSON_PRETTY_PRINT));
    echo json_encode($saves['saves'][$nom]['monnaies'][$typeMonnaie]);
}

function sauvegarder(&$saves, $nom){
    if($saves['saves'][$nom]['niveauxCompletes'][$_POST['niveau']]==false) $saves['saves'][$nom]['niveauxCompletes'][$_POST['niveau']] = $_POST['reussiteNiveau']=='true' ? true : false;
    $monnaies = json_decode($_POST['monnaies'], true);
    $saves['saves'][$nom]['monnaies']['triangles'] += $monnaies['triangles'];
    $saves['saves'][$nom]['monnaies']['ronds'] += $monnaies['ronds'];
    $saves['saves'][$nom]['monnaies']['hexagones'] += $monnaies['hexagones'];

    // Remplacement dans le fichier JSON
    file_put_contents('saves.json', json_encode($saves, JSON_PRETTY_PRINT));
}

function getNiveauMaxReussi(&$saves, $nom){
    $niveauxCompletes = $saves['saves'][$nom]['niveauxCompletes'];
    $niveauMax = 0;
    foreach ($niveauxCompletes as $niveau => $reussi) {
        if ($reussi) {
            $niveauMax++;
        }
    }
    echo json_encode($niveauMax);

}