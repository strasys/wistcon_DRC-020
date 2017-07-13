/**
 * Program to set and get the status of
 * the Outputs
 * 
 * Johannes Strasser
 * www.strasys.at
 * 28.03.2015
 */


sortoutcache = new Date();

function getGPIOinXMLDa(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

// Get Digital In status

function getGPIOinStatus(callback1){
		getGPIOinXMLDa("post","setGPIO.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
			var getIN = JSON.parse(xhttp.responseText); 
		
			IN =  [parseInt(getIN.IN1),
		           parseInt(getIN.IN2),
		           parseInt(getIN.IN3),
		           parseInt(getIN.IN4),
		           (getIN.loginstatus),
		           (getIN.adminstatus)
		        ];
			
			if (callback1){
				callback1();
			}
			}
		}, "setgetGPIO=g" +
		   "&InOut=i");		
}


function setInputStatusHMI(callback3){
	getGPIOinStatus(function()
	{
	for (i=0; i<4; i++){
		if((IN[i]) == 0){
			document.getElementById("InputStatusLED"+i).className = "led-blue";
		}
		else if ((IN[i]) == 1)
		{
			document.getElementById("InputStatusLED"+i).className = "led-blue-off";
		}	
	}
	if (callback3){
		callback3();
	}
	});
}

// This function will be called once at start and after
// set of the input naming.
// The names of the inputs are stored in a XML file on the server.
function getGPIOinXMLData(callback2){
	getGPIOinXMLDa("GET","VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
					{
					var getGPIOinXML = xhttp.responseXML;
					var w = getGPIOinXML.getElementsByTagName("GPIOIN");
					var z = w.length;
					var i = 0;
					for (i=0; i<z; i++){
						document.getElementById("InputInText"+i).innerHTML = w[i].getElementsByTagName("InputName")[0].childNodes[0].nodeValue;
						}
					if (callback2){
						callback2();
					}
					
					}
			});		
}

//This function is called after pressing the "Button Beschriftung ändern" button.
//The function loads the actual button naming form the XML - file on the server
//into the input fields.

function getGPIOinXMLDataInput(){
	getGPIOinXMLDa("GET", "VDF.xml?sortoutcache="+sortoutcache.valueOf(),function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getGPIOinXML = xhttp.responseXML;	
				var w = getGPIOinXML.getElementsByTagName("GPIOIN");
				var z = w.length;
				var i = 0;
				for (i=0; i<z; i++){
			 		document.getElementById("setInputNameInputIn"+i).value= w[i].getElementsByTagName("InputName")[0].childNodes[0].nodeValue;
				}
			}
	});	
}

//After pressing the button "Änderungen speichern" in the button name change menue.
//This function transfers the data to the server where it will be saved with the 
//help of a php function.
function setGPIOinXMLDataInput(callback3){
	
		var InputText = [document.getElementById("setInputNameInputIn0").value,
		                  document.getElementById("setInputNameInputIn1").value,
		                  document.getElementById("setInputNameInputIn2").value,
		                  document.getElementById("setInputNameInputIn3").value
		                  ];
			
		getGPIOinXMLDa("post","setGPIO.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				callback3();
			}
		},
		"InputText0="+InputText[0]+
		"&InputText1="+InputText[1]+
		"&InputText2="+InputText[2]+
		"&InputText3="+InputText[3]+
		"&InputFlag=1");
	
//	ButtonNameSave.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
}

//Show input fields to change Button Names
function SetInputName(){
	 $(document).ready(function(){
		$("#setInputNameDiv").load("setInputName.html?ver=0", function(){
			getGPIOinXMLDataInput();
			$("#setInputNameDiv").show();
			$("#showSetInputName").hide();	
		});
	 });
}

function SaveSetInputName(){
		  setGPIOinXMLDataInput(function(){
				getGPIOinXMLData();
		  });
}

function CancelSetInputName(){
		  getGPIOinXMLDataInput();
}

function CollapseSetInputName(){
		  $("#setInputNameDiv").hide();
		  $("#showSetInputName").show();
	 	  location.reload(true);	  
}
//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system.
function loadNavbar(callback1)
{
	setInputStatusHMI(function()
	{
		if(IN[5])
		{
			$(document).ready(function()
			{
				$("#mainNavbar").load("navbar.html?ver=1", function()
				{
					$("#navbarSet").addClass("active");
					$("#navbar_set span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					$("#showSetInputName").show();
					$("#navbarSet").show();
				});
			});	
		}
		else
		{
			window.location.replace("index.html");
		}
		if (callback1)
		{
			callback1();
		}
	});
}

//load functions ad webpage opening
window.onload=function()
{
	loadNavbar(function()
	{
		getGPIOinXMLData(function()
		{
			refreshStatus();
		});	
	});
}

function refreshStatus(){
	setInputStatusHMI();
	setTimeout(function(){refreshStatus()}, 1000);
}


