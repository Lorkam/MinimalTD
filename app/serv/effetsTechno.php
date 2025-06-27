<?php

function centre($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['centre'][$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $technos['centre'][$lvl]['debloque'] = false;
        $modificateurs = $modificateurs;
    }
    return;
}
function vitesseAttaque($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['vitesseAttaque'][$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $technos['vitesseAttaque'][$lvl]['debloque'] = false;
    }
    $modificateurs['toursClassiques']['vitesseAttaque'] = ($lvl=='lvl1'&&$action=='vente') ? 1 : $technos['vitesseAttaque'][$lvl]['valeur']; // 10% de vitesse d'attaque
    return;
}
function degats($action, &$technos, $lvl, &$modificateurs) {
    if($action == 'achat') {
        $technos['degats'][$lvl]['debloque'] = true;
    } elseif($action == 'vente') {
        $technos['degats'][$lvl]['debloque'] = false;
    }
    $modificateurs['toursClassiques']['degats'] = $lvl=='lvl0' ? 1 : $technos['degats'][$lvl]['valeur'];
    return;
}
function goldsBonusDepart($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['goldsBonusDepart'][$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $technos['goldsBonusDepart'][$lvl]['debloque'] = false;
    }
    $modificateurs['economie']['goldsBonusDepart'] = $lvl=='lvl0' ? 0 : $technos['goldsBonusDepart'][$lvl]['valeur'];
    return;
}
function goldsBonusParEnnemis($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['goldsBonusParEnnemis'][$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $technos['goldsBonusParEnnemis'][$lvl]['debloque'] = false;
    }
    $modificateurs['economie']['goldsBonusParEnnemis'] = $lvl=='lvl0' ? 0 : $technos['goldsBonusParEnnemis'][$lvl]['valeur'];
    return;
}
function lvlUpTours($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['lvlUpTours'][$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $technos['lvlUpTours'][$lvl]['debloque'] = false;
    }
    $modificateurs['lvlUpTours'] = $action=='vente' ? 0 : $technos['lvlUpTours'][$lvl]['valeur'];
    return;
}
function critRate($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['critRate'][$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $technos['critRate'][$lvl]['debloque'] = false;
    }
    $modificateurs['toursClassiques']['critRate'] = $lvl=='lvl0' ? 0.1 : $technos['critRate'][$lvl]['valeur'];
    return;
}
function critDamage($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['critDamage'][$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $technos['critDamage'][$lvl]['debloque'] = false;
    }
    $modificateurs['toursClassiques']['critDamage'] = $lvl=='lvl0' ? 1.2 : $technos['critDamage'][$lvl]['valeur'];
    return;
}