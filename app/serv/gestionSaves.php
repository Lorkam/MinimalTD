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
    if(@$saves['saves'][$nom]==null) creerSauvegarde($saves, $nom);
    $niveauxCompletes = $saves['saves'][$nom]['niveauxCompletes'];
    $niveauMax = 0;
    foreach ($niveauxCompletes as $niveau => $reussi) {
        if ($reussi) {
            $niveauMax++;
        }
    }
    echo json_encode($niveauMax);

}

function creerSauvegarde(&$saves, $nom){
    $date = new DateTime();
    $date = $date->format('Y-m-d');
    $saves['saves'][$nom] = [
        "description"=> "sauvegarde vide",
        "monnaies"=> [
            "triangles"=> 0,
            "ronds"=> 0,
            "hexagones"=> 0
        ],
        "niveauxCompletes"=> [
            "Niveau 1"=> false,
            "Niveau 2"=> false,
            "Niveau 3"=> false
        ],
        "dateCreation"=> $date,
        "dateDerniereSave"=> $date,
        "modificateurs"=> [
            "toursClassiques"=> [
                "degats"=> 1,
                "vitesseAttaque"=> 1,
                "prix"=> 1,
                "critRate"=> 0.1,
                "critDamage"=> 1.2,
                "portee"=> 1
            ],
            "economie"=> [
                "goldBonusDepart"=> 0,
                "goldBonusParEnnemis"=> 0
            ],
            "coeurBonus"=> 0,
            "lvlUpTours"=> 1
        ],
        "technologies"=> [
            "centre"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1
                ]
            ],
            "degats"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1.2
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 1.4
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 1.6
                ]
            ],
            "vitesseAttaque"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1.2
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 1.4
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 1.6
                ]
            ],
            "portee"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1.2
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 1.4
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 1.6
                ]
            ],
            "critRate"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 0.2
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 0.3
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 0.4
                ],
                "lvl4"=> [
                    "debloque"=> false,
                    "valeur"=> 0.5
                ]
            ],
            "critDamage"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1.4
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 1.6
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 1.8
                ]
            ],
            "prix"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 0.9
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 0.8
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 0.7
                ]
            ],
            "coeurBonus"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 2
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 3
                ]
            ],
            "goldsBonusDepart"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 2
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 5
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 8
                ]
            ],
            "goldsBonusParEnnemis"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 2
                ],
                "lvl3"=> [
                    "debloque"=> false,
                    "valeur"=> 3
                ]
            ],
            "lvlUpTours"=> [
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1
                ]
            ]
        ]
    ];
    file_put_contents('saves.json', json_encode($saves, JSON_PRETTY_PRINT));
}