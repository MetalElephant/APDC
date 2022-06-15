package pt.unl.fct.di.adc.avindividual.util;

public class ParcelSearchData {
    
    private static final double MAXLONG = -6.1890;
    private static final double MINLONG = -9.5006;
    private static final double MAXLAT = 42.1543;
    private static final double MINLAT = 36.9597;

    public double latMax, latMin, longMax, longMin;
    public String username;

    public ParcelSearchData(){}

    public ParcelSearchData(String username, double latMax, double latMin, double longMax, double longMin){
        this.username = username;
        this.latMax = latMax;
        this.latMin = latMin;
        this.longMax = longMax;
        this.longMin = longMin;
    }
    
    public boolean isDataValid(){
        return this.username == null;
    }

    public void validatePosition(){
        if (this.latMax == 0L) this.latMax = MAXLAT;
        if (this.latMin == 0L) this.latMin = MINLAT;
        if (this.longMax == 0L) this.longMax = MAXLONG;
        if (this.longMin == 0L) this.longMin = MINLONG;
        
    }
}
