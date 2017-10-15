/**
 *data_cloud JavaScript code
 * 
 * Johannes Strasser
 * 15.10.2017
 * www.strasys.at
 * 
 */
sortoutcache = new Date();
var EEPROMext;
/*
 * Asynchron server send function.
 */
function setgetServer(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}
/*
 * This function get's the login status.
 */

function getStatusLogin(callback1){
		setgetServer("post","/userLogStatus.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var LogStatus = JSON.parse(xhttp.responseText); 
			
			Log = [	(LogStatus.loginstatus),
				(LogStatus.adminstatus)
			               ];
				if (callback1){
				callback1();
				}
			}
		});		
}

function getExtensions(callback){
	setgetServer("post","data_cloud.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var ext = JSON.parse(xhttp.responseText); 
			EEPROMext = [ 	(ext[1]),
					(ext[3]),
					(ext[5]),
					(ext[7])	];
			
				if (callback){
				callback();
				}
			}
		});		
}

function setCookie(cname, cvalue, exdays, callback) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

    if (callback){
	callback();
    }
}

function sethardwarehtmlinterface(callback){
	var a = 1;
	var counter_PT1000 = 0;
	var counter_AOUT = 0;
	var counter_AIN = 0;
	var i=0;
	for (i=0;i<4;i++){
		switch(EEPROMext[i]) {
			case "PT1000":
				counter_PT1000 += 1;
				idData = "PT1000"+counter_PT1000;
				header = "PT1000 "+counter_PT1000;
				loadExtensions(i+1, idData, header, function(){
					setSelectExt(idData+"_Select_Val", idData+"_Select_Interval", idData, function(){
					});
				});
				break;
			case "AOUT":
				counter_AOUT += 1;
				idData = "AOUT"+counter_AOUT;
				header = "Analoge Ausgänge "+counter_AOUT;
				loadExtensions(i+1, idData, header, function(){	
					setSelectExt(idData+"_Select_Val", idData+"_Select_Interval", idData, function(){
					});
				});
				break;
			case "AIN":
				counter_AIN += 1;
				idData = "AIN"+counter_AIN;
				header = "Analoge Eingänge";
				loadExtensions(i+1, idData, header, function(){
					setSelectExt(idData+"_Select_Val", idData+"_Select_Interval", idData, function(){
					});
				});
				break;
		}
	}
	
	if (callback){
		callback();
	}
}


function setSelectDigiInput(callback){
	settimeinterval("Digi_IN_Select_Interval",function(){
		for(i=0;i<12;i++){
			var y = document.getElementById("Digi_IN_Select_Val");
			var option1 = document.createElement("option");
			option1.text = "DigiIN"+i;
			y.options.add(option1);
		}

		if(callback){
			callback();
		}
	});
}

function setSelectDigiOutput(callback){
	settimeinterval("Digi_OUT_Select_Interval",function(){
		for(i=0;i<12;i++){
			var y = document.getElementById("Digi_OUT_Select_Val");
			var option1 = document.createElement("option");
			option1.text = "DigiOUT"+i;
			y.options.add(option1);	
		}
	
		if(callback){
			callback();
		}
	});
}

function setSelectExt(idSelectVal, idSelectInterval, idData, callback){
	
		for(i=0;i<4;i++){
			var y = document.getElementById(idSelectVal);
			var option1 = document.createElement("option");
			option1.text = idData+"_"+(i+1);
			y.options.add(option1);	
		}
	
		var timeinterval = [1,2,3,4,5,10,15,20,30,40,50,60];

	for(i=0;i<(timeinterval.length);i++){
		var y = document.getElementById(idSelectInterval);
		var option1 = document.createElement("option");
		option1.text = timeinterval[i];
		y.options.add(option1);
	}

	
	if(callback){
		callback();
	}
}

function settimeinterval(idName, callback){
	var timeinterval = [1,2,3,4,5,10,15,20,30,40,50,60];

	for(i=0;i<(timeinterval.length);i++){
		var y = document.getElementById(idName);
		var option1 = document.createElement("option");
		option1.text = timeinterval[i];
		y.options.add(option1);
	}
	
	if(callback){
		callback();
	}
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		setSelectDigiOutput(function(){
			setSelectDigiInput(function(){
				getExtensions(function(){
					 sethardwarehtmlinterface();
				});
			});
	
		});
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
function loadNavbar(callback1){
			getStatusLogin(function(){
				if (Log[0])
				{
					$(document).ready(function(){
						$("#mainNavbar").load("/navbar.html?ver=2", function(){
							$("#navbarSet").addClass("active");
							$("#navbar_set span").toggleClass("nav_notactive nav_active")
							$("#navbarlogin").hide();
							
							if (Log[1]==false)
							{
								$("#navbarSet").hide();
								$("#navbar_set").hide();
							}
						});
					});
				}
				else
				{
					window.location.replace("/index.html");
				}
				if (callback1){
					callback1();
				}
			});
 }
/*
$("#DigiIN").on('click', function(){
	window.location = "gpioIN.html?ver=0";
});

$("#DigiOUT").on('click', function(){
	window.location = "gpioOut.html?ver=0";
});

$("#Extension1").on('click', function(){

	window.location = EEPROMext[0]+".html?ver=1&extension1&extensionNumkind1";
});
$("#Extension2").on('click', function(){

	window.location = EEPROMext[1]+".html?ver=0&extension2&extensionNumkind2";
});
$("#Extension3").on('click', function(){

	window.location = EEPROMext[2]+".html?ver=0&extension3&extensionNumkind3";
});
$("#Extension4").on('click', function(){

	window.location = EEPROMext[3]+".html?ver=1&extension4&extensionNumkind4";
});
*/

function loadExtensions(ExtensionNo, idData, header, callback){

	$("#Extension"+ExtensionNo).html("	<div id=\""+idData+"\" class=\"databox info\" style=\"border-radius:0px; min-width:100%;\">"+
				"<div class=\"page-header\">"+
					"<h3 style=\"color:#0087e8;\">"+header+"</h3>"+
				"</div>"+
				"<div class=\"input-group\">"+	
					"<span class=\"input-group-addon\">Wert</span>"+
					"<select id=\""+idData+"_Select_Val\" class=\"form-control\"></select>"+
					"<span class=\"input-group-addon\">Zeit-Interval [Minuten]</span>"+
					"<select id=\""+idData+"_Select_Interval\" class=\"form-control\"></select>"+
				"</div>"+
				"<p></p>"+
				"<div class=\"input-group\">"+
					"<span class=\"input-group-addon\">Messstellen ID</span>"+
					"<input id=\"Messstellen_ID"+idData+"\" type=\"text\" class=\"form-control\" placeholder=\"Messstellen Name \">"+
					"<span class=\"input-group-addon\">Einheit</span>"+
					"<input id=\"Messstellen_Einheit"+idData+"\" type=\"text\" class=\"form-control\">"+
					"<span class=\"input-group-btn\">"+
						"<button id=\"Button_add_"+idData+"\" class=\"btn btn-default\" type=\"button\">Add</button>"+
					"</span>"+
				"</div>"+
				"<p></p>"+
			"</div>"
	);
			
	if (callback){
		callback();
	}

};
