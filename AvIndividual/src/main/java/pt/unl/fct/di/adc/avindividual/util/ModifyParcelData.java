package pt.unl.fct.di.adc.avindividual.util;

public class ModifyParcelData {

	public String owner, parcelName, parcelRegion, description, groundType, currUsage, prevUsage;
	
	public ModifyParcelData() {}
	
	public ModifyParcelData(String owner, String parcelRegion, String parcelName, String description, String groundType, String currUsage, String prevUsage) {
		this.owner = owner;
		this.parcelName = parcelName;
		this.parcelRegion = parcelRegion;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
	}
}
