<?php


function centre($action, &$technosSave, $lvl, &$modificateursSave, $listeTechno){
    $lvl = (int)$lvl;
    if($action == 'achat'){
        $technosSave['centre'] = $lvl;
    }elseif($action == 'vente'){
        $technosSave['centre'] = $lvl;
        $modificateursSave = $modificateursSave;
    }
    return;
}
function vitesseAttaque($action, &$technosSave, $lvl, &$modificateursSave, $listeTechno){
    $lvl = (int)$lvl;
    if($action == 'achat'){
        $technosSave['vitesseAttaque'] = $lvl;
    }elseif($action == 'vente'){
        $technosSave['vitesseAttaque'] = $lvl;
    }
    $modificateursSave['tours']['vitesseAttaque'] = $listeTechno['vitesseAttaque']['detailLvl'][$lvl];
    return;
}
function degats($action, &$technosSave, $lvl, &$modificateursSave, $listeTechno) {
    $lvl = (int)$lvl;
    if($action == 'achat') {
        $technosSave['degats'] = $lvl;
    } elseif($action == 'vente') {
        $technosSave['degats'] = $lvl;
    }
    $modificateursSave['tours']['degats'] = $listeTechno['degats']['detailLvl'][$lvl];
    return;
}
function goldsBonusDepart($action, &$technosSave, $lvl, &$modificateursSave, $listeTechno){
    $lvl = (int)$lvl;
    if($action == 'achat'){
        $technosSave['goldsBonusDepart'] = $lvl;
    }elseif($action == 'vente'){
        $technosSave['goldsBonusDepart'] = $lvl;
    }
    $modificateursSave['economie']['goldsBonusDepart'] = $listeTechno['goldsBonusDepart']['detailLvl'][$lvl];;
    return;
}
function goldsBonusParEnnemis($action, &$technosSave, $lvl, &$modificateursSave, $listeTechno){
    $lvl = (int)$lvl;
    if($action == 'achat'){
        $technosSave['goldsBonusParEnnemis'] = $lvl;
    }elseif($action == 'vente'){
        $technosSave['goldsBonusParEnnemis'] = $lvl;
    }
    $modificateursSave['economie']['goldsBonusParEnnemis'] = $listeTechno['goldsBonusParEnnemis']['detailLvl'][$lvl];;
    return;
}
function lvlUpTours($action, &$technosSave, $lvl, &$modificateursSave, $listeTechno){
    $lvl = (int)$lvl;
    if($action == 'achat'){
        $technosSave['lvlUpTours'] = $lvl;
    }elseif($action == 'vente'){
        $technosSave['lvlUpTours'] = $lvl;
    }
    $modificateursSave['lvlUpTours'] = $listeTechno['lvlUpTours']['detailLvl'][$lvl];
    return;
}
function critRate($action, &$technosSave, $lvl, &$modificateursSave, $listeTechno){
    $lvl = (int)$lvl;
    if($action == 'achat'){
        $technosSave['critRate'] = $lvl;
    }elseif($action == 'vente'){
        $technosSave['critRate'] = $lvl;
    }
    $modificateursSave['tours']['critRate'] = $listeTechno['critRate']['detailLvl'][$lvl];
    return;
}
function critDamage($action, &$technosSave, $lvl, &$modificateursSave, $listeTechno){
    $lvl = (int)$lvl;
    if($action == 'achat'){
        $technosSave['critDamage'] = $lvl;
    }elseif($action == 'vente'){
        $technosSave['critDamage'] = $lvl;
    }
    $modificateursSave['tours']['critDamage'] = $listeTechno['critDamage']['detailLvl'][$lvl];
    return;
}