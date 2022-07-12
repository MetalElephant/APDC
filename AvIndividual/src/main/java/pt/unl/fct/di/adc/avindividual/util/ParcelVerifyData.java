package pt.unl.fct.di.adc.avindividual.util;

public class ParcelVerifyData {
    public String username, owner, parcelName, reason;
    public boolean confirmation;

    public ParcelVerifyData() {}

    public ParcelVerifyData(String username, String owner, String parcelName, String reason, boolean confirmation) {
        this.username = username;
        this.owner = owner;
        this.parcelName = parcelName;
        this.reason = reason;
        this.confirmation = confirmation;
    }

    public boolean isDataValid(){
        if (this.username == null || this.owner == null || this.parcelName == null)
            return false;

        if(!confirmation && (this.reason == null || this.reason.length() != 0))
            return false;

        return (this.username.length() != 0 && this.owner.length() != 0 && this.parcelName.length() != 0);
    }
}
