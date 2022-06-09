package pt.unl.fct.di.adc.avindividual.util;

public class RemoveParcelData {

    public String username, owner, parcelName;

    public RemoveParcelData(String username, String owner, String parcelName){
        this.username = username;
        this.owner = owner;
        this.parcelName = parcelName;
    }

    public boolean isDataValid(){
        if (this.username == null || this.owner == null || this.parcelName == null)
            return false;

        return this.username.length() != 0 && this.owner.length() !=0 && this.parcelName.length() != 0;
    }
    
}
