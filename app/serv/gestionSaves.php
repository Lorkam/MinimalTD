<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
$action = $_POST['action']??'enregisterActionTechno';
$nom = $_POST['nom']??'test'; // Nom de la sauvegarde, par défaut 'test'
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
    case 'supprimerSauvegarde':
        supprimerSauvegarde($saves, $nom);
        break;
    case 'creerSauvegarde':
        creerSauvegarde($saves, $nom);
        break;
    default:
        echo 'action non reconnue';
        break;
}

/**
 * Enregistre une action liée à une technologie (achat ou vente) pour une sauvegarde donnée.
 *
 * Cette fonction met à jour le montant de la monnaie du joueur en fonction de l'action
 * (achat ou vente) et applique les effets de la technologie correspondante en appelant
 * une fonction dynamique définie dans 'effetsTechno.php'. Elle met également à jour
 * les technologies et modificateurs associés à la sauvegarde, puis enregistre les
 * modifications dans le fichier JSON des sauvegardes.
 *
 * @param array  &$saves Tableau de toutes les sauvegardes (passé par référence).
 * @param string $nom    Nom de la sauvegarde à modifier.
 *
 * Données attendues dans $_POST :
 * - 'typeMonnaie' : Type de monnaie à modifier.
 * - 'montant' : Montant à ajouter ou retirer.
 * - 'nomTechno' : Nom de la technologie concernée.
 * - 'actionTechno' : Action à effectuer ('achat' ou 'vente').
 *
 * Effets de bord :
 * - Met à jour le fichier 'saves.json' avec les nouvelles données.
 * - Affiche le nouveau montant de la monnaie modifiée au format JSON.
 */
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

/**
 * Sauvegarde les données de progression d'un joueur dans le tableau des sauvegardes et met à jour le fichier JSON.
 *
 * @param array  $saves Référence au tableau contenant toutes les sauvegardes.
 * @param string $nom   Nom de la sauvegarde à mettre à jour.
 *
 * Cette fonction effectue les opérations suivantes :
 * - Met à jour l'état de complétion du niveau courant si celui-ci n'a pas encore été complété.
 * - Ajoute les monnaies (triangles, ronds, hexagones) obtenues lors du niveau aux monnaies existantes.
 * - Enregistre les modifications dans le fichier 'saves.json' au format JSON.
 *
 * Les données du niveau et des monnaies sont récupérées depuis la superglobale $_POST.
 */
function sauvegarder(&$saves, $nom){
    if($saves['saves'][$nom]['niveauxCompletes'][$_POST['niveau']]==false) $saves['saves'][$nom]['niveauxCompletes'][$_POST['niveau']] = $_POST['reussiteNiveau']=='true' ? true : false;
    $monnaies = json_decode($_POST['monnaies'], true);
    $saves['saves'][$nom]['monnaies']['triangles'] += $monnaies['triangles'];
    $saves['saves'][$nom]['monnaies']['ronds'] += $monnaies['ronds'];
    $saves['saves'][$nom]['monnaies']['hexagones'] += $monnaies['hexagones'];

    // Remplacement dans le fichier JSON
    file_put_contents('saves.json', json_encode($saves, JSON_PRETTY_PRINT));
}

/**
 * Retourne le nombre maximal de niveaux réussis par un utilisateur et l'affiche au format JSON.
 *
 * Si la sauvegarde de l'utilisateur n'existe pas, elle est créée.
 * Parcourt le tableau 'niveauxCompletes' pour l'utilisateur donné et compte le nombre de niveaux marqués comme réussis.
 *
 * @param array $saves Référence au tableau des sauvegardes contenant toutes les sauvegardes utilisateurs.
 * @param string $nom Le nom de l'utilisateur dont on veut déterminer le niveau maximal réussi.
 *
 * @return void Affiche le nombre maximal de niveaux réussis au format JSON.
 */
function getNiveauMaxReussi(&$saves, $nom){
    if(@$saves['saves'][$nom]==null) {echo json_encode(0); return;}
    $niveauxCompletes = $saves['saves'][$nom]['niveauxCompletes'];
    $niveauMax = 0;
    foreach ($niveauxCompletes as $niveau => $reussi) {
        if ($reussi) {
            $niveauMax++;
        }
    }
    echo json_encode($niveauMax);

}

/**
 * Crée une nouvelle sauvegarde de jeu avec des valeurs par défaut et l'ajoute au tableau des sauvegardes.
 *
 * @param array &$saves Référence au tableau contenant toutes les sauvegardes existantes. La nouvelle sauvegarde sera ajoutée à ce tableau sous la clé 'saves' avec le nom donné.
 * @param string $nom Le nom de la nouvelle sauvegarde à créer.
 *
 * La sauvegarde créée contient les informations suivantes :
 * - description : Description de la sauvegarde (par défaut "sauvegarde vide").
 * - monnaies : Tableau des monnaies du jeu (triangles, ronds, hexagones), initialisées à 0.
 * - niveauxCompletes : Statut de complétion des niveaux (Niveau 1, 2, 3), initialisés à false.
 * - dateCreation : Date de création de la sauvegarde (format 'Y-m-d').
 * - dateDerniereSave : Date de la dernière sauvegarde (format 'Y-m-d').
 * - modificateurs : Modificateurs de jeu (toursClassiques, economie, coeurBonus, lvlUpTours) avec leurs valeurs par défaut.
 * - technologies : Tableau des technologies et leurs niveaux, chaque niveau ayant un statut de déblocage (debloque) et une valeur associée.
 *
 * La fonction sauvegarde le tableau complet des sauvegardes dans le fichier 'saves.json' au format JSON.
 */
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

/**
 * Supprime une sauvegarde spécifique du tableau des sauvegardes et met à jour le fichier 'saves.json'.
 *
 * @param array  $saves Référence au tableau contenant toutes les sauvegardes.
 * @param string $nom   Le nom de la sauvegarde à supprimer.
 *
 * @return void
 */
function supprimerSauvegarde(&$saves, $nom){
    unset($saves['saves'][$nom]);
    if(isset($_SESSION['nomSauvegarde']) && $_SESSION['nomSauvegarde'] == $nom) unset($_SESSION['nomSauvegarde']);
    file_put_contents('saves.json', json_encode($saves, JSON_PRETTY_PRINT));
}