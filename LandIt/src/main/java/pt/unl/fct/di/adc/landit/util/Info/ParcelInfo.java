package pt.unl.fct.di.adc.landit.util.Info;

import com.google.cloud.datastore.LatLng;

public class ParcelInfo {

    public String owner, parcelName, county, district, freguesia, description, groundType, currUsage, prevUsage, area, confirmation;
	public String[] owners;
	public LatLng[] markers;
	public boolean confirmed;
	
	public ParcelInfo(String owner, String[] owners, String parcelName, String county, String distrcict, String freguesia, String description, 
					  String groundType, String currUsage, String prevUsage, String area, LatLng[] markers, String confirmation, boolean confirmed) {
		this.owner = owner;
		this.owners = owners;
		this.parcelName = parcelName;
		this.county = county;
		this.district = distrcict;
		this.freguesia = freguesia;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
		this.area = area;
		this.markers = markers;
		this.confirmation = confirmation;
		this.confirmed = confirmed;
	}
    
}
