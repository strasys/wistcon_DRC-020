<?php
// Gibt an welche PHP-Fehler �berhaupt angezeigt werden
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
// Da man in einem Produktivsystem �blicherweise keine Fehler ausgeben
// will sondern sie nur mitloggen will, bietet es sich an dort die
// Ausgabe der Fehler zu deaktivieren und sie stattdessen in ein Log-File
// schreiben zu lassen
/*
ini_set('display_errors', 0);
ini_set('error_log', '/pfad/zur/logdatei/php_error.log');
*/

include_once ('/var/www/service_classes/pushButtonService.inc.php');

function writestatus($statusWord, $statusFile){
		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);	
}

//get status data
$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
$DNSService = $xml->OperationModeDevice[0]->DNSService;
$ComposerService = $xml->OperationModeDevice[0]->AutomaticHand;
$pushButtonSensingService = $xml->OperationModeDevice[0]->pushButtonSensing;
$PushDataCloudService = $xml->OperationModeDevice[0]->PushDataCloudService;

//Set status of DNSService
	$statusFile = fopen("/tmp/DNSservicestatus.txt", "w");
	if ($statusFile == false)
	{
		$errorMsg = "Error: fopen\"/tmp/DNSservicestatus.txt\", \"w\" ";
		break;
	}
	elseif ($statusFile)
	{
		exec("chown www-data:root /tmp/DNSservicestatus.txt");
		switch (($DNSService)){
			case 'stop':
				$statusWord = "stop";
				writestatus($statusWord, $statusFile);
				break;
			case 'run':
				$statusWord = "run";
				writestatus($statusWord, $statusFile);
				$cmd = "php /var/www/set/parameter/DNS_Service/DNSservicegetIP.php";
				exec($cmd . " > /dev/null &");
				break;
		}	
	}


//Set status of Composer
	unset($statusFile, $statusWord);
	$statusFile = fopen("/tmp/composerstatus.txt", "w");
	if ($statusFile == false)
	{
		$errorMsg = "Error: fopen\"/tmp/composerstatus.txt\", \"w\" ";
		break;
	}
	elseif ($statusFile)
	{
		exec("chown www-data:root /tmp/composerstatus.txt");
		switch (($ComposerService)){
			case 'stop':
				$statusWord = "stop";
				writestatus($statusWord, $statusFile);
				break;
			case 'run':
				$statusWord = "run";
				writestatus($statusWord, $statusFile);
				$cmd = "php /var/www/composer_prog/composer.php";
				exec($cmd . " > /dev/null &");
				break;
		}

	}
//Set status of Cloud Service
	unset($statusFile, $statusWord);
	$statusFile = fopen("/tmp/CloudPushservicestatus.txt", "w");
	if ($statusFile == false)
	{
		$errorMsg = "Error: fopen\"/tmp/CloudPushservicestatus.txt\", \"w\" ";
		break;
	}
	elseif ($statusFile)
	{
		exec("chown www-data:root /tmp/CloudPushservicestatus.txt");
		switch (($PushDataCloudService)){
			case 'stop':
				$statusWord = "stop";
				writestatus($statusWord, $statusFile);
				break;
			case 'run':
				$statusWord = "run";
				writestatus($statusWord, $statusFile);
				$cmd = "php /var/www/set/data_cloud/PushCloudDataTransferService.php";
				exec($cmd . " > /dev/null &");
				break;
		}

	}

//Set status for pushButtonSensing Function
	unset($statusFile, $statusWord);
	$statusFile = fopen("/tmp/pushButtonSensingRunStop.txt", "w");
	if ($statusFile == false)
	{
		$errorMsg = "Error: fopen\"/tmp/pushButtonSensingRunStop.txt\", \"w\" ";
		break;
	}
	elseif ($statusFile)
	{
		exec("chown www-data:root /tmp/pushButtonSensingRunStop.txt");
		switch (($pushButtonSensingService))
		{
			case 'stop':
				$statusWord = "stop";
				writestatus($statusWord, $statusFile);
				break;
			case 'run':
				$statusWord = "run";
				writestatus($statusWord, $statusFile);
				$sensingClass = new pushButtonSensingService();
				$arrforSensingSet = $sensingClass->getInputSetforSensing();
				echo print_r($sensingClass->getInputToggleStatus());
			//	echo print_r($arrforSensingSet);
				$speed = 100;
				$sensingClass->setInputforSensing($arrforSensingSet,$speed);
		}
	}

?>
