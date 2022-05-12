package pt.unl.fct.di.adc.avindividual.util;

public class RequestData {

    public String username, name;

    public RequestData (String username){
        this.username = username;
    }

    public RequestData (String username, String name) {
        this.username = username; 
        this.name = name;
    }
}
