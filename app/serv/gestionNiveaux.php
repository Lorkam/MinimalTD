<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
$action = $_POST['action'];
$nomNiveau = $_POST['niveau']?? 'Niveau 1'; // nom du niveau, par défaut : 'Niveau 1'
$niveaux = json_decode(file_get_contents('niveaux.json'), true);

switch ($action){
    case 'chargerNiveau':
        chargerNiveau($niveaux, $nomNiveau);
        break;
    /*case 'selectionnerNiveau':
        selectionnerNiveau($numero);
        break;*/
    default:
        echo 'action non reconnue';
        break;
}

function chargerNiveau($niveaux, $nomNiveau){
    echo json_encode($niveaux[$nomNiveau]);
    return;
}