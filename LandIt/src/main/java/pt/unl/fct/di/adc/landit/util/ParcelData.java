package pt.unl.fct.di.adc.landit.util;

public class ParcelData {

	public String owner, parcelName, district, county, autarchy, description, groundType, currUsage, prevUsage;
	public String[] owners;
	public double[] allLats, allLngs;
	public byte[] confirmation;
	public int type; //Type of confirmation file: 1 for pdf, 2 for jpeg
	
	public ParcelData() {}
	
	public ParcelData(String owner, String[] owners, String parcelName, String district, String county, String autarchy, String description, 
					  String groundType, String currUsage, String prevUsage, double[] allLats, double[] allLngs, byte[] confirmation, int type) {
		this.owner = owner;
		this.owners = owners;
		this.parcelName = parcelName;
		this.district = district;
		this.county = county;
		this.autarchy = autarchy;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
		this.allLats = allLats;
		this.allLngs = allLngs;
		this.confirmation = confirmation;
		this.type = type;
	}

	public boolean isDataValid() {
		if (owners == null)
			owners = new String[0];

		if (this.owner == null || this.parcelName == null || this.district == null || this.county == null || this.autarchy == null ||
			this.description == null || this.groundType == null || this.currUsage == null || this.prevUsage == null || 
			(this.type != 1 && this.type != 2) || this.allLats == null || this.allLngs == null || this.confirmation == null)
			return false;

		if (this.owner.length() == 0 || this.parcelName.length() == 0 || this.district.length() == 0 || this.county.length() == 0 || this.autarchy.length() == 0 ||
			this.description.length() == 0 || this.groundType.length() == 0 || this.currUsage.length() == 0 || this.prevUsage.length() == 0 ||
			this.allLats.length == 0 || this.allLngs.length == 0 || this.confirmation.length == 0)
			return false;	
			
		return true;
	}
}