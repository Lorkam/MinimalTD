<?php
session_start();
$action = $_POST['action'];
$nom = $_POST['nom'];
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
    default:
        echo 'action non reconnue';
        break;
}

function enregisterActionTechno(&$saves, $nom){
    $typeMonnaie = $_POST['typeMonnaie'];
    $nouveauMontant = (int) $_POST['montant'];
    $nomTechno = $_POST['nomTechno'];
    $action = $_POST['actionTechno'];

    // Modification des valeurs
    if($action == 'achat'){
        $saves['saves'][$nom]['monnaies'][$typeMonnaie] -= $nouveauMontant;
        $saves['saves'][$nom]['technologies'][$nomTechno]['lvl1'] = true;
    } elseif ($action == 'vente') {
        $saves['saves'][$nom]['monnaies'][$typeMonnaie] += $nouveauMontant;
        $saves['saves'][$nom]['technologies'][$nomTechno]['lvl1'] = false;
    }

    // Remplacement dans le fichier JSON
    file_put_contents('saves.json', json_encode($saves, JSON_PRETTY_PRINT));
    echo json_encode($saves['saves'][$nom]['monnaies'][$typeMonnaie]);
}