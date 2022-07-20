
document.addEventListener("DOMContentLoaded", function() {
registerSU()
});

function registerForm() {
    
    var registerUsername = document.getElementById("username").value;
    var registerPassword = document.getElementById("password").value;
    var registerconfirmation = document.getElementById("pwdConfirmation").value;
    var registerEmail = document.getElementById("email").value;
    var registerName = document.getElementById("name").value;
    
    
    var registerAddress = document.getElementById("address").value;
  	var registerMPhone = document.getElementById("mobilePhone").value;
    var registerLPhone = document.getElementById("landPhone").value;
    var registerNIF = document.getElementById("nif").value;
    var registerProfile = document.getElementById("profile").value;
    
    if(registerAddress == ""){
    	registerAddress = null;
    }
	if(registerMPhone == ""){
	registerMPhone = null;
	}
	if(registerLPhone == ""){
	registerLPhone = null;
	}
	if(registerNIF == ""){
	registerNIF = null;
	}
	if(registerProfile == ""){
	registerProfile = null;
	}
    
    var toSend = {username: registerUsername,
    password: registerPassword,
    pwdConfirmation: registerconfirmation,
    email: registerEmail,
    name: registerName,
    address: registerAddress,
    mobilePhone: registerMPhone,
    landPhone: registerLPhone,
    NIF: registerNIF,
    profile: registerProfile
    };
    
    //var myObjRegister = {username: registerUsername, password: registerPassword, pwdConfirmation: registerconfirmation, email: registerEmail, name: registerName,
    //address: registerAddress, mobilePhone: registerMPhone, landPhone: registerLPhone, NIF: registerNIF, profile: registerProfile};

    var toSendJSON = JSON.stringify(toSend);
    
    var xmlhttp = new XMLHttpRequest();
    
    if(xmlhttp){
		
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState==4){
				if(xmlhttp.status == 200){
					console.log(xmlhttp.responseText);
					alert(xmlhttp.responseText);
				}
				else{
					alert(xmlhttp.responseText);
				}
			}
			}
		}
	xmlhttp.open("POST", document.location.origin + "/rest/users/register", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(toSendJSON);
	
    
}

//registers SU as soon as app launches
function registerSU(){
	
    
    var toSend = {username: "superUser", password: "password1&", pwdConfirmation: "password1&", email: "SU@SUEMAIL.com", name: "SUPERUSER"};
    var toSendJSON = JSON.stringify(toSend);
    
    var xmlhttp = new XMLHttpRequest();
    
    if(xmlhttp){
		
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState==4 || xmlhttp.readyState==3){
				if(xmlhttp.status == 200 || xmlhttp.status == 403 || xmlhttp.status == 400){
					console.log(xmlhttp.responseText);
				}
			}
		}
	xmlhttp.open("POST", document.location.origin + "/rest/users/register", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(toSendJSON);
	}
}