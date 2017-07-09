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
unset($SetFilterMode,$setCleanTime);
unset($arr);
$getLogData = $_POST["getLogData"];
$setCleanTime = $_POST["setCleanTime"]; 
$setFilterMode = $_POST["setFilterMode"];	
$get = "g";
$set = "s";

//get Log status
if ($getLogData == $get){
	transfer_javascript($loginstatus, $adminstatus);
}

if (($_POST["setFilterMode"] == $set) && ($adminstatus)){
	$xml=simplexml_load_file("VDF.xml") or die("Error: Cannot create object");
	$xml->CleaningSetting[0]->OperationMode = $_POST["FilterMode"];
	echo $xml->asXML("VDF.xml");
}


if (($setCleanTime == $set) && ($adminstatus)){
	$xml=simplexml_load_file("VDF.xml") or die("Error: Cannot create object");
	$i = intval($_POST["CleanInterval"]);
	$xml->CleaningInterval[$i]->Start = $_POST["StartTime"];
	$xml->CleaningInterval[$i]->Stop = $_POST["StopTime"];
	$xml->CleaningInterval[$i]->Periode = $_POST["CleanIntervalPeriode"];
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
