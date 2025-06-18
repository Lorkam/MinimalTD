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
    case 'enregisterDeblocage':
        enregisterDeblocage($saves, $nom);
        break;
    default:
        echo 'action non reconnue';
        break;
}

function enregisterDeblocage(&$saves, $nom){
    $typeMonnaie = $_POST['typeMonnaie'];
    $nouveauMontant = (int) $_POST['montant']; // Assure que c'est bien un nombre
    $nomTechno = $_POST['nomTechno'];

    // Modifie la valeur
    $saves['saves'][$nom]['monnaies'][$typeMonnaie] += $nouveauMontant;
    $saves['saves'][$nom]['technologies'][$nomTechno]['lvl1'] = true;

    // Réécrit dans le fichier JSON
    file_put_contents('saves.json', json_encode($saves, JSON_PRETTY_PRINT));
    echo json_encode($saves['saves'][$nom]['monnaies'][$typeMonnaie]);
}