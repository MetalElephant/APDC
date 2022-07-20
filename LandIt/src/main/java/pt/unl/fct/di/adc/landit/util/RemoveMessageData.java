package pt.unl.fct.di.adc.landit.util;

public class RemoveMessageData {
    public String username, forumOwner, forumName, msg, msgOwner;

    public RemoveMessageData(){}

    public RemoveMessageData(String username, String forumOwner, String forumName, String msg, String msgOwner){
        this.username = username;
        this.forumOwner = forumOwner;
        this.forumName = forumName;
        this.msg = msg;
        this.msgOwner = msgOwner;
    }

    public boolean isDataValid(){
        if (this.username == null || this.forumOwner == null || this.forumName == null ||  this.msg == null || this.msgOwner == null)
            return false;

        return this.username.length() != 0 && this.forumOwner.length() !=0 && this.forumName.length() != 0 && this.msg.length() != 0 && this.msgOwner.length() != 0;
    }
    
}
