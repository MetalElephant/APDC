package pt.unl.fct.di.adc.avindividual.util;

public class RewardUpdateData {

    public String username, name, description, owner, price;

    public RewardUpdateData() {}

    public RewardUpdateData(String username, String name, String description, String owner, String price) {
        this.username = username;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.price = price; // the minimum price is 1000 points
    }

    public boolean isDataValid() {
        if(username != null || name != null || description != null || owner != null) {
            return false;
        }

        if(username.length() == 0 || name.length() == 0 || description.length() == 0 || owner.length() == 0) {
            return false;
        }

        if(Integer.parseInt(price) < 1000) {
            return false;
        }

        return true;
    }
}
