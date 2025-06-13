<?php
$action = $_POST['action'];
$nom = $_POST['nom'];

switch ($action){
    case 'lireSaves':
        $saves = json_decode(file_get_contents('saves.json'), true);
        echo json_encode($saves);
        break;
    default:
        echo 'action non reconnue';
        break;
}
