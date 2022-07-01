package pt.unl.fct.di.adc.avindividual.util;

// Super user
// Moderator
// User
// Autarchy representative
// Merchant

public enum Roles {
	SUPERUSER("SUPERUSER"), MODERADOR("MODERADOR"), PROPRIETARIO("PROPRIETARIO"), REPRESENTANTE("REPRESENTANTE"), COMERCIANTE("COMERCIANTE");

	private final String role;

	private Roles(String role){
		this.role = role;
	}

	public String getRole(){
		return role;
	}
}	
