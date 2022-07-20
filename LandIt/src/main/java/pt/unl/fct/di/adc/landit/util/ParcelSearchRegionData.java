package pt.unl.fct.di.adc.landit.util;

public class ParcelSearchRegionData {

    public int type; // 1 county, 2 district, 3 freguesia
    public String username, region;

    public ParcelSearchRegionData(){}

    public ParcelSearchRegionData(String username, String region, int type){
        this.username = username;
        this.region = region;
        this.type = type;
    }
    
    public boolean isDataValid(){
        return this.username != null && this.region != null && (this.type == 1 || this.type == 2 || this.type == 3);
    }
}
