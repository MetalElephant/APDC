package pt.unl.fct.di.adc.avindividual.util;

public class ParcelUpdateData {

	public String owner, parcelName, description, groundType, currUsage, prevUsage;
	public String[] owners;
	public double[] allLats, allLngs;
	public byte[] confirmation;
	
	public ParcelUpdateData() {}
	
	public ParcelUpdateData(String owner, String[] owners, String parcelName, String description, String groundType, String currUsage, String prevUsage, double[] allLats,
	 						double[] allLngs, byte[] confirmation) {
		this.owner = owner;
		this.parcelName = parcelName;
		this.owners = owners;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
		this.allLats = allLats;
		this.allLngs = allLngs;
		this.confirmation = confirmation;
	}

    public boolean isDataValid(){
        if (this.owner == null || this.parcelName == null)
            return false;

        return (this.owner.length() != 0 && this.parcelName.length() != 0);
    }
}
