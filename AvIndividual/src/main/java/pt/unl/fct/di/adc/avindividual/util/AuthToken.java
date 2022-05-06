package pt.unl.fct.di.adc.avindividual.util;
import java.util.UUID;

public class AuthToken {
	
	public static final long EXPIRATION_TIME = 1000 * 60 * 60 * 2; //2h
	public String username;
	public String role;
	public String tokenID;
	public long validFrom;
	public long validTo;
	

	public AuthToken(String username, String role) {
		
		this.username = username;
		this.role = role;
		this.tokenID = UUID.randomUUID().toString();
		this.validFrom = System.currentTimeMillis();
		this.validTo = this.validFrom + AuthToken.EXPIRATION_TIME;
		
	}
	
}
