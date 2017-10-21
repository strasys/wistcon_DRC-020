/**
 * Program for start side.
 * 
 * Johannes Strasser
 * 03.10.2016
 * www.strasys.at
 * 
 */

sortoutcache = new Date();
var positionPanelCurrent;

function setgetrequestServer(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getStatusLogin(callback1){
	setgetrequestServer("post","/index.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var getHomeLogin = JSON.parse(xhttp.responseText); 
		
			LoginStatus = [(getHomeLogin.loginstatus),
		              		 (getHomeLogin.adminstatus)
			               ];

			if (callback1){
			callback1();
			}
		}
	},"getLoginStatus=g&getData=g");		
}


function getServerData(callback2){
	setgetrequestServer("post","/index.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var getStatusInfo = JSON.parse(xhttp.responseText); 
		
			StatusData = [	(getStatusInfo.loginstatus),
					(getStatusInfo.adminstatus),
					(getStatusInfo.pooltemp),
					(getStatusInfo.outsidetemp),
					(getStatusInfo.OperationMode),
					(getStatusInfo.statusMixer),
					(getStatusInfo.statusPump),
					(getStatusInfo.statusPoolLight),
					(getStatusInfo.statusOutLight),
					(getStatusInfo.statusFreshwaterValve),
					(getStatusInfo.statusNiveauSensor),
					(getStatusInfo.statusMixerSolar),
					(getStatusInfo.statusMixerBypass),
					(getStatusInfo.Feuchte),
					(getStatusInfo.Temperatur)
						               	];

			if (callback2){
			callback2();
			}
		}
	},"getLoginStatus=g&getData=g");		
}

function setServerData(OutNumber,OutValue,callback5){
	setgetrequestServer("post","/index.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
		if (callback5){
			callback5();
			}
		}

	},"getData=s&setOutNumber="+OutNumber+"&setOutValue="+OutValue);		
}

function getXMLData(callback4){
	var getXMLData;
	setgetrequestServer("GET","/VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		
		if (xhttp.readyState==4 && xhttp.status==200){
			var getXMLData = xhttp.responseXML;
			var digiIN = getXMLData.getElementsByTagName("GPIOIN");
			var digiOUT = getXMLData.getElementsByTagName("GPIOOUT");
			var PT1000 = getXMLData.getElementsByTagName("PT1000");
			var AIN = getXMLData.getElementsByTagName("AIN");
			var ButtonText = getXMLData.getElementsByTagName("ButtonText");

			document.getElementById("labelFeuchte").innerHTML = AIN[0].getElementsByTagName("AINName")[0].childNodes[0].nodeValue;
			document.getElementById("labelTemperatur").innerHTML = AIN[1].getElementsByTagName("AINName")[0].childNodes[0].nodeValue;
			document.getElementById("labelTempOutside").innerHTML = PT1000[2].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;
			document.getElementById("buttonOutText0").innerHTML = digiOUT[0].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("buttonOutText1").innerHTML = digiOUT[1].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("buttonOutText2").innerHTML = digiOUT[2].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("buttonOutText3").innerHTML = digiOUT[3].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("ButtonRinseBacktext").innerHTML = ButtonText[0].getElementsByTagName("RinseBackButton")[0].childNodes[0].nodeValue;
			document.getElementById("labelTempPool").innerHTML = PT1000[1].getElementsByTagName("PT1000Name1")[0].childNodes[0].nodeValue;

			document.getElementById("labelStatusPump").innerHTML = digiOUT[1].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("labelStatusWaterValve").innerHTML = digiOUT[4].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			document.getElementById("labelStatusNiveauSensor").innerHTML = digiIN[0].getElementsByTagName("InputName")[0].childNodes[0].nodeValue;
			document.getElementById("labelStatusMixer").innerHTML = digiOUT[0].getElementsByTagName("OutputName")[0].childNodes[0].nodeValue;
			
		if (callback4){
			callback4();
			}
		}	
	});
}

function setValues(callback6){
	document.getElementById("badgeTempPool").innerHTML = StatusData[2]+"°C";
	document.getElementById("badgeTempOutside").innerHTML = StatusData[3]+"°C";
	document.getElementById("badgeFeuchte").innerHTML = StatusData[13]+" %r.F";
	document.getElementById("badgeTemperatur").innerHTML = StatusData[14]+"°C";

	//operation mode indication
	if (StatusData[4] == 1){
		document.getElementById("badgeOperationMode").innerHTML = "AUTO";
		}
	else if (StatusData[4] == 0){
		document.getElementById("badgeOperationMode").innerHTML = "HAND";
	}
	//status Mixer
	if (StatusData[5] == 1){
		document.getElementById("badgeStatusMixer").innerHTML = "HEIZEN";
		}
	else if (StatusData[5] == 0){
		document.getElementById("badgeStatusMixer").innerHTML = "BYPASS";
	}

	var TextOut = new Array();
	var GraphikBadgeOut = new Array();
	var GraphikShadowOut = new Array();
	var a = 0;
	for (i=5; i<10; i++){	
		if (StatusData[i] == 1){
			TextOut[a] = "EIN";
			GraphikBadgeOut[a] = "badge switch-on";
			GraphikShadowOut[a] = "databox switch-on";	
			}
		else if (StatusData[i] == 0){
			TextOut[a] = "AUS";
			GraphikBadgeOut[a] = "badge switch-off";
			GraphikShadowOut[a] = "databox switch-off";	
		}
		a++;
	}
	document.getElementById("badgeOut0").innerHTML = TextOut[0];
	$("#badgeOut0").removeClass().addClass(GraphikBadgeOut[0]);
	$("#buttonOut0").removeClass().addClass(GraphikShadowOut[0]);
	document.getElementById("badgeOut1").innerHTML = TextOut[1];
	$("#badgeOut1").removeClass().addClass(GraphikBadgeOut[1]);
	$("#buttonOut1").removeClass().addClass(GraphikShadowOut[1]);		
	document.getElementById("badgeStatusPump").innerHTML = TextOut[1];
	document.getElementById("badgeOut2").innerHTML = TextOut[2];
	$("#badgeOut2").removeClass().addClass(GraphikBadgeOut[2]);
	$("#buttonOut2").removeClass().addClass(GraphikShadowOut[2]);	
	document.getElementById("badgeOut3").innerHTML = TextOut[3];
	$("#badgeOut3").removeClass().addClass(GraphikBadgeOut[3]);
	$("#buttonOut3").removeClass().addClass(GraphikShadowOut[3]);	
	document.getElementById("badgeStatusWaterValve").innerHTML = TextOut[4];
	//status Niveausensor
	if (StatusData[10] == 1){
		document.getElementById("badgeStatusNiveauSensor").innerHTML = "OK";
		}
	else if (StatusData[10] == 0){
		document.getElementById("badgeStatusNiveauSensor").innerHTML = "leer";
	}

	if (callback6){
		callback6();
	}
}

