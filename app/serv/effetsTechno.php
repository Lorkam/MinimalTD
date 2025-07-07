<?php

function centre($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['centre']['lvl'.$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $lvlActu = $lvl+1;
        $technos['centre']['lvl'.$lvlActu]['debloque'] = false;
        $modificateurs = $modificateurs;
    }
    return;
}
function vitesseAttaque($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['vitesseAttaque']['lvl'.$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $lvlActu = $lvl+1;
        $technos['vitesseAttaque']['lvl'.$lvlActu]['debloque'] = false;
    }
    $modificateurs['tours']['vitesseAttaque'] = $technos['vitesseAttaque']['lvl'.$lvl]['valeur'];
    return;
}
function degats($action, &$technos, $lvl, &$modificateurs) {
    if($action == 'achat') {
        $technos['degats']['lvl'.$lvl]['debloque'] = true;
    } elseif($action == 'vente') {
        $lvlActu = $lvl+1;
        $technos['degats']['lvl'.$lvlActu]['debloque'] = false;
    }
    $modificateurs['tours']['degats'] = $technos['degats']['lvl'.$lvl]['valeur'];
    return;
}
function goldsBonusDepart($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['goldsBonusDepart']['lvl'.$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $lvlActu = $lvl+1;
        $technos['goldsBonusDepart']['lvl'.$lvlActu]['debloque'] = false;
    }
    $modificateurs['economie']['goldsBonusDepart'] = $technos['goldsBonusDepart']['lvl'.$lvl]['valeur'];
    return;
}
function goldsBonusParEnnemis($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['goldsBonusParEnnemis']['lvl'.$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $lvlActu = $lvl+1;
        $technos['goldsBonusParEnnemis']['lvl'.$lvlActu]['debloque'] = false;
    }
    $modificateurs['economie']['goldsBonusParEnnemis'] = $technos['goldsBonusParEnnemis']['lvl'.$lvl]['valeur'];
    return;
}
function lvlUpTours($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['lvlUpTours']['lvl'.$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $lvlActu = $lvl+1;
        $technos['lvlUpTours']['lvl'.$lvlActu]['debloque'] = false;
    }
    $modificateurs['lvlUpTours'] = $technos['lvlUpTours']['lvl'.$lvl]['valeur'];
    return;
}
function critRate($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['critRate']['lvl'.$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $lvlActu = $lvl+1;
        $technos['critRate']['lvl'.$lvlActu]['debloque'] = false;
    }
    $modificateurs['tours']['critRate'] = $technos['critRate']['lvl'.$lvl]['valeur'];
    return;
}
function critDamage($action, &$technos, $lvl, &$modificateurs){
    if($action == 'achat'){
        $technos['critDamage']['lvl'.$lvl]['debloque'] = true;
    }elseif($action == 'vente'){
        $lvlActu = $lvl+1;
        $technos['critDamage']['lvl'.$lvlActu]['debloque'] = false;
    }
    $modificateurs['tours']['critDamage'] = $technos['critDamage']['lvl'.$lvl]['valeur'];
    return;
}