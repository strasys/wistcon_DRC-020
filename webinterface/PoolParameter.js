/**
 * Program to set the Pool Process Parameters
 * 
 * 28.07.2016
 * Johannes Strasser
 * 
 * www.strasys.at
 */

sortoutcache = new Date();

function getData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getloginstatus(callback1){
		getData("post","PoolParameter.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getLogData = JSON.parse(xhttp.responseText); 
			
			LogData = [
					(getLogData.loginstatus),
					(getLogData.adminstatus)
			                          ];
				if (callback1){
				callback1();
				}
			}
		},"getLogData=g");		
}

function getSystemTimeDate(callback2){
	getData("post","setgetTime.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getSystemTime = JSON.parse(xhttp.responseText); 
			
			timedevice = [
				(getSystemTime.Day),
				(getSystemTime.Month),
				(getSystemTime.Year),
				(getSystemTime.hh),
				(getSystemTime.mm),
				(getSystemTime.ss),
			];

				if (callback2){
				callback2();
				}
			}
		});
}

function calcoffsettime(callback3){
	getSystemTimeDate(function(){
		var clientTime = new Date();
		var deviceTime = new Date();
		deviceTime.setDate(parseInt(timedevice[0]));
		deviceTime.setMonth(parseInt(timedevice[1]));
		deviceTime.setYear(parseInt(timedevice[2]));
		deviceTime.setHours(parseInt(timedevice[3]));
		deviceTime.setMinutes(parseInt(timedevice[4]));
		deviceTime.setSeconds(parseInt(timedevice[5]));
		var device = deviceTime.getTime();
		var client = deviceTime.getTime();
		offsetTime = client - device;
		
		if(callback3){
			callback3();
		}
		});
}
/*
function getPT1000XMLData(callback4){
	getPT1000Data("GET","VDF.xml?sortoutcache="+sortoutcache.valueOf(),function(){
		if (xhttp.readyState==4 && xhttp.status==200){
			var getPT1000XML = xhttp.responseXML;
			var w = getPT1000XML.getElementsByTagName("PT1000");
			var z = w.length;
			var i=0;
			for (i=0; i<z; i++){
			document.getElementById("labelPT1000"+i).innerHTML = w[i].getElementsByTagName("PT1000Name")[0].childNodes[0].nodeValue;
			}
			if (callback4){
				callback4();
			}
		}
		});
		}	
		
*/

function DisplayTime(){
	var clientTime = new Date();
	clientTime.setTime(clientTime.getTime()-offsetTime);
	document.getElementById("curTime").innerHTML=clientTime.toLocaleTimeString();
	setTimeout(function(){DisplayTime()}, 1000);
}

// This function is called after pressing the "Button Beschriftung ändern" button.
// The function loads the actual button naming form the XML - file on the server
// into the input fields.

