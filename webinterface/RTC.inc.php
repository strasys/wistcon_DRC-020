<?php
/*
	class_RTC
	
	Johannes Strasser
	07.08.2016
	www.strasys.at
*/

class RTC
{
	function getDay()
	{	
		exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);
		return (int) $ausgabe[0];
	}

	function getMonth()
	{
		exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);
		return (int) $ausgabe[1];
	}

	function getYear()
	{
		exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);
		return (int) $ausgabe[2];
	}

	function gethh()
	{
		exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);
		return (int) $ausgabe[3];
	}

	function getmm()
	{
		exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);
		return (int) $ausgabe[4];
	}

	function getss()
	{
		exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);
		return (int) $ausgabe[1];
	}

	function getstrTimeHHMM()
	{
		exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);
		$strHHMM = $ausgabe[3].":".$ausgabe[4];
		return (string) $strHHMM;
	}

	function getstrDateDDMMYYYY()
	{
		exec(" /usr/lib/cgi-bin/RTChandler020", $ausgabe);
		$strDDMMYYYY = $ausgabe[0].".".$ausgabe[1].".".$ausgabe[2];
		return (string) $strDDMMYYYY;
	}

}
?>
