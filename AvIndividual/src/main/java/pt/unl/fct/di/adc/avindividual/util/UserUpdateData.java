package pt.unl.fct.di.adc.avindividual.util;

import java.util.regex.Pattern;

public class UserUpdateData {

	private static final String UNDEFINED = "Undefined";
	
	public String username, usernameToUpdate;
	
	public String email, name, visibility, homePhone, mobilePhone, address, nif;
	
	public UserUpdateData() {}
	
	public UserUpdateData(String username, String usernameToUpdate, String name,  String email, String visibility, String homePhone,
			String mobilePhone, String nif, String address) {
		this.username = username;
		this.usernameToUpdate = usernameToUpdate;
		this.name = name;
		this.email = email;
		this.visibility = visibility;
		this.address = address;
		this.homePhone = homePhone;
		this.mobilePhone = mobilePhone;
		this.nif = nif;
	}

	public boolean validData(){	
		//Check missing info
		if(this.username == null || this.usernameToUpdate == null || this.email == null|| this.name == null || 
		   this.visibility == null || this.address == null || this.homePhone == null || this.mobilePhone == null || this.nif == null)
			return false;
		
		//Check empty data
		if(this.username.length() == 0 || this.usernameToUpdate.length() == 0 || this.email.length() == 0 || this.name.length() == 0 || 
		   this.visibility.length() == 0)
			return false;
		
		if (this.address.length() == 0) this.address = UNDEFINED;
		if (this.homePhone.length() == 0) this.homePhone = UNDEFINED;
		if (this.mobilePhone.length() == 0) this.mobilePhone = UNDEFINED;
		if (this.nif.length() == 0) this.nif = UNDEFINED;

		return true;
	}
	
	public boolean validEmailFormat() {
		String email = this.email;
		String pattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
		        + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
		
		return Pattern.compile(pattern).matcher(email).matches();
	}
	
}