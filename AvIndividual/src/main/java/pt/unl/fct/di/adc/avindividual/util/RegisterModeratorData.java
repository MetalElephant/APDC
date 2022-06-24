package pt.unl.fct.di.adc.avindividual.util;

import java.util.regex.Pattern;

public class RegisterModeratorData {
    //User registering
    public String usernameReg;

    //Mandatory information
	public String username, email, name;

	//Optional or default information
	public String profile, homePhone, mobilePhone, address,  nif, role, visibility, code;

	public byte[] photo;
	
	private static final String UNDEFINED = "UNDEFINED";
	
	public RegisterModeratorData() {}
	
	public RegisterModeratorData(String usernameReg, String username, String email, String name, String visibility,
			String homePhone, String mobilePhone, String address, String nif, byte[] photo) {
		this.usernameReg = usernameReg;
        
        //Mandatory information
		this.username = username;
		this.email = email;
		this.name = name;
		this.visibility = visibility;

		//Optional information
		this.homePhone = homePhone;
		this.mobilePhone = mobilePhone;
		this.address = address;
		this.nif = nif;	
		this.photo = photo;
	}

	public RegisterModeratorData(String usernameReg, String username, String email, String name) {
		this.usernameReg = usernameReg;
        
        //Mandatory information
		this.username = username;
		this.email = email;
		this.name = name;
	}

	public void optionalAttributes() {
		if(this.homePhone == null || this.homePhone.length() == 0)
			this.homePhone = UNDEFINED;
		
		if(this.mobilePhone == null || this.mobilePhone.length() == 0)
			this.mobilePhone = UNDEFINED;
		
		if(this.address == null || this.address.length() == 0)
			this.address = UNDEFINED;
		
		if(this.nif == null || this.nif.length() == 0)
			this.nif = UNDEFINED;	
	}
	
	
	public boolean validData() {
		//Check missing info
		if(this.username == null || this.email == null|| this.name == null 
				|| this.visibility == null)
			return false;
		
		//Check empty data
		if(this.username.length() == 0 || this.email.length() == 0||
				this.name.length() == 0 || this.visibility.length() == 0)
			return false;
		
		return true;	
	}
	
	public boolean validEmailFormat() {
		String email = this.email;
		String pattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
		        + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
		
		return Pattern.compile(pattern).matcher(email).matches();
				
	}
}