/*
function getXMLDataInput(){
	getPT1000Data("GET", "VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getPT1000XML = xhttp.responseXML;
				var w = getPT1000XML.getElementsByTagName("PT1000");
				var z = w.length;
				var i = 0;
				for (i=0; i<z; i++){
				document.getElementById("changePT1000Name"+i).value=w[i].getElementsByTagName("PT1000Name")[0].childNodes[0].nodeValue;	
				}
			}
	});
	
}


// After pressing the button "Änderungen speichern" in the button name change menue.
// This function transfers the data to the server where it will be saved with the 
// help of a php function.
function setPT1000XMLDataInput(callback3){
	
	var PT1000Text = [];
	
	for (i=0;i<4;i++){
		PT1000Text[i] = document.getElementById("changePT1000Name"+i).value;
	}	
		
		getPT1000Data("post","PT1000handler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				callback3();
			}
		},
		"PT1000Text0="+PT1000Text[0]+
		"&PT1000Text1="+PT1000Text[1]+
		"&PT1000Text2="+PT1000Text[2]+
		"&PT1000Text3="+PT1000Text[3]+
		"&setPT1000NameFlag=1");
	
//	ButtonNameSave.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}

//Show input fields to change Button Names
function SetPT1000Name(){
	 $(document).ready(function(){
		$("#setPT1000NameDiv").load("setPT1000Name.html?ver=0", function(){
			getXMLDataInput();
			$("#setPT1000NameDiv").show();
			$("#showSetPT1000Name").hide();	
		});
	 });
}

function SaveSetPT1000Name(){
		  setPT1000XMLDataInput(function(){
				getPT1000XMLData();
		  });
}

function CancelSetPT1000Name(){
		  getPT1000XMLDataInput();
}
*/
/*
$(function() {
    $('#datetimepicker1').datetimepicker({
	    format: 'hh:mm',
	    pickDate: false,
	    language: 'en',
	 pick12HourFormat: true
    });
    $('#datetimepicker1').datetimpepicker('show');
});
*/
/*
function setSelectMenues(min, max, idName){
	    	for(i=min; i <= max; i++){
	    	var x = document.getElementById(idName);
	    	var option1 = document.createElement("option");
	    	option1.text = i;
	    	x.options.add(option1);
	    	}
}
*/
function setSelectTime(idName){
	for(i=0;i<=24;i++){
		for(x=0;x<60;x=x+5){
			var y = document.getElementById(idName);
			var option1 = document.createElement("option");
			option1.text = ("0"+i).slice(-2)+":"+("0"+x).slice(-2);
			y.options.add(option1);
		}
	}
}

function setSelectMenuesValues(callback5){
	setSelectTime("StartTime1");
	setSelectTime("StopTime1");
	setSelectTime("StartTime2");
	setSelectTime("StopTime2");
	setSelectTime("StartTime3");
	setSelectTime("StopTime3");
	setSelectTime("StartTime4");
	setSelectTime("StopTime4");
	
		
	if (callback5){
		callback5();
	}
}

function calcCleanTime(CleanTimePeriode,StartTime,StopTime){
	var Laufzeit = document.getElementById(CleanTimePeriode);
	var gTimeStart = document.getElementById(StartTime);
	var gTimeStop = document.getElementById(StopTime);
	var StartTime = new Date();
	var StopTime = new Date();
	var strStart = gTimeStart.value;
	var strStop = gTimeStop.value;
	StartTime.setUTCHours(strStart.substr(0,2));
	StartTime.setUTCMinutes(strStart.substr(3,2));
	StartTime.setUTCSeconds(0);
	StopTime.setUTCHours(strStop.substr(0,2));
	StopTime.setUTCMinutes(strStop.substr(3,2));
	StopTime.setUTCSeconds(0);
	var elapsed = StopTime - StartTime;
	var difference = new Date(elapsed);
	var elapsedhh = difference.getUTCHours();
	var elapsedmm = difference.getUTCMinutes();
	Laufzeit.innerHTML = ("0"+elapsedhh).slice(-2)+":"+("0"+elapsedmm).slice(-2);
	
}

function showSetTime(){
	 $(document).ready(function(){
		 $("#setTimeDiv").load("setTime.html?ver=0",function(){
		 	$("#setTimeDiv").show();
		 });
		 
	 });
 
}



// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		setSelectMenuesValues(function(){
			calcoffsettime(function(){
			DisplayTime();
			});
		});
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback1){
	getloginstatus(function(){
		if (LogData[0])
		{
			$(document).ready(function(){
				$("#mainNavbar").load("navbar.html", function(){
					$("#navbarFunction").addClass("active");
					$("#navbarItemPoolParameter").addClass("active");
					$("#navbarlogin").hide();
					$("#navbarSet").hide();
					$("#inputhh").prop("disabled", true);
				
					
					if (LogData[1])
					{
						$("#navbarSet").show();
						$("#showSetTime").show();
					}
					});	
			});
		}
		else
		{
		window.location.replace("login.html");
		}
		if (callback1){
			callback1();
		}
	});
}

