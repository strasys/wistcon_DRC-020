/**
 * Program to update the PT1000 values and
 * to set the wire length offset.
 * 
 * 26.07.2016
 * Johannes Strasser
 * 
 * www.strasys.at
 */

sortoutcache = new Date();

function getPT1000Data(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getPT1000values(callback1){
		getPT1000Data("post","PT1000handler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getPT1000 = JSON.parse(xhttp.responseText); 
			
			PT1000temperaturevalues = [
						(getPT1000.temperature11),
						(getPT1000.temperature12),
						(getPT1000.temperature13),
						(getPT1000.temperature14),
			                        (getPT1000.loginstatus),
						(getPT1000.adminstatus)
			                          ];
				if (callback1){
				callback1();
				}
			}
		},"setgetPT1000handler=g");		
}

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

function showPT1000values(){
	getPT1000values(function(){
		if (PT1000temperaturevalues[4])
			{
			for(i=0;i<5;i++){
				$("#badgePT1000"+(i+1)).text(PT1000temperaturevalues[i]+" °C");
			}
			}
		else
			{
			window.location.replace("login.html");
			}
	});
	setTimeout(function(){showPT1000values()}, 1000);
}

// This function is called after pressing the "Button Beschriftung ändern" button.
// The function loads the actual button naming form the XML - file on the server
// into the input fields.

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

function CollapseSetPT1000Name(){
		$("#setPT1000NameDiv").hide();
		$("#showSetPT1000Name").show();
		location.reload(true);
		 
}

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
		getPT1000XMLData(function(){
			showPT1000values();
		});
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check of the operater is already loged on the system.
function loadNavbar(callback1){
	getPT1000values(function(){
		if (PT1000temperaturevalues[5])
		{
			$(document).ready(function(){
				$("#mainNavbar").load("navbar.html?ver=1", function(){
					$("#navbarSet").addClass("active");
					$("#navbar_set span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					$("#navbarSet").show();
				});	
			});
		}
		else
		{
		window.location.replace("index.html");
		}
		if (callback1){
			callback1();
		}
	});
}

