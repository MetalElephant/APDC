function removeForm(){
	
	var user = window.location.hash.substring(1);
	var usernameToRemove = document.getElementById("usernameRemove").value;

    var toSend = {username: user, username2: usernameToRemove};
    var toSendJSON = JSON.stringify(toSend);
    
    var xmlhttp = new XMLHttpRequest();
    
	if (xmlhttp) {

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					console.log(xmlhttp.responseText);
					alert(xmlhttp.responseText);
				}
				else {
					alert(xmlhttp.responseText);
				}
			}
		}
	}    
	
	xmlhttp.open("DELETE", document.location.origin + "/rest/users/remove", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(toSendJSON);
}

function showForm(){
	
	var user = window.location.hash.substring(1);

    var toSend = {username: user};
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
	
	xmlhttp.open("POST", document.location.origin + "/rest/users/show", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(toSendJSON);
	
}



function modifyForm(){
	var user = window.location.hash.substring(1);
	var usernameM = document.getElementById("usernameM").value;
	
    var emailM = document.getElementById("emailM").value;
    var nameM = document.getElementById("nameM").value;
    var profileM = document.getElementById("profileM").value;
    var landphoneM = document.getElementById("landphoneM").value;
  	var mobilephoneM = document.getElementById("mobilephoneM").value;
    var addressM = document.getElementById("addressM").value;
    var nifM = document.getElementById("nifM").value;
    var roleM = document.getElementById("roleM").value;
    var stateM = document.getElementById("stateM").value;
    
    if(emailM == ""){
    	emailM = null;
    }
	if(nameM == ""){
	nameM = null;
	}
	if(profileM == ""){
	profileM = null;
	}
	if(landphoneM == ""){
	landphoneM = null;
	}
	if(mobilephoneM == ""){
	mobilephoneM = null;
	}
	if(addressM == ""){
	addressM = null;
	}
	if(nifM == ""){
	nifM = null;
	}
	if(roleM == ""){
	roleM = null;
	}
	if(stateM == ""){
	stateM = null;
	}
    		
    var toSend = {username: user,
    username2: usernameM,
    email: emailM,
    name: nameM,
    address: addressM,
    mobilePhone: mobilephoneM,
    landPhone: landphoneM,
    NIF: nifM,
    role: roleM,
    profile: profileM,
    state: stateM
    };

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
	
	xmlhttp.open("POST", document.location.origin + "/rest/users/modify", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(toSendJSON);
}

function modifyPwdForm(){
	var user = window.location.hash.substring(1);
	
	var currentPassword = document.getElementById("currentPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var newPasswordConfirm = document.getElementById("newPasswordConfirm").value;
    
    var toSend = {
	username: user, 
    oldPwd: currentPassword,
    newPwd: newPassword,
    pwdConfirmation: newPasswordConfirm
    };
    
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
	
	xmlhttp.open("POST", document.location.origin + "/rest/users/modifyPwd", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(toSendJSON);

}

function tokenForm(){
	var user = window.location.hash.substring(1);
	
    var toSend = {username: user};
    var toSendJSON = JSON.stringify(toSend);
    
    var xmlhttp = new XMLHttpRequest();
    
    if(xmlhttp){
		
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					console.log(xmlhttp.responseText);
					alert(xmlhttp.responseText);
				}
				else {
					alert(xmlhttp.responseText);
				}
			}
		}
	}

	xmlhttp.open("POST", document.location.origin + "/rest/users/token", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(toSendJSON);
	
}

function logoutForm(){
	var user = window.location.hash.substring(1);

    var toSend = {username: user};
    var toSendJSON = JSON.stringify(toSend);
    
    var xmlhttp = new XMLHttpRequest();
    
    if(xmlhttp){
		
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					console.log(xmlhttp.responseText);
					window.location.href = '/';//go back to register screen
					alert(xmlhttp.responseText);
				}
				else {
					alert(xmlhttp.responseText);
				}
			}
		}
	}    
	
	xmlhttp.open("DELETE", document.location.origin + "/rest/users/logout", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(toSendJSON);
}

