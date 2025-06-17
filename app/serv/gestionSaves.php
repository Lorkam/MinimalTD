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
    default:
        echo 'action non reconnue';
        break;
}
