<?php
/*
	class composerService
	
	Johannes Strasser
	05.08.2017
	www.wistcon.at
*/
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
		$runstop = false;
	}
	elseif ($statusFile)
	{
		$statusWord = trim(fgets($statusFile, 5));
		fclose($status);

	
		switch ($statusWord){
		case "stop":
			$runstop = false;
			break;
		case "run":
			$runstop = true; 
			break;
		}
	}
	return (bool) $runstop;
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
	}

	

}
?>
