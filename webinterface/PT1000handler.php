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
$output;
$setPT1000NameFlag = 0;
unset($PT1000Text);
unset($output);
unset($arr);
$setgetPT1000handler = $_POST["setgetPT1000handler"];
$setPT1000NameFlag = $_POST["setPT1000NameFlag"];
$get = "g";
$PTFlag = 1;


//get temperature from all channels
if (($setgetPT1000handler == $get) && ($flag)){

		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000handler_020 g 0", $output);
		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000handler_020 g 1", $output);
		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000handler_020 g 2", $output);
		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000handler_020 g 3", $output);

		transfer_javascript($output[0], $output[1], $output[2], $output[3], $loginstatus, $adminstatus);
}
else
{
	transfer_javascript('error', 'error', $loginstatus, $adminstatus);
}

if (($setPT1000NameFlag == $PTFlag) && ($adminstatus)){
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

function transfer_javascript($temperature11, $temperature12, $temperature13, $temperature14, $loginstatus, $adminstatus)	
{
	$arr = array( 'temperature11' => $temperature11,
				  'temperature12' => $temperature12,
				  'temperature13' => $temperature13,
				  'temperature14' => $temperature14,
				  'loginstatus' => $loginstatus,
				  'adminstatus' => $adminstatus
				);
	
	echo json_encode($arr);
}

?>
