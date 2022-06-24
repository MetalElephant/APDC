package pt.unl.fct.di.adc.avindividual.util;

public class ParcelData {

	public String owner, parcelName, county, district, freguesia, description, groundType, currUsage, prevUsage, area;
	public String[] owners;
	public double[] allLats, allLngs;
	public byte[] confirmation;
	
	public ParcelData() {}
	
	public ParcelData(String owner, String[] owners, String parcelName, String county, String district, String freguesia, String description, 
					  String groundType, String currUsage, String prevUsage, String area, double[] allLats, double[] allLngs, byte[] confirmation) {
		this.owner = owner;
		this.owners = owners;
		this.parcelName = parcelName;
		this.county = county;
		this.district = district;
		this.freguesia = freguesia;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
		this.area = area;
		this.allLats = allLats;
		this.allLngs = allLngs;
		this.confirmation = confirmation;
	}

	public boolean isDataValid() {
		if (owners == null)
			owners = new String[0];

		if (this.owner == null || this.parcelName == null || this.county == null || this.district == null || this.freguesia == null ||
			this.description == null || this.groundType == null || this.currUsage == null || this.prevUsage == null || this.area == null || 
			this.allLats == null || this.allLngs == null || this.confirmation == null)
			return false;

		if (this.owner.length() == 0 || this.parcelName.length() == 0 || this.county.length() == 0 || this.district.length() == 0 || this.freguesia.length() == 0 ||
			this.description.length() == 0 || this.groundType.length() == 0 || this.currUsage.length() == 0 || this.prevUsage.length() == 0 || this.area.length() == 0 ||
			this.allLats.length == 0 || this.allLngs.length == 0 || this.confirmation.length == 0)
			return false;	
			
		return true;
	}
}