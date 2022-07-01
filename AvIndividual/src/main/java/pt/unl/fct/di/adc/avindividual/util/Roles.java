package pt.unl.fct.di.adc.avindividual.util;

// Super user
// Moderator
// User
// Autarchy representative
// Merchant

public enum Roles {
	SU("SU"), MODERATOR("MODERATOR"), OWNER("OWNER"), REPRESENTATIVE("REPRESENTATIVE"), MERCHANT("MERCHANT");

	private final String role;

	private Roles(String role){
		this.role = role;
	}

	public String getRole(){
		return role;
	}
}	
