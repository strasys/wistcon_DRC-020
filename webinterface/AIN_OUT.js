/**
 * Program to update the AIn and AOut values.
 * 
 * 06.05.2015
 * Johannes Strasser
 * 
 * www.strasys.at
 */

function setgetAnalog(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}

function getAIn(callback1){
		setgetAnalog("post","AINOUThandler.php",function()
			{
				if (xhttp.readyState==4 && xhttp.status==200)
				{
				var getAIn = JSON.parse(xhttp.responseText); 
				
				AnalogIN = [(getAIn.INvalue1),
					(getAIn.INvalue2),
					(getAIn.INvalue3),
					(getAIn.INvalue4),
				            (getAIn.loginstatus),
				            (getAIn.adminstatus)
				               ];
					if (callback1){
						callback1();
					}
				}
			},"setgetAnalog=g&InOut=I");		
}

function setAOUT(channel, AOUTvalue, callback2){
	setgetAnalog("post","AINOUThandler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				if (callback2){
					callback2();
				}
			}
		},"setgetAnalog=s&InOut=O&AOUTchannel="+channel+"&AOUTvalue="+AOUTvalue);		
}

function getAOUT(callback4){
	setgetAnalog("post","AINOUThandler.php",function()
		{
			if (xhttp.readyState==4 && xhttp.status==200)
			{
				var getAOUT = JSON.parse(xhttp.responseText); 
				
				AnalogOUT = [(getAOUT.OUTvalue1),
					(getAOUT.OUTvalue2),
				        (getAOUT.loginstatus),
				        (getAOUT.adminstatus)
				               ];
				if (callback4){
					callback4();
				}
			}
		},"setgetAnalog=g&InOut=O");		
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




/*
function showAOUTvalues(){
getAOUT(function(){
	//	var slider = $("#range_50").data("ionRangeSlider");
		slider.update({
			from: AnalogOUT[0]
	$("#slider1val").text(AnalogOUT[0]);
		});
	setTimeout(function(){showAOUTvalues()}, 1000);
}
*/

function showAINOUTvalues(){
	
	getAIn(function(){
		$("#badgeAIN1").text(AnalogIN[0]);
		$("#badgeAIN2").text(AnalogIN[1]);
		
	getAOUT(function(){
		var slider1 = $("#AnalogOUTSlider1").data("ionRangeSlider");
		var slider2 = $("#AnalogOUTSlider2").data("ionRangeSlider");
		
			
			slider2.update({
					from: AnalogOUT[1]
				});
			slider1.update({
					from: AnalogOUT[0]
			});
		//	$("#slider1val").text(AnalogOUT[0]);
		//	$("#slider2val").text(AnalogOUT[1]);
			
		});
				
	});
	
	setTimeout(function(){showAINOUTvalues()}, 1000);
}

//load functions at webpage opening
function startatLoad()
{
	loadNavbar(function()
	{
		showAINOUTvalues();
	});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system.
function loadNavbar(callback1)
{
	getAIn(function()
	{
		if(AnalogIN[2])
		{
			$(document).ready(function()
			{
				$("#mainNavbar").load("navbar.html", function()
				{
					$("#navbarFunction").addClass("active");
					$("#navbarItemAIO").addClass("active");
					$("#navbarlogin").hide();
					$("#navbarSet").hide();
					
					if(AnalogIN[3])
					{
						$("#navbarSet").show();
					}
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
