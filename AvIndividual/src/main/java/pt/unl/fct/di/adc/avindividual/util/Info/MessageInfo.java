package pt.unl.fct.di.adc.avindividual.util.Info;

import com.google.cloud.Timestamp;

public class MessageInfo {
    
public String owner, message;
public Timestamp crtTime;

    public MessageInfo(String owner, String message, Timestamp crtTime){
        this.owner = owner;
        this.message = message;
        this.crtTime = crtTime;
    }
}
