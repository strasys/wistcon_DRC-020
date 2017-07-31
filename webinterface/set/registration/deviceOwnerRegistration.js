/**
 * Program to Register the product for a user
 *   
 * 01.01.2017
 * Johannes Strasser
 * 
 * www.strasys.at
 */

var sortoutcache = new Date();
var email;
var username;

function getData(setget, url, cfunc, senddata){
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = cfunc;
	xhttp.open(setget,url,true);
	xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhttp.send(senddata);
}


function getloginstatus(callback1){
		getData("post","deviceOwnerRegistration.php",function()
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


		
// Register owner user at wistcon - server and start verification process
function RegisterOwnerUser(gender, firstName_str, FamilyName_str, street_str, number_str, PLZ_str, City_str, Country_str, email_str, password_str, callback3){	
	getData("post","deviceOwnerRegistration.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var getRegisterData = JSON.parse(xhttp.responseText);
			ownerRegisterStatus = [
						(getRegisterData.product_registered),
						(getRegisterData.product_registerID_exist),
						(getRegisterData.customer_register_email),
						(getRegisterData.customer_exists_flag),
						(getRegisterData.database_write),
						(getRegisterData.write_ID_customer),
						(getRegisterData.send_email_verification),
						(getRegisterData.email),
						(getRegisterData.username)
						];
			if(callback3){
				callback3();
			}
		}
	},
	"gender="+gender+
	"&firstName="+firstName_str+
	"&FamilyName="+FamilyName_str+
	"&street="+street_str+
	"&number="+number_str+
	"&PLZ="+PLZ_str+
	"&City="+City_str+
	"&Country="+Country_str+
	"&email="+email_str+
	"&password="+password_str+
	"&OwnerRegistration=w"
	);
}

// Submit verification code
function handler_submit_very_code(veryCode, email, username, callback){	
	getData("post","deviceOwnerRegistration.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var getVeryData = JSON.parse(xhttp.responseText);
			ownerRegisterStatus_very = [
						(getVeryData.writeVeryData),
						(getVeryData.veryCodeVerification),
						(getVeryData.email),
						(getVeryData.username)
						];
			if(callback){
				callback();
			}
		}
	},
	"veryCode="+veryCode+
	"&email="+email+
	"&username="+username+
	"&CheckVeryCode=c"
	);
}

function submit_very_code(){
	var veryCode = document.getElementById("very_code").value;

	handler_submit_very_code(veryCode, email, username, function(){
		if ((ownerRegisterStatus_very[0] == 1) && (ownerRegisterStatus_very[1] == 1)){
			$("#veri_code_div").hide();
			$("#SubmitProductReg").hide();
			$("#veriCode").val('');
			$("#reg_owner_answer_header").addClass("text-sucess");
			$("#reg_owner_answer_header").html("<strong>Erfolgreich Registriert</strong>");
			$("#reg_owner_answer_p").html("Sie können sich nun über <a href=\"http://www.wistcon.de\">www.wistcon.de</a> anmelden	und erweiterte Funktionen für ihr Produkt nutzen.<br>Eine wesentliche Funktion ist der Zugriff auf Ihr Produkt von außerhalb Ihres Heimnetzwerks.<br><strong>Achtung:<strong> Hierfür müssen Sie Ihre DNS Funktion auf dem Gerät aktivieren.");
			$("#reg_owner_email_p").html("Registrierungs e-mail: <strong>"+email+"</strong><br>");
			$("#reg_owner_username_p").html("Folgender Benutzername wurde Ihnen zugewiesen.<br>Benutzername: <strong>"+username+"</strong>");
		} else if ((ownerRegisterStatus_very[0] == -1) && (ownerRegisterStatus_very[1] == 1))
       			{
			$("#veriCode").val('');
			$("#veri_code_div").show();
			$("#SubmitProductReg").hide();
			$("#reg_owner_answer_header").addClass("text-danger");
			$("#reg_owner_answer_header").html("<strong>Verifizierung Fehlgeschlagen!</strong>");
			$("#reg_owner_answer_p").html("Der Registrierungs Server ist nicht bereit. Bitte versuchen Sie es zu einem späteren Zeitpunkt nochmals!");
			//Button configuration 	
			var buttonProperties = document.getElementById("SubmitProductReg");
			buttonProperties.value = "Neuen Verifizierungscode anfordern";
			buttonProperties.onclick = function () {getNewVeryCode()};
			$("#SubmitProductReg").prop('disabled', true);
			$("#SubmitProductReg").show();

		} else if ((ownerRegisterStatus_very[0] == 0) && (ownerRegisterStatus_very[1] == -1))
			{
			$("#veriCode").val('');
			$("#veri_code_div").show();
			$("#SubmitProductReg").hide();
			$("#reg_owner_answer_header").addClass("text-danger");
			$("#reg_owner_answer_header").html("<strong>Verifizierung Fehlgeschlagen!</strong>");
			$("#reg_owner_answer_p").html("Der Registrierungs Server ist nicht bereit. Bitte versuchen Sie es zu einem späteren Zeitpunkt nochmals!");
			//Button configuration 	
			var buttonProperties = document.getElementById("SubmitProductReg");
			buttonProperties.value = "Neuen Verifizierungscode anfordern";
			buttonProperties.onclick = function () {getNewVeryCode()};
			$("#SubmitProductReg").prop('disabled', true);
			$("#SubmitProductReg").show();
			}

		$("#reg_owner_answer_positiv").show();
	});
}

