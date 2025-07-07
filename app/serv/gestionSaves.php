<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
$action = $_POST['action'];
$nom = $_POST['nom']??'test'; // Nom de la sauvegarde, par défaut 'test'
$saves = json_decode(file_get_contents('saves.json'), true);

switch ($action){
    case 'lireSaves':
        echo json_encode($saves);
        break;
    case 'selectionnerSauvegarde':
        $_SESSION['nomSauvegarde'] = $nom;
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
    case 'ameliorerTechno':
        ameliorerTechno($saves, $nom);
        break;
    case 'vendreAmeliorationTechno':
        vendreAmeliorationTechno($saves, $nom);
        break;
    default:
        echo 'action non reconnue';
        break;
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
 * - modificateurs : Modificateurs de jeu (tours, economie, coeurBonus, lvlUpTours) avec leurs valeurs par défaut.
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
            "tours"=> [
                "degats"=> 1,
                "vitesseAttaque"=> 1,
                "prix"=> 1,
                "critRate"=> 0.1,
                "critDamage"=> 1.2,
                "portee"=> 1
            ],
            "economie"=> [
                "goldsBonusDepart"=> 0,
                "goldsBonusParEnnemis"=> 0
            ],
            "coeurBonus"=> 0,
            "lvlUpTours"=> 0,
            "toursClassiques"=> [
                "vitesseAttaque"=> 1,
                "degats"=> 1.2
            ]
        ],
        "technologies"=> [
            "centre"=> [
                "lvl0"=> [
                    "valeur"=> 1
                ],
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1
                ]
            ],
            "degats"=> [
                "lvl0"=> [
                    "valeur"=> 1
                ],
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
                "lvl0"=> [
                    "valeur"=> 1
                ],
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
                "lvl0"=> [
                    "valeur"=> 1
                ],
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
                "lvl0"=> [
                    "valeur"=> 0.1
                ],
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
                "lvl0"=> [
                    "valeur"=> 1.2
                ],
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
                "lvl0"=> [
                    "valeur"=> 1
                ],
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
                "lvl0"=> [
                    "valeur"=> 0
                ],
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
                "lvl0"=> [
                    "valeur"=> 0
                ],
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
                "lvl0"=> [
                    "valeur"=> 0
                ],
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
                "lvl0"=> [
                    "valeur"=> 0
                ],
                "lvl1"=> [
                    "debloque"=> false,
                    "valeur"=> 1
                ],
                "lvl2"=> [
                    "debloque"=> false,
                    "valeur"=> 2
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

/**
 * Améliore une technologie pour un utilisateur donné en mettant à jour son niveau et en débloquant le niveau cible.
 *
 * Cette fonction modifie le tableau des sauvegardes en :
 * - Déduisant le montant de la monnaie spécifiée de l'utilisateur.
 * - Débloquant le niveau cible de la technologie spécifiée.
 * - Enregistrant les modifications dans le fichier 'saves.json'.
 *
 * @param array  $saves Référence au tableau contenant toutes les sauvegardes des utilisateurs.
 * @param string $nom   Nom de l'utilisateur dont la technologie doit être améliorée.
 *
 * Les données suivantes doivent être présentes dans $_POST :
 * - 'nomTechno'   : string, nom de la technologie à améliorer.
 * - 'typeMonnaie' : string, type de monnaie à utiliser pour l'amélioration.
 * - 'montant'     : int, montant de monnaie à déduire.
 * - 'direction'   : string, 'up' pour augmenter le niveau, autre pour diminuer.
 * - 'lvl'         : int, niveau actuel de la technologie.
 */
function ameliorerTechno(&$saves, $nom){
    $nomTechno = $_POST['nomTechno'];
    $typeMonnaie = $_POST['typeMonnaie'];
    $montant = $_POST['montant'];
    $direction = $_POST['direction'];
    $nivCible = $_POST['lvl'];

    $technos = $saves['saves'][$nom]['technologies'];
    $modificateurs = $saves['saves'][$nom]['modificateurs'];
    require_once 'effetsTechno.php';

    if($direction == 'up'){
        if($saves['saves'][$nom]['monnaies'][$typeMonnaie]< $montant){
            echo json_encode(['resultat' => 'echec', 'message' => 'Pas assez de monnaie']);
            return;
        }
        $saves['saves'][$nom]['monnaies'][$typeMonnaie] -= $montant;

        $nomTechno('achat', $technos, $nivCible, $modificateurs); // Appel de la fonction correspondante à la techno améliorée pour modifier les bons modificateurs
        echo json_encode(['resultat' => 'succes', 'message' => 'Technologie améliorée avec succès']);
    }else{
        $saves['saves'][$nom]['monnaies'][$typeMonnaie] += $montant;

        $nomTechno('vente', $technos, $nivCible, $modificateurs); // Appel de la fonction correspondante à la techno améliorée pour modifier les bons modificateurs
        echo json_encode(['resultat' => 'succes', 'message' => 'Technologie vendue avec succès']);
    }
    $saves['saves'][$nom]['technologies'] = $technos;
    $saves['saves'][$nom]['modificateurs'] = $modificateurs;
    file_put_contents('saves.json', json_encode($saves, JSON_PRETTY_PRINT));
}