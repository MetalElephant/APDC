package pt.unl.fct.di.adc.landit.util;

import java.util.regex.Pattern;

public class PasswordUpdateData {
	
	public String username;
	public String oldPwd;
	public String newPwd;
	public String pwdConfirmation;
	
	public PasswordUpdateData() {
		
	}
	
	public PasswordUpdateData(String username, String oldPassword, String newPassword, String pwdConfirmation) {
		this.username = username;
		this.oldPwd = oldPassword;
		this.newPwd = newPassword;
		this.pwdConfirmation = pwdConfirmation;
	}
	
	public boolean validData(){
		if(this.username == null || this.newPwd == null || this.oldPwd == null|| this.pwdConfirmation == null)
			return false;
		
		if(this.username.length() == 0 || this.oldPwd.length() == 0 || this.newPwd.length() == 0 
				|| this.pwdConfirmation.length() ==0)
			return false;
		
		return true;	
	}
	
	public boolean validPasswordFormat() {
		String pwd = this.newPwd;
		
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

	public boolean verifyPassword() {
		return this.newPwd.equals(pwdConfirmation);
	}

}
