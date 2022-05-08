package pt.unl.fct.di.adc.avindividual.util;

public class ModifyParcelData {
	public String owner, parcelName, parcelRegion, description, groundType, currUsage, prevUsage;
	
	public ModifyParcelData() {}
	
	public ModifyParcelData(String owner, String parcelName, String parcelRegion, String description, String groundType, String currUsage, String prevUsage) {
		this.owner = owner;
		this.parcelName = parcelName;
		this.parcelRegion = parcelRegion;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
	}

	public boolean isDataValid() {
		if (this.owner == null || this.parcelName == null || this.parcelRegion == null || this.description == null || this.groundType == null || 
			this.currUsage == null || this.prevUsage == null)
			return false;

		if (this.owner.length() == 0 || this.parcelName.length() == 0 || this.parcelRegion.length() == 0 || this.description.length() == 0 || this.groundType.length() == 0 || 
			this.currUsage.length() == 0 || this.prevUsage.length() == 0)
			return false;	
			
		return true;
	}
}
