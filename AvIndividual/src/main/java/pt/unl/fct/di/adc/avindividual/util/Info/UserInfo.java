package pt.unl.fct.di.adc.avindividual.util.Info;

public class UserInfo {

	public String username, email, name, landphone, mobilephone, address, nif, role, visibility;

	public UserInfo() { }
	
	public UserInfo(String username, String email, String name, String landphone, String mobilephone, String address, String nif, String role, String visibility) {
		this.username = username;
		this.email = email;
		this.name = name;
		this.landphone = landphone;
		this.mobilephone = mobilephone;
		this.address = address;
		this.nif = nif;
		this.role = role;
		this.visibility = visibility;
	}
}