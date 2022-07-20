package pt.unl.fct.di.adc.landit.util;

public class ForumMessageData {

    public String username, owner, forum, message;

    public ForumMessageData(){}

    public ForumMessageData(String username, String owner, String forum, String message){
        this.username = username;
        this.owner = owner;
        this.forum = forum;
        this.message = message;
    }

    public boolean validData(){
		if(this.username == null || this.forum == null || this.owner == null || this.message == null)
			return false;
		
		if(this.username.length() == 0 || this.forum.length() == 0 || this.owner.length() == 0
        || this.message.length() == 0)
			return false;
		
		return true;	
	}

}
