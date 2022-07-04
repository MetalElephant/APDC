package pt.unl.fct.di.adc.avindividual.util;

import com.google.cloud.datastore.Entity;

public class RewardData {

    // Reward info
    private static final String REWARD_NAME = "name";
    private static final String DESCRIPTION = "description";
    private static final String PRICE = "points";

    public String name, description, owner;
    public int price, timesRedeemed;

    public RewardData() {}

    public RewardData(String name, String description, String owner, int timesRedeemed, int price) {
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.price = price; // the minimum price is 1000 points
        this.timesRedeemed = timesRedeemed;
    }

    public boolean isDataValid() {
        if(name == null || description == null || owner == null) {
            return false;
        }

        if(name.length() == 0 || description.length() == 0 || owner.length() == 0) {
            return false;
        }

        if(price < 1000) {
            return false;
        }

        return true;
    }
}