function setOutstatus(Number){
	var OutValue = 0;
	if (Number == 2){
		//check actual status Out2
		if (StatusData[7] == 1){
			OutValue = 0;	
		} else {
			OutValue = 1;
		}
	}
	else if (Number == 3){
		//check actual status Out3
		if (StatusData[8] == 1){
			OutValue = 0;	
		} else {
			OutValue = 1;
		}	
	}
	else if (Number == 0){
		//check actual status Out3
		if (StatusData[5] == 1){
			OutValue = 0;	
		} else {
			OutValue = 1;
		}
	}
	else if (Number == 1){
		//check actual status Out3
		if (StatusData[6] == 1){
			OutValue = 0;	
		} else {
			OutValue = 1;
		}	
	
	}

	setServerData(Number,OutValue,function(){
		refresh();
	});	
}

function refresh(){
	getServerData(function(){
		setValues(function(){
			if ((StatusData[0] == false) && (positionPanelCurrent > 1)){
				window.location.replace("/index.html");
			}
			setTimeout(function(){
				refresh();
			}, 2000);
		});
	});
}

//View function
function ViewatLoad(callback){
	$("#panelQuickView").hide();
	$("#panelStatusActuators").hide();
	$("#panelAdditionalFunctions").hide();
	$("#panelPager").hide();

	if (callback){
		callback();
	}	
}

//set panel View
function PanelView(position, callback){

	switch(position) {
		case 1:
			$("#panelStatusActuators").hide(function(){
				$("#panelQuickView").show(function(){
					$("#panelPager a:first").hide();
					$("#panelPager a:last").show(function(){
						$("#panelPager a:last").html("Anlagen Status<span aria-hidden=\"true\">  &rarr\;</span>");
					});
				});
			});
			positionPanelCurrent = 1;
			break;
		case 2: 
			$("#panelQuickView").hide(function(){
				$("#panelAdditionalFunctions").hide(function(){
					$("#panelStatusActuators").show(function(){
						$("#panelPager a:first").show(function(){
							$("#panelPager a:first").html("<span aria-hidden=\"true\">&larr\;</span>  Schnellansicht");
							$("#panelPager a:last").html("Sonderfunktionen<span aria-hidden=\"true\">  &rarr\;</span>");
							$("#panelPager a:last").show();
						});
					});
				});
			});
			positionPanelCurrent = 2;
			break;
		case 3: 
			$("#panelStatusActuators").hide(function(){
				$("#panelAdditionalFunctions").show(function(){
					$("#panelPager a:first").html("<span aria-hidden=\"true\">&larr\;</span>  Anlagen Status");
					$("#panelPager a:last").hide();
				});
			});
			positionPanelCurrent = 3;
			break;
	}

	if (callback){
		callback();
	}


}

// load functions and webpage opening
function startatLoad(){
	ViewatLoad(function(){
		loadNavbar(function(){
			getXMLData(function(){
				getServerData(function(){
					refresh();	
				});
			});
		});
	});
}

window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback3){
	getStatusLogin(function(){
		if(LoginStatus[0]){	
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarHome").addClass("active");
					$("#navbar_home span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					$("#panelQuickView").show();
					PanelView(1, function(){
						$("#panelPager").show();
						if (LoginStatus[1]==false)
							{
								$("#navbarSet").hide();
								$("#navbar_set").hide();
							}
					});
				 });
			});
		}
		else
		{
			$(document).ready(function(){
				$("#mainNavbar").load("/navbar.html?ver=1", function(){
					$("#navbarHome").addClass("active");
					$("#navbar_home span").toggleClass("nav_notactive nav_active");
					$("#navbarlogout").hide();
					$("#navbarFunction").hide();
					$("#navbar_function").hide();
					$("#navbarSet").hide();
					$("#navbar_set").hide();
					$("#navbarHelp").hide();
					$("#navbar_help").hide();
					$("#panelStatusOperation").hide();
					$("#panelStatusActuators").hide();
					$("#panelAdditionalFunctions").hide();
					$("#panelQuickView").show();
				});
			});

		}
		if (callback3){
			callback3();
		}
	});
}

$("#panelPager a:last").on('click', function(){
	PanelView(positionPanelCurrent + 1);
});

$("#panelPager a:first").on('click', function(){
	PanelView(positionPanelCurrent - 1);
});

//Rinse Back Function

$("#ButtonRinseBack button").on('click', function(){
	
});

