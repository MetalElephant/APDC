package pt.unl.fct.di.adc.avindividual.util;

public class ParcelData {
	
	public String owner;
	public float[] points;
	
	public ParcelData() {
		
	}
	
	public ParcelData(float[] points, String owner) {
		this.owner = owner;
		this.points = points;
	}
}