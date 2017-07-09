<?php
// Gibt an welche PHP-Fehler �berhaupt angezeigt werden
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
// Da man in einem Produktivsystem �blicherweise keine Fehler ausgeben
// will sondern sie nur mitloggen will, bietet es sich an dort die
// Ausgabe der Fehler zu deaktivieren und sie stattdessen in ein Log-File
// schreiben zu lassen
/*
ini_set('display_errors', 0);
ini_set('error_log', '/pfad/zur/logdatei/php_error.log');
*/


//get status data
$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
$DNSService = $xml->OperationModeDevice[0]->DNSService;
$ComposerService = $xml->OperationModeDevice[0]->AutomaticHand;

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
				break;
			case 'run':
				$statusWord = "run";
				$cmd = "php /var/www/DNSservicegetIP.php";
				exec($cmd . " > /dev/null &");
				break;
		}
		
		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);		
	}

//Set status of Composer
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
				break;
			case 'run':
				$statusWord = "run";
				$cmd = "php /var/www/composer.php";
				exec($cmd . " > /dev/null &");
				break;
		}

		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);
	}

?>
