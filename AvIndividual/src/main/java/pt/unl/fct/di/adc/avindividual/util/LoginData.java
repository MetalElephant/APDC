package pt.unl.fct.di.adc.avindividual.util;

public class LoginData {
	
	public String username;
	public String password;
	
	public LoginData() {
		
	}
	
	public LoginData(String username, String password) {
		this.username = username;
		this.password = password;
	}

	public boolean validData(){	
		//Check missing info
		if(this.username == null || this.password == null)
			return false;
		
		//Check empty data
		if(this.username.length() == 0 || this.password.length() == 0)
			return false;
		
		return true;
	}
}
