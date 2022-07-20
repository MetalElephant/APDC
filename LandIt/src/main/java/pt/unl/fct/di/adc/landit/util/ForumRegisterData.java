package pt.unl.fct.di.adc.landit.util;

public class ForumRegisterData {

    public String username, forumName, topic;

    public ForumRegisterData(){}

    public ForumRegisterData(String username, String forumName, String topic){
        this.username = username;
        this.forumName = forumName;
        this.topic = topic;
    }

    public boolean validData(){
		if(this.username == null || this.forumName == null || this.topic == null)
			return false;
		
		if(this.username.length() == 0 || this.forumName.length() == 0 || this.topic.length() == 0)
			return false;
		
		return true;	
	}
}
