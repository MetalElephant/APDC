package pt.unl.fct.di.adc.avindividual.util;

import com.google.cloud.datastore.Entity;

public class RewardData {

    // Reward info
    private static final String REWARD_NAME = "name";
    private static final String DESCRIPTION = "description";
    private static final String PRICE = "points";

    public String name, description, owner, price;

    public RewardData(String name, String description, String owner, String price) {
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.price = price; // the minimum price is 1000 points
    }

    public boolean isDataValid() {
        if(name != null || description != null || owner != null) {
            return false;
        }

        if(name.length() == 0 || description.length() == 0 || owner.length() == 0) {
            return false;
        }

        if(Integer.parseInt(price) < 1000) {
            return false;
        }

        return true;
    }

    public void removeNulls(Entity modified) {
		if(this.name == null) {
			this.name = modified.getString(REWARD_NAME);
		}
		
		if(this.description == null) {
			this.description = modified.getString(DESCRIPTION);
		}
		
		if(this.price == null) {
			this.price = modified.getString(PRICE);
		}
	}
}
