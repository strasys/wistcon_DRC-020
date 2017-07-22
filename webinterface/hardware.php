<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

include_once ('privateplc_php.ini.php');
session_start();
include_once ('authentification.inc.php');
include_once "EEPROM.inc.php";

$extensionAllocation = new EEPROM();

$extensions = $extensionAllocation->getExtensionAllocation();


echo json_encode($extensions);

?>
