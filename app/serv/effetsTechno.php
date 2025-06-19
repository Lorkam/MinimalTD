<?php

function centre($action, &$technos, &$modificateurs){
    if($action == 'achat'){
        $technos['centre']['lvl1']['debloque'] = true;
    }elseif($action == 'vente'){
        $technos['centre']['lvl1']['debloque'] = false;
        $modificateurs = $modificateurs;
    }
    return;
}
function vitesseAttaque($action, &$technos, &$modificateurs){
    if($action == 'achat'){
        $technos['vitesseAttaque']['lvl1']['debloque'] = true;
        $modificateurs['toursClassiques']['vitesseAttaque'] = $technos['vitesseAttaque']['lvl1']['valeur']; // 10% de vitesse d'attaque
    }elseif($action == 'vente'){
        $technos['vitesseAttaque']['lvl1']['debloque'] = false;
        $modificateurs['toursClassiques']['vitesseAttaque'] = 1;
    }
    return;
}
function degats($action, &$technos, &$modificateurs) {
    if($action == 'achat') {
        $technos['degats']['lvl1']['debloque'] = true;
        $modificateurs['toursClassiques']['degats'] = $technos['degats']['lvl1']['valeur'];
    } elseif($action == 'vente') {
        $technos['degats']['lvl1']['debloque'] = false;
        $modificateurs['toursClassiques']['degats'] = 1;
    }
}
function goldsBonusDepart($action, &$technos, &$modificateurs){
    if($action == 'achat'){
        $technos['goldsBonusDepart']['lvl1']['debloque'] = true;
        $modificateurs['economie']['goldsBonusDepart'] = $technos['goldsBonusDepart']['lvl1']['valeur']; // 10% de vitesse d'attaque
    }elseif($action == 'vente'){
        $technos['goldsBonusDepart']['lvl1']['debloque'] = false;
        $modificateurs['economie']['goldsBonusDepart'] = 0;
    }
    return;
}
function lvlUpTours($action, &$technos, &$modificateurs){
    if($action == 'achat'){
        $technos['lvlUpTours']['lvl1']['debloque'] = true;
        $modificateurs['lvlUpTours'] = $technos['lvlUpTours']['lvl1']['valeur']; // 10% de vitesse d'attaque
    }elseif($action == 'vente'){
        $technos['lvlUpTours']['lvl1']['debloque'] = false;
        $modificateurs['toursClassiques']['critDamage'] = 0;
    }
    return;
}
function critRate($action, &$technos, &$modificateurs){
    if($action == 'achat'){
        $technos['critRate']['lvl1']['debloque'] = true;
        $modificateurs['toursClassiques']['critRate'] = $technos['critRate']['lvl1']['valeur']; // 10% de vitesse d'attaque
    }elseif($action == 'vente'){
        $technos['critRate']['lvl1']['debloque'] = false;
        $modificateurs['toursClassiques']['critRate'] = 0.1;
    }
    return;
}
function critDamage($action, &$technos, &$modificateurs){
    if($action == 'achat'){
        $technos['critDamage']['lvl1']['debloque'] = true;
        $modificateurs['toursClassiques']['critDamage'] = $technos['critDamage']['lvl1']['valeur']; // 10% de vitesse d'attaque
    }elseif($action == 'vente'){
        $technos['critDamage']['lvl1']['debloque'] = false;
        $modificateurs['toursClassiques']['critDamage'] = 1.2;
    }
    return;
}