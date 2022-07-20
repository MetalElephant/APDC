package pt.unl.fct.di.adc.landit.util.Info;

public class OwnerInfo {

    public String username, email, name, district, county, autarchy, street, landphone, mobilephone;
    
    public OwnerInfo(String username, String email, String name, String district, String county, 
            String autarchy, String street, String landphone, String mobilephone) {
        this.username = username;
        this.email = email;
        this.name = name;
        this.district = district;
        this.county = county;
        this.autarchy = autarchy;
        this.street = street;
        this.landphone = landphone;
        this.mobilephone = mobilephone;
    }
}