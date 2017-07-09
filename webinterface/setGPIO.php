<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//
include_once ('privateplc_php.ini.php');
session_start();
include_once ('authentification.inc.php');

$ausgabe;
$arr;
$ButtonFlag = 0;
$InputFlag = 0;
unset($ausgabe);
unset($arr);
unset($ButtonText);
unset($InputText);
$setgetGPIO = $_POST["setgetGPIO"];
$InOut = $_POST["InOut"];
$GPIOnum = $_POST["GPIOnum"];
$GPIOvalue = $_POST["GPIOvalue"];
$ButtonFlag = $_POST["ButtonFlag"];
$InputFlag = $_POST["InputFlag"];
$g = "g";
$s = "s";
$I = "i";
$O = "o";
$Bf = 1;
$If = 1;

if ($flag)
{

	$ButtonText = array( 0 => $_POST["ButtonText0"],
						 1 => $_POST["ButtonText1"],
						 2 => $_POST["ButtonText2"],
						 3 => $_POST["ButtonText3"],
						 4 => $_POST["ButtonText4"],
						 5 => $_POST["ButtonText5"],
						 6 => $_POST["ButtonText6"],
						 7 => $_POST["ButtonText7"]
	);

	$InputText = array( 0 => $_POST["InputText0"],
						1 => $_POST["InputText1"],
						2 => $_POST["InputText2"],
						3 => $_POST["InputText3"]
	);

	if (($setgetGPIO == $g) && $loginstatus){
		if ($InOut == $O){
			exec(" /usr/lib/cgi-bin/GPIOhandler_020 g O", $ausgabe);
			
			$arr = array(	'OUT1' => $ausgabe[0],
							'OUT2' => $ausgabe[1],
							'OUT3' => $ausgabe[2],
							'OUT4' => $ausgabe[3],
							'OUT5' => $ausgabe[4],
							'OUT6' => $ausgabe[5],
							'OUT7' => $ausgabe[6],
							'OUT8' => $ausgabe[7],
					'loginstatus' => $loginstatus,
					'adminstatus' => $adminstatus
						);
			}
		elseif ($InOut == $I){
			exec(" /usr/lib/cgi-bin/GPIOhandler_020 g I", $ausgabe);
			
			$arr = array(	'IN1' => $ausgabe[0],
							'IN2' => $ausgabe[1],
							'IN3' => $ausgabe[2],
							'IN4' => $ausgabe[3],
					'loginstatus' => $loginstatus,
					'adminstatus' => $adminstatus
						);
			}
		}
	elseif (($setgetGPIO == $s) && $loginstatus){
			exec(" /usr/lib/cgi-bin/GPIOhandler_020 s $GPIOnum $GPIOvalue", $ausgabe);
			}
		
	if (($ButtonFlag == $Bf) && $adminstatus){
		$xml=simplexml_load_file("VDF.xml") or die("Error: Cannot create object");
		for ($i=0; $i<8; $i++){
		$xml->GPIOOUT[$i]->OutputName = $ButtonText[$i];
		}
		echo $xml->asXML("VDF.xml");
	}
	
	elseif (($InputFlag == $If) && $adminstatus){
		$xml=simplexml_load_file("VDF.xml") or die("Error: Cannot create object");
		for ($i=0; $i<4; $i++){
		$xml->GPIOIN[$i]->InputName = $InputText[$i];
		}
		echo $xml->asXML("VDF.xml");
	}
}
else
{
	$arr = array(	'loginstatus' => $loginstatus,
					'adminstatus' => $adminstatus
				);
}

echo json_encode($arr);

?>
