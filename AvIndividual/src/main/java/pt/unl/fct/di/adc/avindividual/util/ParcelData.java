package pt.unl.fct.di.adc.avindividual.util;
import com.google.cloud.datastore.LatLng;

public class ParcelData {
	
	public String owner, parcelName, parcelId, description, groundType, currUsage, prevUsage, area;
	public LatLng[] points;
	
	public ParcelData() {
		
	}
	
	public ParcelData(LatLng[] points, String owner, String parcelName, String parcelId, String description, String groundType, String currUsage, String prevUsage, String area) {
		this.owner = owner;
		this.points = points;
		this.parcelName = parcelName;
		this.parcelId = parcelId;
		this.description = description;
		this.groundType = groundType;
		this.currUsage = currUsage;
		this.prevUsage = prevUsage;
		this.area = area;
	}
}