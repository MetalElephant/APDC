package pt.unl.fct.di.adc.avindividual.util;

import java.util.regex.Pattern;

public class UserUpdateData {
	
	public String username, usernameToUpdate;
	
	public String email, name, visibility, homePhone, mobilePhone, address, nif, role, state;
	
	public UserUpdateData() {}
	
	public UserUpdateData(String username, String usernameToUpdate, String name,  String email, String visibility, String homePhone,
			String mobilePhone, String nif, String role, String state, String address) {
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
		this.state = state;
	}
	
	public boolean validRoleFormat() {
		if (this.role == null || this.role.length() == 0)
			return true;
		//TODO Now it is typed manually, later make a drop down list to choose the value and we can remove this boolean
		String roleF = this.role;
		if (roleF == null || roleF.equals("SU") || roleF.equals("GS") || roleF.equals("GBO") ||
				roleF.equals("USER"))
			return true;
		
		return false;
	}
	
	public boolean validStateFormat() {
		//TODO Now it is typed manually, later make a drop down list to choose the value and we can remove this boolean
		if (this.state == null || this.state.length() == 0)
			return true;

		if(this.state.equals("INACTIVE") || this.state.equals("ACTIVE"))
			return true;
		
		return false;
		
	}
	
	public boolean validEmailFormat() {
		if (this.email == null || this.email.length() == 0)
			return true;

		String email = this.email;
		String pattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@" 
		        + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
		
		return Pattern.compile(pattern).matcher(email).matches();
	}
	

	//TODO No roles yet so we always say true for testing
	//and this shouldn't be here it should be a global function for various methods
	public boolean canUpdateValues(String user_role,String user2_role) {
		/*
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
		*/
		return true;			
	}

}