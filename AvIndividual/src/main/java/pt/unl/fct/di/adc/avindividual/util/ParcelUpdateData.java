package pt.unl.fct.di.adc.avindividual.util;

public class ParcelUpdateData {

	public String username, owner, parcelName, description, groundType, currUsage, prevUsage;
	public String[] owners;
	public double[] allLats, allLngs;
	
	public ParcelUpdateData() {}
	
	public ParcelUpdateData(String username, String owner, String[] owners, String parcelName, String description, String groundType, String currUsage, 
							String prevUsage, double[] allLats, double[] allLngs) {
		//Parcel info
		this.username = username;
		this.owner = owner;
		this.parcelName = parcelName;

		//Editable info
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
		this.owners = owners;
		this.allLats = allLats;
		this.allLngs = allLngs;
	}

    public boolean isDataValid(){
		if (this.owners == null) this.owners = new String[0];

        if (this.username == null || this.owner == null || this.parcelName == null || this.description == null || this.groundType == null ||
			this.currUsage == null || this.prevUsage == null || this.allLats == null || this.allLngs == null)
            return false;

        return (this.username.length() != 0 && this.owner.length() != 0 && this.parcelName.length() != 0 && this.description.length() != 0 && this.groundType.length() != 0 && 
				this.currUsage.length() != 0 && this.prevUsage.length() != 0 || this.allLats.length != 0 || this.allLats.length != 0);
    }
}
