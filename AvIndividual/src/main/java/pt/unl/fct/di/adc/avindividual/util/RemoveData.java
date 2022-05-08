package pt.unl.fct.di.adc.avindividual.util;

public class RemoveData {
	
	public String username;
	public String usernameToRemove;
	
	public RemoveData() {}
	
	public RemoveData(String username, String usernameToRemove) {
		this.username = username;
		this.usernameToRemove = usernameToRemove;
	}

	public boolean validData(){	
		//Check missing info
		if(this.username == null || this.usernameToRemove == null)
			return false;
		
		//Check empty data
		if(this.username.length() == 0 || this.usernameToRemove.length() == 0)
			return false;
		
		return true;
	}
}
