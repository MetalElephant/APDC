package pt.unl.fct.di.adc.avindividual.util;

public class RequestData {

    public String username, parcelName;

    public RequestData (String username){
        this.username = username;
    }

    public RequestData (String username, String parcelName){
        this.username = username;
        this.parcelName = parcelName;
    }
}
