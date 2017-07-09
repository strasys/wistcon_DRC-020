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
unset($i);
$setgetAnalog = $_POST["setgetAnalog"];
$inout = $_POST["InOut"];
$AOUTvalue = $_POST["AOUTvalue"]; //0 - 1023
$AOUTchannel = $_POST["AOUTchannel"];//1 or 2
$get = "g";
$set = "s";
$IN = "I";
$Out = "O";

//get Analog IN values
if ($flag)
{
	if (($setgetAnalog == $get) && $loginstatus)
	{
		if (($inout == $IN) && $loginstatus)
		{
			for ($i=0; $i<4; $i++){
			//we are looking at AIN channels 2 and 3 
			$channel = $i;
			exec(" /usr/lib/cgi-bin/AINOUThandler g I $channel", $output);
			}
			$arr = array(	'INvalue1' => $output[0],
					'INvalue2' => $output[1],
					'INvalue3' => $output[2],
					'INvalue4' => $output[3],
					'loginstatus' => $loginstatus,
					'adminstatus' => $adminstatus
						);
		}
		elseif (($inout == $Out) && $loginstatus)
		{
			for ($i=1; $i<3; $i++){
				$channel = $i;
				exec(" /usr/lib/cgi-bin/AINOUThandler g O $channel", $output);
			}
			$arr = array('OUTvalue1' => $output[0],
						 'OUTvalue2' => $output[1],
						'loginstatus' => $loginstatus,
						'adminstatus' => $adminstatus
						);
		}	
	}
	elseif (($setgetAnalog == $set) && $loginstatus)
	{
		if ($inout == $Out){
		exec("flock /tmp/AINOUThandler /usr/lib/cgi-bin/AINOUThandler s O $AOUTchannel $AOUTvalue");
		}
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
