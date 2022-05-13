package pt.unl.fct.di.adc.avindividual.util;

import com.google.cloud.datastore.Entity;

public class ModifyParcelData {

	//Parcel info
	private static final String PARCEL_NAME = "name";
	private static final String DESCRIPTION = "description";
	private static final String GROUND_COVER_TYPE = "ground cover type";
	private static final String CURR_USAGE = "current usage";
	private static final String PREV_USAGE = "previous usage";

	public String owner, parcelName, description, groundType, currUsage, prevUsage;
	
	public ModifyParcelData() {}
	
	public ModifyParcelData(String owner, String parcelName, String description, String groundType, String currUsage, String prevUsage) {
		this.owner = owner;
		this.parcelName = parcelName;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
	}

	public void removeNulls(Entity modified) {
		if(this.parcelName == null) {
			this.parcelName = modified.getString(PARCEL_NAME);
		}
		
		if(this.description == null) {
			this.description = modified.getString(DESCRIPTION);
		}
		
		if(this.groundType == null) {
			this.groundType = modified.getString(GROUND_COVER_TYPE);
		}
		
		if(this.currUsage == null) {
			this.currUsage = modified.getString(CURR_USAGE);
		}
		
		if(this.prevUsage == null) {
			this.prevUsage = modified.getString(PREV_USAGE);
		}
	}
}
