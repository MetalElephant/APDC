package pt.unl.fct.di.adc.landit.util.Info;

public class UserInfo {

	public String username, email, name, district, county, autarchy, street, landphone, mobilephone, nif, role, photo;
	public int points;
	
	public UserInfo(String username, String email, String name, String district, String county, 
			String autarchy, String street, String landphone, String mobilephone, String nif, String role, String photo, int points) {
		this.username = username;
		this.email = email;
		this.name = name;
		this.district = district;
		this.county = county;
		this.autarchy = autarchy;
		this.street = street;
		this.landphone = landphone;
		this.mobilephone = mobilephone;
		this.nif = nif;
		this.role = role;
		this.photo = photo;
		this.points = points;
	}
}