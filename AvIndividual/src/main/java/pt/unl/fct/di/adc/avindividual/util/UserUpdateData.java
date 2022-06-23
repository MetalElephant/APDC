package pt.unl.fct.di.adc.avindividual.util;

import java.util.regex.Pattern;

public class UserUpdateData {
	
	public String username, usernameToUpdate;
	
	public String email, name, visibility, homePhone, mobilePhone, address, nif, role;
	
	public UserUpdateData() {}
	
	public UserUpdateData(String username, String usernameToUpdate, String name,  String email, String visibility, String homePhone,
			String mobilePhone, String nif, String role, String address) {
		this.username = username;
		this.usernameToUpdate = usernameToUpdate;
		this.name = name;
		this.email = email;
		this.visibility = visibility;
		this.address = address;
		this.homePhone = homePhone;
		this.mobilePhone = mobilePhone;
		this.nif = nif;
		this.role = role;
	}

	public boolean validData(){	
		//Check missing info
		return this.username != null && this.username.length() != 0 && this.usernameToUpdate != null && this.usernameToUpdate.length() != 0;
	}
	
	public boolean validEmailFormat() {
		if (this.email == null || this.email.length() == 0)
			return true;

		String email = this.email;
		String pattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
		        + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
		
		return Pattern.compile(pattern).matcher(email).matches();
	}
	
}