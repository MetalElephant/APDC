package pt.unl.fct.di.adc.landit.util;

public class RemoveObjectData {

    public String username, owner, objectName;

    public RemoveObjectData(){}

    public RemoveObjectData(String username, String owner, String objectName){
        this.username = username;
        this.owner = owner;
        this.objectName = objectName;
    }

    public boolean isDataValid(){
        if (this.username == null || this.owner == null || this.objectName == null)
            return false;

        return this.username.length() != 0 && this.owner.length() !=0 && this.objectName.length() != 0;
    }
    
}
