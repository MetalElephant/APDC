package pt.unl.fct.di.adc.avindividual.util;

import java.util.regex.Pattern;

public class UpdateUserData {
	
	public String username;
	public String usernameToUpdate;
	
	public String email;
	public String name;
	public String profile;
	public String landPhone;
	public String mobilePhone;
	public String address;
	public String NIF;
	public String role;
	public String state;
	
	public UpdateUserData() {
		
	}
	
	public UpdateUserData(String username, String usernameToUpdate, String name,  String email, String profile, String landPhone,
			String mobilePhone, String NIF, String role, String state, String address) {
		
		this.username = username;
		this.usernameToUpdate = usernameToUpdate;
		
		this.name = name;
		this.email = email;
		this.profile = profile;
		this.address = address;
		this.landPhone = landPhone;
		this.mobilePhone = mobilePhone;
		this.NIF = NIF;
		this.role = role;
		this.state = state;
	
	}
	
	public boolean validRoleFormat() {
		String roleF = this.role;
		if (roleF == null || roleF.equals("SU") || roleF.equals("GS") || roleF.equals("GBO") ||
				roleF.equals("USER"))
			return true;
		
		return false;
	}
	
	public boolean validStateFormat() {
		String stateF = this.state;
		
		if(stateF == null || stateF.equals("INACTIVE") || stateF.equals("ACTIVE"))
			return true;
		
		return false;
		
	}
	
	public boolean validEmailFormat() {
		String email = this.email;
		String pattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
		        + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
		
		return (email == null ||Pattern.compile(pattern).matcher(email).matches());
	}
	

	public boolean canUpdateValues(String user_role,String user2_role) {
		
		//can only modify own account; all attr except email, name and role
		if (user_role.equals("USER")) { 
			if(username.equals(usernameToUpdate) && this.name == null && this.email == null && this.role == null)
				return true;			
		}
		
		//can modify all USER attr, except role
		if((user_role.equals("GBO") && user2_role.equals("USER")) && this.role == null) {
			return true;
		}
		
		if(user_role.equals("GS")) {			
			//can modify all GBO attr, except role 
			if(user2_role.equals("GBO") && this.role == null)
				return true;
			
			//can modify all USER attr, except state; role can only be changed to GBO
			if(user2_role.equals("USER") && this.state == null && (this.role == null || this.role.equals("GBO")))
				return true;
		}
		
		//can change everything except SU attr
		if(user_role.equals("SU") && !user2_role.equals("SU"))
			return true;
		
		return false;
					
	}

}