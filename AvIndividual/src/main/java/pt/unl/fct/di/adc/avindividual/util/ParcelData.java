package pt.unl.fct.di.adc.avindividual.util;

public class ParcelData {
	
	public String owner, token;
	public float[] points;
	
	public ParcelData() {
		
	}
	
	public ParcelData(float[] points, String token, String owner) {
		this.owner = owner;
		this.token = token;
		this.points = points;
	}
}