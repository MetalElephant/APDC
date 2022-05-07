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
}