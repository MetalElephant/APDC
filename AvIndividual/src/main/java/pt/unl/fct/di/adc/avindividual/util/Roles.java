package pt.unl.fct.di.adc.avindividual.util;

// Super user
// Moderator
// User
// Autarchy representative
// Merchant

public enum Roles {
	SU("Super User"), MODERATOR("Moderador"), OWNER("Proprietario"), REPRESENTATIVE("Representante"), MERCHANT("Comerciante");

	private final String role;

	private Roles(String role){
		this.role = role;
	}

	public String getRole(){
		return role;
	}
}	
