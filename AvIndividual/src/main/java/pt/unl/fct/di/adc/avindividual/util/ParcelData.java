package pt.unl.fct.di.adc.avindividual.util;

public class ParcelData {
	

	public String owner, parcelName, parcelRegion, description, groundType, currUsage, prevUsage, area;
	public double[] allLats, allLngs;
	
	public ParcelData() {}
	
	public ParcelData(String owner, String parcelName, String parcelRegion, String description, String groundType, String currUsage, String prevUsage, String area, double[] allLats, double[] allLngs) {
		this.owner = owner;
		this.parcelName = parcelName;
		this.parcelRegion = parcelRegion;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
		this.area = area;
		this.allLats = allLats;
		this.allLngs = allLngs;
	}

	public boolean isDataValid() {
		if (this.owner == null || this.parcelName == null || this.parcelRegion == null || this.description == null || this.groundType == null || 
			this.currUsage == null || this.prevUsage == null || this.area == null || this.allLats == null || this.allLngs == null)
			return false;

		if (this.owner.length() == 0 || this.parcelName.length() == 0 || this.parcelRegion.length() == 0 || this.description.length() == 0 || this.groundType.length() == 0 || 
			this.currUsage.length() == 0 || this.prevUsage.length() == 0 || this.area.length() == 0 || this.allLats.length == 0 || this.allLngs.length == 0)
			return false;	
			
		return true;
	}
}