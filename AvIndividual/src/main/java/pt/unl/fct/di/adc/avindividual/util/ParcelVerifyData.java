package pt.unl.fct.di.adc.avindividual.util;

public class ParcelVerifyData {
    public String username, owner, parcelName;

    public ParcelVerifyData() {}

    public ParcelVerifyData(String username, String owner, String parcelName) {
        this.username = username;
        this.owner = owner;
        this.parcelName = parcelName;
    }

    public boolean isDataValid(){
        if (this.username == null || this.owner == null || this.parcelName == null)
            return false;

        return (this.username.length() != 0 && this.owner.length() != 0 && this.parcelName.length() != 0);
    }
}
