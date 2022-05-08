package pt.unl.fct.di.adc.avindividual.util;
import java.util.regex.Pattern;


public class RegisterData {

	public String username;
	public String password;
	public String pwdConfirmation;
	public String email;
	public String name;
	
	public String profile;
	public String homePhone;
	public String mobilePhone;
	public String address;
	public String nif;
	public String role;
	public String visibility;
	
	private static final String UNDEFINED = "UNDEFINED";
	
	public RegisterData() {
		
	}
	
	public RegisterData(String username, String password, String confirmation, String email, String name, String visibility,
			String homePhone, String mobilePhone, String address, String nif) {
		this.username = username;
		this.password = password;
		this.pwdConfirmation = confirmation;
		this.email = email;
		this.name = name;

		this.visibility = visibility;	
		this.homePhone = homePhone;
		this.mobilePhone = mobilePhone;
		this.address = address;
		this.nif = nif;
				
	}
	
	
	public boolean validRegistration(){
		
		//check missing info
		if(this.username == null || this.password == null || this.email == null|| this.name == null 
				|| this.pwdConfirmation == null)
			return false;
		
		//check empty data
		if(this.username.length() == 0 || this.password.length() == 0 || this.email.length() == 0||
				this.name.length() == 0	|| this.pwdConfirmation.length() == 0)
			return false;
		
		return true;
		
		
	}
	
	public void optionalAttributes() {
		if(this.homePhone == null)
			this.homePhone = UNDEFINED;
		
		if(this.mobilePhone == null)
			this.mobilePhone = UNDEFINED;
		
		if(this.address == null)
			this.address = UNDEFINED;
		
		if(this.nif == null)
			this.nif = UNDEFINED;
	}
	
	public boolean validPasswordFormat() {
		
		String pwd = this.password;
		
		if(pwd.length()>=5) {
	        Pattern letters = Pattern.compile("[a-zA-z]");
	        Pattern numbers = Pattern.compile("[0-9]");
	        Pattern specChars = Pattern.compile ("[!@#$%&*()_+=|<>?{}\\[\\]~-]");

	        if( letters.matcher(pwd).find() && numbers.matcher(pwd).find()
	        		&& specChars.matcher(pwd).find())
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
	
	
	
}
