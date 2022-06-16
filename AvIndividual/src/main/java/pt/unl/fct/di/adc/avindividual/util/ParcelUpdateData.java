package pt.unl.fct.di.adc.avindividual.util;

public class ParcelUpdateData {

	public String owner, parcelName, parcelRegion, description, groundType, currUsage, prevUsage;
	
	public ParcelUpdateData() {}
	
	public ParcelUpdateData(String owner, String parcelName, String description, String groundType, String currUsage, String prevUsage) {
		this.owner = owner;
		this.parcelName = parcelName;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
	}

    public boolean isDataValid(){
        if (this.owner == null || this.parcelName == null)
            return false;

        return (this.owner.length() != 0 && this.parcelName.length() != 0);
    }
}
