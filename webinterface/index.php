<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');
include_once ('/var/www/hw_classes/PT1000.inc.php');
include_once ('/var/www/hw_classes/GPIO.inc.php');

unset($getLoginStatus, $getData);
$getLoginStatus = $_POST['getLoginStatus'];
$getData = $_POST['getData'];
$setOutNumber = $_POST['setOutNumber'];
$setOutValue = $_POST['setOutValue'];
//$getLoginStatus = "g";
unset($arr);
$get = "g";
$set = "s";

if (($loginstatus == true) && ($getData == $get)){
	$PT1000ex1 = new PT1000();
	$GPIO = new GPIO();

	$temperature[] = $PT1000ex1->getPT1000(0,1);
	$temperature[] = $PT1000ex1->getPT1000(1,1);

//get Composer status
	$statusFile = fopen("/tmp/composerstatus.txt", "r");
	if ($statusFile == false)
	{
		$statusFile = fopen("/tmp/composerstatus.txt", "w");
		fwrite($statusFile, "stop");
		fclose($statusFile);
		$statusWord = "stop";
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
		fclose($status);
	}
	
	switch ($statusWord){
		case "stop":
			$runstop = 0;
			break;
		case "run":
			$runstop = 1; 
			break;
	}

//get GPIO out status
	$gpioOUT = $GPIO->getOut();
//get GPIO in status
	$gpioIN = $GPIO->getIn();

	transfer_javascript($loginstatus, $adminstatus, $temperature[0], $temperature[1], $runstop, $gpioOUT[0], $gpioOUT[1], $gpioOUT[2], $gpioOUT[3], $gpioOUT[4], $gpioIN[0], $gpioIN[1], $gpioIN[2]);

}

if (($loginstatus == false) && ($getData == $get)){
	$PT1000ex1 = new PT1000();
	$GPIO = new GPIO();

	$temperature[] = $PT1000ex1->getPT1000(0,1);
	$temperature[] = $PT1000ex1->getPT1000(1,1);

//get GPIO out status
	unset($gpioOUT);
	$gpioOUT = $GPIO->getOut();

	transfer_javascript($loginstatus, $adminstatus, $temperature[0], $temperature[1],'null','null','null', $gpioOUT[2], $gpioOUT[3],'null','null','null','null');
}
//from all accessible Buttons => Light for Pool, etc.
if (($getData == $set) && ($setOutNumber == 2 || $setOutNumber == 3)){
	$GPIO = new GPIO();
	unset($gpioOUT);
	$gpioOUT = $GPIO->setOutsingle($setOutNumber,$setOutValue);
}

function transfer_javascript($loginstatus, $adminstatus, $temperature0, $temperature1, $runstop, $gpioOUT0, $gpioOUT1, $gpioOUT2, $gpioOUT3, $gpioOUT4, $gpioIN0, $gpioIN1, $gpioIN2)
{
	$arr = array(	'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus,
			'pooltemp' => $temperature0,
			'outsidetemp' => $temperature1,
			'OperationMode' => $runstop,
			'statusMixer' => $gpioOUT0,
			'statusPump' => $gpioOUT1,
			'statusPoolLight' => $gpioOUT2,
			'statusOutLight' => $gpioOUT3,
			'statusFreshwaterValve' => $gpioOUT4,
			'statusNiveauSensor' => $gpioIN0,
			'statusMixerSolar' => $gpioIN1,
			'statusMixerBypass' => $gpioIN2
				);

	echo json_encode($arr);
}


?>
