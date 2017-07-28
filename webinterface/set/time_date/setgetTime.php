<?php
//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

include_once ('/var/www/privateplc_php.ini.php');
session_start();
include_once ('/var/www/authentification.inc.php');

	$td;
	$ausgabe;
	$arr;
	unset($td);
	unset($ausgabe);
	unset($arr);
	$td = 0;
	$td = $_POST["td"];
	$hh = $_POST["hh"];
	$mm = $_POST["mm"];
	$ss = $_POST["ss"];
	$Day = $_POST["Day"];
	$Month = $_POST["Month"];
	$Year = $_POST["Year"];
	$t = "t";
	$d = "d";

if($flag)
{
	if ($td == $t){
		exec("flock /tmp/flockRTChandler020 /usr/lib/cgi-bin/RTChandler020 s t $hh $mm $ss", $ausgabe);
		}
	elseif ($td == $d){
		exec("flock /tmp/flockRTChandler020 /usr/lib/cgi-bin/RTChandler020 s d $Day $Month $Year", $ausgabe);
		}
	elseif ($td == 0) {
	//chdir('/usr/lib/cgi-bin');
	exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);	
	}
	
	$arr = array(	'Day' => $ausgabe[0],
			'Month' => $ausgabe[1],
			'Year' => $ausgabe[2],
			'hh' => $ausgabe[3],
			'mm' => $ausgabe[4],
			'ss' => $ausgabe[5],
			'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus
	);
}
else 
{
	$arr = array(	'loginstatus' => $loginstatus,
			'adminstatus' => $adminstatus
				);
}
	echo json_encode($arr);
?>