function getNewVeryCode(){
	// add code
}

function setSelectMenuesValues(){

	var country_list = new Array("Deutschland", "Österreich", "Schweiz");
	for (i=0;i<3;i++){
		var option = document.createElement("option");
		option.text = country_list[i];
		document.getElementById("Country").options.add(option);
	}
	//Button configuration 	
	var buttonProperties = document.getElementById("SubmitProductReg");
	buttonProperties.value = "Daten Senden";
	buttonProperties.onclick = function () {checkProductRegistrationEntry()};
	$("#SubmitProductReg").prop('disabled', false);
}

function emptyinputfields(callback){
	$("#firstName").val('');
	$("#FamilyName").val('');
	$("#street").val('');
	$("#email").val('');
	$("#number").val('');
	$("#PLZ").val('');
	$("#City").val('');
	$("#password1").val('');
	$("#password2").val('');

	if(callback){
		callback();
	}
}

function passwordstrength(){
	var password_str = document.getElementById("password1");
	var password_span = document.getElementById("password1_span");
	var password_patt = new RegExp(/^(?=.*[a-z])(?=.*[\_\?\!\#])(?=.*[A-Z]).{6,15}$/);
	var password_str_res = password_patt.test(password_str.value);

	$("#password1_div").removeClass();
	$("#password1_div").addClass("form-group");
	$("#password1_span").removeClass();

	if (password_str_res){
		$("#password1_div").removeClass();
		$("#password1_div").addClass("input-group has-feedback has-success");
		$("#password1_span").removeClass();
		$("#password1_span").addClass("glyphicon glyphicon-ok form-control-feedback");

	}else{
		$("#password1_div").removeClass();
		$("#password1_div").addClass("input-group has-feedback has-error");
		$("#password1_span").removeClass();
		$("#password1_span").addClass("glyphicon glyphicon-remove form-control-feedback");
	}
}

function tooltip_password(status){
/*	$("#password1").tooltip({
		title:'Das Passwort muss mindestens eine Großbuchstaben<br>einen Kleinbuchstaben enthalten',
		placement:'top',
		html:'true'
	});
	*/
       		if (status == '1'){
          		$("#password1").popover({
			title:'<strong>Passwort Anforderung:</strong>',
			content: '6 - 15 Zeichen<br>min. ein Großbuchstabe [A-Z]<br> min. ein Kleinbuchstabe [a-z]<br>min. eine Zahl [0-9]<br>min. eines folgender Sonderzeichen<br>_ ? ! #',
			placement:'top',
			html:'true',
			});
			$("#password1").popover('show');
		}
		else if (status == '0'){
			$("#password1").popover('hide');
		}
}

function password_repeat(){
	var password1_str = document.getElementById("password1");
	var password2_str = document.getElementById("password2");

	if (password1_str.value == password2_str.value){
		$("#password2_div").removeClass();
		$("#password2_div").addClass("form-group has-feedback has-success");
		$("#password2_span").removeClass();
		$("#password2_span").addClass("glyphicon glyphicon-ok form-control-feedback");

	}else{
		$("#password2_div").removeClass();
		$("#password2_div").addClass("form-group has-feedback has-error");
		$("#password2_span").removeClass();
		$("#password2_span").addClass("glyphicon glyphicon-remove form-control-feedback");
	}

}

function showpassword_text(){
	var className = $("#password1_i").attr('class');
	if (className == 'glyphicon glyphicon-eye-open'){
		$("#password1_i").removeClass();
		$("#password1_i").addClass("glyphicon glyphicon-eye-close");
		document.getElementById("password1").type = "text";
	}
	else if (className == 'glyphicon glyphicon-eye-close'){
		$("#password1_i").removeClass();
		$("#password1_i").addClass("glyphicon glyphicon-eye-open");
		document.getElementById("password1").type = "password";
	}
}

function checkProductRegistrationEntry(){
	var error_flag_registration = 0;

	//reset input "has-feedback" options
	$("#firstName_div").removeClass();
	$("#firstName_div").addClass("form-group");
	$("#firstName_span").removeClass();

	$("#FamilyName_div").removeClass();
	$("#FamilyName_div").addClass("form-group");
	$("#FamilyName_span").removeClass();

	$("#street_div").removeClass();
	$("#street_div").addClass("form-group");
	$("#street_span").removeClass();

	$("#email_div").removeClass();
	$("#email_div").addClass("form-group");
	$("#email_span").removeClass();
	
	$("#number_div").removeClass();
	$("#number_div").addClass("form-group");
	$("#number_span").removeClass();

	$("#PLZ_div").removeClass();
	$("#PLZ_div").addClass("form-group");
	$("#PLZ_span").removeClass();

	$("#City_div").removeClass();
	$("#City_div").addClass("form-group");
	$("#City_span").removeClass();

	$("#password1_div").removeClass();
	$("#password1_div").addClass("form-group");
	$("#password1_span").removeClass();

	$("#password2_div").removeClass();
	$("#password2_div").addClass("form-group");
	$("#password2_span").removeClass();

	// read input values
	var gender_MR_radio = document.getElementById("radioMR");
	var gender_MS_radio = document.getElementById("radioMS");
	var gender = "";
	var email_str = document.getElementById("email");
	var firstName_str = document.getElementById("firstName");
	var FamilyName_str = document.getElementById("FamilyName");
	var street_str = document.getElementById("street");
	var number_str = document.getElementById("number");
	var PLZ_str = document.getElementById("PLZ");
	var City_str = document.getElementById("City");
	var Country_str = document.getElementById("Country");
	var password1_str = document.getElementById("password1");
	var password2_str = document.getElementById("password2");
	
	//Check gender
	if (gender_MR_radio.checked){
		gender = gender_MR_radio.value;
	}
	if (gender_MS_radio.checked){
		gender = gender_MS_radio.value;
	}
	
	//Check e-mail - mandatory
	var email_patt = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	var email_str_res = email_patt.test(email_str.value);

	if ((email_str_res == false) || (email_str.value == "")){
		$("#email_div").removeClass();
		$("#email_div").addClass("form-group has-feedback has-error");
		$("#email_span").removeClass();
		$("#email_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check First Name - mandatory
	var firstName_patt = new RegExp(/^[A-Za-zäöüÄÖÜß\´\`\'\-\ ]{2,20}$/);
	var firstName_str_res = firstName_patt.test(firstName_str.value);
	if((firstName_str.value == "")||(firstName_str_res == false)){
		$("#firstName_div").removeClass();
		$("#firstName_div").addClass("form-group has-feedback has-error");
		$("#firstName_span").removeClass();
		$("#firstName_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check Family Name - mandatory
	var FamilyName_patt = new RegExp(/^[A-Za-zäöüÄÖÜß\'\-\`\´\ ]{2,30}$/);
	var FamilyName_str_res = FamilyName_patt.test(FamilyName_str.value);
	if((FamilyName_str.value == "")||(FamilyName_str_res == false)){
		$("#FamilyName_div").removeClass();
		$("#FamilyName_div").addClass("form-group has-feedback has-error");
		$("#FamilyName_span").removeClass();
		$("#FamilyName_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check street
	var street_patt = new RegExp(/^[A-Za-zäöüÄÖÜß.\'\-\`\´\ ]{2,30}$/);
	var street_str_res = street_patt.test(street_str.value);
	if (!(street_str.value == "") && (street_str_res == false)){
		$("#street_div").removeClass();
		$("#street_div").addClass("form-group has-feedback has-error");
		$("#street_span").removeClass();
		$("#street_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check number
	var number_patt = new RegExp(/^[0-9]+[a-zA-Z]?$/);
	var number_str_res = number_patt.test(number_str.value);
	if (!(number_str.value == "") && (number_str_res == false)){
		$("#number_div").removeClass();
		$("#number_div").addClass("form-group has-feedback has-error");
		$("#number_span").removeClass();
		$("#number_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check PLZ
	var PLZ_patt = new RegExp(/^[0-9]{4,5}$/);
	var PLZ_str_res = PLZ_patt.test(PLZ_str.value);
	if (!(number_str.value == "") && (number_str_res == false)){
		$("#PLZ_div").removeClass();
		$("#PLZ_div").addClass("form-group has-feedback has-error");
		$("#PLZ_span").removeClass();
		$("#PLZ_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}
	
	//Check City - mandatory
	var City_patt = new RegExp(/^[A-Za-zäöüÄÖÜß.\'\-\`\´\ ]{2,20}$/);
	var City_str_res = City_patt.test(City_str.value);
	if ((City_str.value == "") || (City_str_res == false)){
		$("#City_div").removeClass();
		$("#City_div").addClass("form-group has-feedback has-error");
		$("#City_span").removeClass();
		$("#City_span").addClass("glyphicon form-control-feedback glyphicon-remove");
		error_flag_registration = -1;
	}

	//Check password input
	var password_patt = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[\_\?\!\#])(?=.*[A-Z]).{6,15}$/);
	var password_str_res = password_patt.test(password1_str.value);
	
	if ((password_str_res = false) || (password1_str.value != password2_str.value) || (password1_str.value == "")){
		$("#password1_div").removeClass();
		$("#password1_div").addClass("input-group has-feedback has-error");
		$("#password1_span").removeClass();
		$("#password1_span").addClass("glyphicon glyphicon-remove form-control-feedback");

		$("#password2_div").removeClass();
		$("#password2_div").addClass("form-group has-feedback has-error");
		$("#password2_span").removeClass();
		$("#password2_span").addClass("glyphicon glyphicon-remove form-control-feedback");

		error_flag_registration = -1;
	}



	if (error_flag_registration == 0){
		RegisterOwnerUser(gender, firstName_str.value, FamilyName_str.value, street_str.value, number_str.value, PLZ_str.value, City_str.value, Country_str.value, email_str.value, password1_str.value, function(){

			$("#reg_form_owner").hide();
			$("#veri_code_div").hide();

			if (ownerRegisterStatus[0] == 1){
				//Das Produkt wurde bereits registriert	
				$("#reg_owner_answer_header").addClass("text-danger");
				$("#reg_owner_answer_header").html("<strong>Produkt bereits registriert!</strong>");
				$("#reg_owner_answer_p").html("Ihr Produkt wurde bereits von einem anderen Nutzer registriert.<br> Bitte wenden Sie sich an den Hersteller!");
				$("#SubmitProductReg").hide();

			} else if (ownerRegisterStatus[1] == (-1)){
				//Das Produkt hat eine ungültige Produkt-ID
				$("#reg_owner_answer_header").addClass("text-danger");
				$("#reg_owner_answer_header").html("<strong>Falsche Seriennummer!</strong>");
				$("#reg_owner_answer_p").html("Die Seriennummer stimmt nicht überein. Bitte wenden Sie sich an den Hersteller!");
				$("#SubmitProductReg").hide();

			} else if (ownerRegisterStatus[3] == 1){
				//Sie sind mit dieser e-mail Adresse bereits registriert.
				//Um ein weiteres Produkt anzumelden Benutzen Sie die Option
				//weiteres Produkt registrieren.
				$("#reg_owner_answer_header").addClass("text-warning");
				$("#reg_owner_answer_header").html("<strong>Bereits Registriert</strong>");
				$("#reg_owner_answer_p").html("Es ist bereits ein Benutzer mit der von Ihnen angegenben<br><strong>e-mail Adresse: "+ownerRegisterStatus[7]+"</strong><br>registriert.<br>Wollen Sie ein weiteres WISTCON Gerät unter Ihrem Benutzer Account registrieren, klicken Sie den untenstehenden \"Button\"!");
				$("#SubmitProductReg").prop('value', 'Produkt Anmeldung für bereits registrierte Kunden');
				$("#SubmitProductReg").prop('disabled', true);

			} else if ((ownerRegisterStatus[4] == 1) && (ownerRegisterStatus[6] == 1)){
				//Das ist der Standardausgang der Produktregistrierung:
				//Der Kunde wird über den erstellten user Namen und die 
				//e-mail Bestätigung informiert.
				//=> Bestätigung innerhalb von 24h
				//Nächster Schritt Eingabe Passwort
				//Information über Login
				$("#reg_owner_answer_header").addClass("text-success");
				$("#reg_owner_answer_header").html("<strong>Nur noch ein Schritt zur erfolgreichen Registrierung</strong>");
				$("#reg_owner_answer_p").html("Wir haben Ihnen eine Bestätigungs<br>e-mail an: <strong>"+ownerRegisterStatus[7]+"</strong><br> gesendet.<br>Bitte tragen Sie den 5 - stelligen Code zur Bestätigung der Registrierung in das untere Feld ein<br> klicken Sie \"Registrierung abschliessen\"");
			//	$("#reg_owner_email_p").html("<br><strong>Registrierte e-mail: "+ownerRegisterStatus[7]+"<strong>");
				//	$("#reg_owner_username_p").html("<strong>Benutzername: "+ownerRegisterStatus[8]+"<strong>");
				//empty input field
				$("#very_code").val("");
				$("#SubmitProductReg").prop('value', 'Registrierung abschliessen');
				$("#SubmitProductReg").prop('disabled', true);
				//set global email and username variable
				email = ownerRegisterStatus[7];
				username = ownerRegisterStatus[8];
				//Button function
				//Button configuration 	
				var buttonProperties = document.getElementById("SubmitProductReg");
				buttonProperties.onclick = function () {submit_very_code()};
				$("#SubmitProductReg").prop('disabled', false);
				$("#veri_code_div").show();
			}

			$("#reg_owner_answer_positiv").show(); 
		});
	}
}

// Submit data to server => checkRegistrationStatus()
function checkRegistrationStatus(callback){
	$("#waitProcessIndication").modal('show');
	
	getData("post","deviceOwnerRegistration.php",function()
	{
		if (xhttp.readyState==4 && xhttp.status==200)
		{
			var getData = JSON.parse(xhttp.responseText);
			ownerRegisterStatus_check = [
				(getData.RegistrationStatus),
				(getData.AccountActivation),
				(getData.dataBaseError),
				(getData.email),
				(getData.gender),
				(getData.firstName),
				(getData.FamilyName),
				(getData.userName)
				];
			$("#waitProcessIndication").modal('toggle');

			if(callback){
				callback();
			}
		}
	},
	"CheckRegistrationStatus=RS"
	);
}

//show and hide
function showandhide(callback){
	$("#idDeviceOwnerRegistration").hide();	

	if (callback){
		callback();
	}
}

// load functions ad webpage opening
function startatLoad(){
showandhide(function(){
	loadNavbar(function(){
		checkRegistrationStatus(function(){ 
			if(ownerRegisterStatus_check[0] != null){
			if ((ownerRegisterStatus_check[0] == 1) && (ownerRegisterStatus_check[1] == 1)){
				$("#reg_owner_answer_header").html("<strong>Ihr Produkt ist registriert!</strong>");
				$("#reg_owner_answer_p").html("Dieses Produkt ist registriert für: <strong>"+ownerRegisterStatus_check[4]+" "+ownerRegisterStatus_check[5]+" "+ownerRegisterStatus_check[6]+"</strong><br>");	
				$("#reg_owner_email_p").html("Benutzer Name: <strong>"+ownerRegisterStatus_check[7]+"</strong><br>");
				$("#reg_owner_username_p").html("Registrierte e-mail Adresse: <strong>"+ownerRegisterStatus_check[3]+"</strong><br>");
				$("#reg_owner_answer_positiv").show();
				$("#idDeviceOwnerRegistration").hide();
			} else if ((ownerRegisterStatus_check[0] == 1) && (ownerRegisterStatus_check[1] == -1)){
				$("#reg_owner_answer_header").html("<strong>Registrierungs - Verifizierung ausstehend!</strong>");
				$("#reg_owner_answer_positiv").show();
				$("#idDeviceOwnerRegistration").hide();
			}  
			}else	{
				emptyinputfields(function(){
					$("#reg_form_owner").show();
					$("#SubmitProductReg").show();
					$("#idDeviceOwnerRegistration").show();
					setSelectMenuesValues(function(){
					});
				});
			}
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
				$("#mainNavbar").load("/navbar.html?ver=2", function(){
					$("#navbarlogin").hide();
					$("#navbarSet").addClass("active");
					$("#navbarSet").show();
					$("#navbar_set span").toggleClass("nav_notactive nav_active")
					$("#reg_form_owner").hide();
					$("#reg_owner_answer_positiv").hide();
					$("#veri_code_div").hide();
					$("#SubmitProductReg").hide();
		
					if (LogData[1] == false)
					{
						$("#navbarSet").hide();
						$("#navbar_set").hide();
					}
				});	
			});
		}
		else
		{
		window.location.replace("/login.html");
		}
		if (callback1){
			callback1();
		}
	});
}

