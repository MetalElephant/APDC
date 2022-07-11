package pt.unl.fct.di.adc.avindividual.util;

import java.util.regex.Pattern;

public class RegisterModeratorData {
    //User registering
    public String usernameReg;

    //Mandatory information
	public String username, email, name, county, district, autarchy;

	//Optional or default information
	public String profile, homePhone, mobilePhone, street,  nif;

	public byte[] photo;

	public boolean isRep;
	
	private static final String UNDEFINED = "Não Definido";
	
	public RegisterModeratorData() {}
	
	public RegisterModeratorData(String usernameReg, String username, String email, String name,
			String district, String county, String autarchy, String street,
			String homePhone, String mobilePhone, String nif, byte[] photo, boolean isRep) {
		
		//Mandatory information
		this.usernameReg = usernameReg;
        this.username = username;
		this.email = email;
		this.name = name;
		this.district = district;
		this.county = county;
		this.autarchy = autarchy;
		this.isRep = isRep;

		//Optional information
		this.street = street;
		this.homePhone = homePhone;
		this.mobilePhone = mobilePhone;
		this.nif = nif;	
		this.photo = photo;
	}

	public RegisterModeratorData(String usernameReg, String username, String email, String name,
			String district, String county, String autarchy, boolean isRep) {
        
        //Mandatory information
		this.usernameReg = usernameReg;
		this.username = username;
		this.email = email;
		this.name = name;;
		this.district = district;
		this.county = county;
		this.autarchy = autarchy;
		this.isRep = isRep;
	}

	public void optionalAttributes() {
		if(this.homePhone == null || this.homePhone.length() == 0)
			this.homePhone = UNDEFINED;
		
		if(this.mobilePhone == null || this.mobilePhone.length() == 0)
			this.mobilePhone = UNDEFINED;
		
		if(this.street == null || this.street.length() == 0)
			this.street = UNDEFINED;
		
		if(this.nif == null || this.nif.length() == 0)
			this.nif = UNDEFINED;

		if (this.photo == null)
			this.photo = new byte[0];
	}
	
	
	public boolean validData() {
		//Check missing info
		if(this.usernameReg == null || this.username == null || this.email == null|| this.name == null
			|| this.district == null || this.county == null || this.autarchy == null)
			return false;
		
		//Check empty data
		if(this.usernameReg.length() == 0 ||this.username.length() == 0 || this.email.length() == 0 || this.name.length() == 0
			|| this.district.length() == 0 || this.county.length() == 0 || this.autarchy.length() == 0)
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
