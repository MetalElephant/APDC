package pt.unl.fct.di.adc.landit.util;

public class ForumRemoveData {

    public String username, owner, name;

    public ForumRemoveData() {}
    
    public ForumRemoveData(String username, String owner, String name) {
        this.username = username;
        this.owner = owner;
        this.name = name;
    }

    public boolean isDataValid() {
        if (this.name == null || this.owner == null || this.username == null)
            return false;
        
        return this.name.length() != 0 && this.owner.length() != 0 && this.username.length() != 0;
    }
    
}
