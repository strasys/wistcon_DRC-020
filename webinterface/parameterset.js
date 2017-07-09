/**
 * Parameter Set JavaScript code
 * 
 * Johannes Strasser
 * 19.04.2017
 * www.strasys.at
 * 
 */
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

// load functions ad webpage opening
function startatLoad(){
	loadNavbar(function(){
			refreshStatus();
		});
}
window.onload=startatLoad();

//Load the top fixed navigation bar and highlight the 
//active site roots.
//Check if the operater is already loged on the system as admin.
 function loadNavbar(callback1){
			getStatusLogin(function(){
				if (LoginStatus[0])
				{
					$(document).ready(function(){
						$("#mainNavbar").load("navbar.html?ver=0", function(){
							$("#navbarSet").addClass("active");
							$("#navbarItemComposer").addClass("active");
							$("#navbarlogin").hide();
							$("#navbarSet").hide();
							
							if (LoginStatus[1])
							{
								$("#navbarSet").show();
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

$("#Time_Date").on('click', function(){
	window.location = "timeanddate.html?ver=0";
});

$("#UserOrg").on('click', function(){
	window.location = "user.html?ver=0";
});

$("#RegisterDevice").on('click', function(){
	window.location = "deviceOwnerRegistration.html?ver=0";
});

