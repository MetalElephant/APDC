package pt.unl.fct.di.adc.avindividual.util;

public class UserInfo {

	public String username;
	public String email;
	public String name;
	public String landphone;
	public String mobilephone;
	public String address;
	public String nif;
	public String role;
	public String state;

	public UserInfo() { }
	
	public UserInfo(String username, String email, String name, String landphone, String mobilephone, String address, String nif, String role, String state) {
		this.username = username;
		this.email = email;
		this.name = name;
		this.landphone = landphone;
		this.mobilephone = mobilephone;
		this.address = address;
		this.nif = nif;
		this.role = role;
		this.state = state;
	}
}