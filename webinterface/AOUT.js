/**
 * Program to update the AOut values.
 * 
 * 23.07.2017
 * Johannes Strasser
 * 
 * www.wistcon.at
 */
//Number of AOUT cards are used in parallel
var AOUTNum;
//Number of Extension the card is into
var extNum;

function setgetServer(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

function getStatusLogin(callback1){
	setgetServer("post","userLogStatus.php",function()
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

function getURLparms(callback){
	var parmURL = window.location.search.substring(1);
	vars = parmURL.split("&");
	//get extension Number 
	
	switch(vars[1]){
		case 'extension1':
			extNum = 1;
			break;
		case 'extension2':
			extNum = 2;
			break;
		case 'extension3':
			extNum = 3;
			break;
		case 'extension4':
			extNum = 4;
			break;
	}

	getCookie(vars[1], function(result){	
		if (result == 'AOUT'){
			getCookie(vars[2], function(result1){
				AOUTnum = result1;
				callback();
			});	
		} else {
			window.location.replace("hardware.html");
		}
	});		
}


function setAOUT(channel, AOUTvalue, callback2){
	setgetServer("post","AOUT.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				if (callback2){
					callback2();
				}
			}
		},"setgetAnalogOUT=s&AOUTchannel="+channel+"&AOUTvalue="+AOUTvalue+"&extNum="+extNum);		
}

function getAOUT(callback4){
	setgetServer("post","AOUT.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				AnalogOUT = JSON.parse(xhttp.responseText);
				if (callback4){
					callback4();
				}
			}
		},"setgetAnalogOUT=g");		
}



/*Implement Ranger Slider from www.ionDen.com
Thank you on that point for the effort.
Copyright (C) 2014 by Denis Ineshin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var $rangeAnalogOUT1 = $("#AnalogOUTSlider1");
var $rangeAnalogOUT2 = $("#AnalogOUTSlider2");
var $rangeAnalogOUT3 = $("#AnalogOUTSlider3");
var $rangeAnalogOUT4 = $("#AnalogOUTSlider4");

$.getScript("js/ion.rangeSlider.js", function(){
	   $rangeAnalogOUT1.ionRangeSlider({
		   type: "single",
		   min: 0,
		   max: 1023,
		   step : 11,
		   grid: true,
		   force_edges: true 
	   });
	  
	   $rangeAnalogOUT2.ionRangeSlider({
		   type: "single",
		   min: 0,
		   max: 1023,
		   step : 11,
		   grid: true,
		   force_edges: true 
	   });

	 $rangeAnalogOUT3.ionRangeSlider({
		   type: "single",
		   min: 0,
		   max: 1023,
		   step : 11,
		   grid: true,
		   force_edges: true 
	   });
	 $rangeAnalogOUT4.ionRangeSlider({
		   type: "single",
		   min: 0,
		   max: 1023,
		   step : 11,
		   grid: true,
		   force_edges: true 
	   });

	   
	});

$rangeAnalogOUT1.on("change", function(){
	var $this1 = $(this),
		slider1val = $this1.prop("value");
	setAOUT(1, slider1val);
	});

$rangeAnalogOUT2.on("change", function(){
	var $this2 = $(this),
		slider2val = $this2.prop("value");
	setAOUT(2, slider2val);
	});

$rangeAnalogOUT3.on("change", function(){
	var $this3 = $(this),
		slider3val = $this3.prop("value");
	setAOUT(3, slider3val);
	});

$rangeAnalogOUT4.on("change", function(){
	var $this4 = $(this),
		slider4val = $this4.prop("value");
	setAOUT(4, slider4val);
	});

function showAOUTvalues(){
			
	getAOUT(function(){
		var slider1 = $("#AnalogOUTSlider1").data("ionRangeSlider");
		var slider2 = $("#AnalogOUTSlider2").data("ionRangeSlider");
		var slider3 = $("#AnalogOUTSlider3").data("ionRangeSlider");
		var slider4 = $("#AnalogOUTSlider4").data("ionRangeSlider");

		
			
			slider1.update({
					from: AnalogOUT[0]
				});
			slider2.update({
					from: AnalogOUT[1]
			});
			slider3.update({
					from: AnalogOUT[2]
				});
			slider4.update({
					from: AnalogOUT[3]
				});

		});
	
	setTimeout(function(){showAOUTvalues()}, 10000);
}

//load functions at webpage opening
function startatLoad()
{
	loadNavbar(function()
	{
		showAOUTvalues();
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system.
function loadNavbar(callback1)
{
	getStatusLogin(function(){
		if(Log[1])
		{
			$(document).ready(function()
			{
				$("#mainNavbar").load("navbar.html?ver=1", function()
				{
					$("#navbarSet").addClass("active");
					$("#navbar_set span").toggleClass("nav_notactive nav_active");
					$("#navbarlogin").hide();
					$("#navbarSet").show();
				});
			});
		}
		else
		{
			
		}
	if (callback1)
	{
		callback1();
	}
	});
}
