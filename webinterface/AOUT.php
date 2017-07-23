<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('privateplc_php.ini.php');
session_start();
include_once ('authentification.inc.php');

unset($arr);

if (isset($_POST["setgetAnalogOUT"])){
	if (($_POST["setgetAnalogOUT"] == 'g') && $adminstatus)
	{
		for ($i=1; $i<5; $i++){
		$channel = $i;
		exec("flock /tmp/flockAINOUThandler /usr/lib/cgi-bin/AINOUThandler g O $channel", $output);
		}
		for ($i=0; $i<4; $i++){
			$arr[] = $output[$i];
		}
		echo json_encode($arr);
	}	
}

if (isset($_POST["setgetAnalogOUT"]) && isset($_POST["AOUTchannel"]) && isset($_POST["AOUTvalue"])){
	if (($_POST["setgetAnalogOUT"] == 's') && $adminstatus)
	{
		$AOUTvalue = $_POST["AOUTvalue"];
		$AOUTchannel = $_POST["AOUTchannel"];
		$extNum = $_POST["extNum"];
		exec("flock /tmp/flockAINOUThandler /usr/lib/cgi-bin/AINOUThandler s O $AOUTchannel $AOUTvalue $extNum");
	}
}


?>
