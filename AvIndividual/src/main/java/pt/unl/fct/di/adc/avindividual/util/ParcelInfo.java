package pt.unl.fct.di.adc.avindividual.util;

import com.google.cloud.datastore.LatLng;

public class ParcelInfo {

    public String owner, parcelName, parcelRegion, description, groundType, currUsage, prevUsage, area;
	public LatLng[] markers;
	
	public ParcelInfo(String owner, String parcelName, String parcelRegion, String description, String groundType, String currUsage, String prevUsage,
                      String area, LatLng[] markers) {
		this.owner = owner;
		this.parcelName = parcelName;
		this.parcelRegion = parcelRegion;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
		this.area = area;
		this.markers = markers;
	}
    
}
