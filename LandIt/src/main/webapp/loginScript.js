


function loginForm() {
    
    var registerUsername = document.getElementById("username").value;
    var registerPassword = document.getElementById("password").value;
    
    var myObjRegister = {username: registerUsername, password: registerPassword};
    var myJSONRegister = JSON.stringify(myObjRegister);
    
    var xmlhttp = new XMLHttpRequest();
    
    if(xmlhttp){
		
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState==4){
				if(xmlhttp.status == 200){
					console.log(xmlhttp.responseText);
					window.location.href='/logIn.html#'+ registerUsername;
				}
				else{
					alert(xmlhttp.responseText);
				}
			}
			}
	}    
	
	xmlhttp.open("POST", document.location.origin + "/rest/users/login", true);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(myJSONRegister);
    
  //  alert(xmlhttp.responseText);
}