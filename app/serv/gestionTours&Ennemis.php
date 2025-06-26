<?php

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'chargerStatTours':
        // Récupérer les tours
        $statTours = json_decode(file_get_contents('tours.json'));
        echo json_encode($statTours);
        break;

    case 'chargerStatEnnemis':
        // Récupérer les ennemis
        $statEnnemis = json_decode(file_get_contents('ennemis.json'));
        echo json_encode($statEnnemis);
        break;

    default:
        echo json_encode(['error' => 'Action non reconnue']);
        break;
}