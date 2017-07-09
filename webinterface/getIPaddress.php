<?php
$ip = $_SERVER["REMOTE_ADDR"];
$host = gethostbyaddr($ip);

echo "IP Adresse: $ip<br>";
echo "Hostname: $host";
?>