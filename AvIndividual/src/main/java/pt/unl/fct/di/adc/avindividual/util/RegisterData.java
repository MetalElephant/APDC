package pt.unl.fct.di.adc.avindividual.util;

import java.util.regex.Pattern;

public class RegisterData {

	//Mandatory information
	public String username, password, pwdConfirmation, email, name;

	//Optional or default information
	public String profile, homePhone, mobilePhone, address,  nif, role, state, visibility, code;
	
	private static final String UNDEFINED = "UNDEFINED";
	
	public RegisterData() {}
	
	public RegisterData(String username, String password, String confirmation, String email, String name, String visibility,
			String homePhone, String mobilePhone, String address, String nif, String code) {
		//Mandatory information
		this.username = username;
		this.password = password;
		this.pwdConfirmation = confirmation;
		this.email = email;
		this.name = name;
		this.visibility = visibility;

		//Optional information
		this.homePhone = homePhone;
		this.mobilePhone = mobilePhone;
		this.address = address;
		this.nif = nif;	
		this.code = code;
		
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
		
		if(this.visibility == null || this.visibility.length() == 0)
			this.visibility = "default";//TODO set as default for testing
	}
	
	
	public boolean validData(){
		//Check missing info
		if(this.username == null || this.password == null || this.email == null|| this.name == null 
				|| this.pwdConfirmation == null)
			return false;
		
		//Check empty data
		if(this.username.length() == 0 || this.password.length() == 0 || this.email.length() == 0||
				this.name.length() == 0	|| this.pwdConfirmation.length() == 0)
			return false;
		
		return true;
		
		
	}
	
	public boolean validPasswordFormat() {
		
		String pwd = this.password;
		
		if(pwd.length()>=5) {
	        Pattern letters = Pattern.compile("[a-zA-Z]");
			Pattern upper = Pattern.compile("[A-Z]");
	        Pattern numbers = Pattern.compile("[0-9]");
	        Pattern specChars = Pattern.compile ("[!@#$%&*()_+=|<>?{}\\[\\]~-]");

	        if( letters.matcher(pwd).find() && numbers.matcher(pwd).find()
	        		&& specChars.matcher(pwd).find() && upper.matcher(pwd).find())
	        		return true;
		}
	        return false;
		
	}
	
	public boolean confirmedPassword() {
		return this.password.equals(this.pwdConfirmation);
	}
	
	
	public boolean validEmailFormat() {
		String email = this.email;
		String pattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
		        + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
		
		return Pattern.compile(pattern).matcher(email).matches();
				
	}
	
	public String generateCode() {
		int aux = (int) (Math.random() * 999);

		return (this.username+aux);
	}

	public String getCodeUser(){
		return this.code.substring(0, this.code.length()-3);
	}
	
}