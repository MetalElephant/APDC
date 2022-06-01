package pt.unl.fct.di.adc.avindividual.util;

// Super user
// Moderator
// User
// Autarchy representative
// Merchant

public enum Roles {
	SU("Super User"), MODERATOR("Moderator"), USER("User"), REPRESENTATIVE("Representative"), MERCHANT("Merchant");

	private final String role;

	private Roles(String role){
		this.role = role;
	}

	public String getRole(){
		return role;
	}
}	
