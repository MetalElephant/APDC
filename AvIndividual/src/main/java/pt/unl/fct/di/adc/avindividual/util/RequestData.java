package pt.unl.fct.di.adc.avindividual.util;

public class RequestData {

    public String username, name;

    public RequestData() {}

    public RequestData (String username){
        this.username = username;
    }

    public RequestData (String username, String name) {
        this.username = username; 
        this.name = name;
    }

    public boolean isUsernameValid() {
        if (this.username == null)
            return false;
        
        return this.username.length() != 0;
    }

    public boolean isNameValid() {
        if (this.name == null)
            return false;
        
        return this.name.length() != 0;
    }
}