<?php
/*
	class composerService
	
	Johannes Strasser
	05.08.2017
	www.wistcon.at
<<<<<<< HEAD
 */

//error_reporting(E_ALL | E_STRICT);
// Um die Fehler auch auszugeben, aktivieren wir die Ausgabe
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//

=======
*/
>>>>>>> 967dd34833c7285c8e58414b0b0506ac557a5934
class composerService
{
	//get composer Status
	//stop (0) = composer = Automatic mode is off
	//run (1)= composer = Automatic mode is on
	function getcomposerStatus()
	{
	$statusFile = fopen("/tmp/composerstatus.txt", "r");
	if ($statusFile == false)
	{
		$statusFile = fopen("/tmp/composerstatus.txt", "w");
		fwrite($statusFile, "stop");
		fclose($statusFile);
<<<<<<< HEAD
		echo "test";
=======
>>>>>>> 967dd34833c7285c8e58414b0b0506ac557a5934
		$runstop = false;
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
<<<<<<< HEAD
		fclose($statusFile);
=======
		fclose($status);
>>>>>>> 967dd34833c7285c8e58414b0b0506ac557a5934

	
		switch ($statusWord){
		case "stop":
			$runstop = false;
			break;
		case "run":
			$runstop = true; 
			break;
		}
	}
<<<<<<< HEAD
	return $runstop;
=======
	return (bool) $runstop;
>>>>>>> 967dd34833c7285c8e58414b0b0506ac557a5934
	}

	//set composer Status
	//status = true => set to run
	//status = false => set to stop
	function setcomposerStatus($status)
	{
	$statusFile = fopen("/tmp/composerstatus.txt", "w");
	if ($statusFile == false)
	{
		$errorMsg = "Error: fopen\"/tmp/composerstatus.txt\", \"w\" ";
		break;
	}
	elseif ($statusFile)
	{
		switch ($status){
			case true:
				$statusWord = "stop";
				$runstop = 0;
				break;
			case false:
				$statusWord = "run";
				$runstop = 1;
				$cmd = "php /var/www/composer_prog/composer.php";
				exec($cmd . " > /dev/null &");
				break;
		}

		fwrite($statusFile,'',5);
		rewind($statusFile);
		fwrite($statusFile, $statusWord, 5);
		fclose($statusFile);

		$xml=simplexml_load_file("/var/www/VDF.xml") or die("Error: Cannot create object");
		$xml->OperationModeDevice[0]->AutomaticHand = $statusWord;
		$xml->asXML("/var/www/VDF.xml");
	}
<<<<<<< HEAD
	}	
=======
	}

	
>>>>>>> 967dd34833c7285c8e58414b0b0506ac557a5934

}
?>
