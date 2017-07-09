<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('privateplc_php.ini.php');
session_start();
include_once ('authentification.inc.php');
$arr;
unset($arr);
$getLogData = $_POST["getLogData"];
$setCleanTime = $_POST["setCleanTime"];
$setSolarTemp = $_POST["setSolarTemp"];
$get = "g";
$set = "s";

//get Log status
if ($getLogData == $get){
	transfer_javascript($loginstatus, $adminstatus);
}



if (($setCleanTime == $set) && ($adminstatus)){
		$PT1000Text = array(
			0 => $_POST["PT1000Text0"],
			1 => $_POST["PT1000Text1"],
			2 => $_POST["PT1000Text2"],
			3 => $_POST["PT1000Text3"]
		);

	$xml=simplexml_load_file("VDF.xml") or die("Error: Cannot create object");
	for ($i=0; $i<4; $i++){
		$xml->PT1000[$i]->PT1000Name = $PT1000Text[$i];
	}
	echo $xml->asXML("VDF.xml");
}

function transfer_javascript($loginstatus, $adminstatus)	
{
	$arr = array(
			'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus
			);
	
	echo json_encode($arr);
}

?>
