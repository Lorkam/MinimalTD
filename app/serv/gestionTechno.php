<?php
session_start();
$listeTechno = json_decode(file_get_contents('technologies.json'), true);

echo json_encode($listeTechno);