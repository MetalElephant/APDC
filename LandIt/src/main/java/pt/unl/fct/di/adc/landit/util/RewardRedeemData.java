package pt.unl.fct.di.adc.landit.util;

public class RewardRedeemData {
    public String username, owner, reward;

    public RewardRedeemData() {}

    public RewardRedeemData(String username, String owner, String reward) {
        this.username = username;
        this.owner = owner;
        this.reward = reward;
    }

    public boolean isDataValid() {
        if (this.username == null || this.owner == null || this.reward== null)
            return false;
        
        return this.username.length() != 0 && this.owner.length() != 0 && this.reward.length() != 0;
    }
}