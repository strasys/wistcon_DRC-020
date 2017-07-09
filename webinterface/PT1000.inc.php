<?php
/*
	class PT1000
	
	Johannes Strasser
	06.08.2016
	www.strasys.at
*/
class PT1000
{

	function getPT1000($num)
	{
		unset($PT1000);
		exec("flock /tmp/PT1000handlerlock /usr/lib/cgi-bin/PT1000handler_020 g $num", $PT1000);
		
		return (float) $PT1000[0];
	}
}
?>
