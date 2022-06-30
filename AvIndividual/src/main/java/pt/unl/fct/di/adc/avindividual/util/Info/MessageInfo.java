package pt.unl.fct.di.adc.avindividual.util.Info;

public class MessageInfo {
    
public String owner, message, crtTime;
public long order;

    public MessageInfo(String owner, String message, String crtTime, long order){
        this.owner = owner;
        this.message = message;
        this.crtTime = crtTime;
        this.order = order;
    }
}
