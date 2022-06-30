package pt.unl.fct.di.adc.avindividual.resources;

import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.google.gson.Gson;

import pt.unl.fct.di.adc.avindividual.util.RemoveObjectData;
import pt.unl.fct.di.adc.avindividual.util.RequestData;
import pt.unl.fct.di.adc.avindividual.util.RewardData;
import pt.unl.fct.di.adc.avindividual.util.RewardUpdateData;
import pt.unl.fct.di.adc.avindividual.util.Roles;

import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;

@Path("/reward")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RewardResource {

    private static final Logger LOG = Logger.getLogger(ParcelResource.class.getName());
    private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    private UserResource ur = new UserResource();
    //private AdministrativeResource ar = new AdministrativeResource();
    
    // Reward info
    private static final String OWNER = "owner";
    private static final String REWARD_NAME = "name";
    private static final String DESCRIPTION = "description";
    private static final String PRICE = "points";
    private static final String NREDEEMED = "times redeemed";

    // Useful user info
    private static final String ROLE = "role";

    // Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String REWARD = "Reward";
    
    public RewardResource() { }

    @POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerReward(RewardData data) {
		LOG.info("Attempt to register reward: " + data.name);

		// Check if data was input correctly
		if(!data.isDataValid()) {
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		Transaction tn = datastore.newTransaction();

		Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
		Key rewardKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.owner)).setKind(REWARD).newKey(data.name);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.owner);

		try {
			Entity user = tn.get(ownerKey);
			Entity reward = tn.get(rewardKey);
			Entity token = tn.get(tokenKey);

			if(user == null) {
				LOG.warning("User " + data.owner + " does not exist");
				tn.rollback();

				return Response.status(Status.BAD_REQUEST).entity("User " + data.owner + " does not exist").build();
			}

            if (!ur.isLoggedIn(token, data.owner)){
				LOG.warning("User " + data.owner + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " not logged in.").build();
			}

            if(!isUserValid(user)) {
                LOG.warning("User " + data.owner + " isn't a merchant.");
				tn.rollback();

				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " isn't a merchant.").build();
            }

            if(reward != null) {
                LOG.warning("Reward name already exists.");
				tn.rollback();

				return Response.status(Status.CONFLICT).entity("Reward name already exists.").build();
            }

            reward = Entity.newBuilder(rewardKey)
                    .set(OWNER, data.owner)
                    .set(REWARD_NAME, data.name)
                    .set(DESCRIPTION, data.description)
                    .set(PRICE, data.price)
                    .set(NREDEEMED, "0")
                    .build();


            tn.add(reward);
            tn.commit();

            return Response.ok("Reward sucessfully added.").build();
		} finally {
            if(tn.isActive()) {
                tn.rollback();
            }
        }
	}

    @PUT
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateReward(RewardUpdateData data) {
        LOG.info("Attempting to modify reward " + data.name);

        // Check if the data is valid
        if(!data.isDataValid()) {
            return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
        } 

        Transaction tn = datastore.newTransaction();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
		Key rewardKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.owner)).setKind(REWARD).newKey(data.name);

        try {
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity owner = tn.get(ownerKey);
            Entity reward = tn.get(rewardKey);

            if (user == null) {
				LOG.warning("User " + data.username + " does not exist");
				tn.rollback();

				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}
				
			if (!ur.isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if (reward == null) {
				LOG.warning("Reward " + data.name + " doesn't exist.");
				tn.rollback();

				return Response.status(Status.NOT_FOUND).entity("Reward " + data.name + " doesn't exists.").build();
			}

            /*if(!ar.canModify(user, owner)) {
                LOG.warning("User " + data.username + " can't modify this.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " does not have authorization to change this reward.").build();
            }*/

            reward = Entity.newBuilder(rewardKey)
                    .set(OWNER, data.owner)
                    .set(REWARD_NAME, data.name)
                    .set(DESCRIPTION, data.description)
                    .set(PRICE, data.price)
                    .set(NREDEEMED, reward.getString(NREDEEMED)).build();

            tn.put(reward);
            tn.commit();

            return Response.ok("Reward updated.").build();
        } finally {
            if(tn.isActive()) {
                tn.rollback();
            }
        }
    }

    @DELETE
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeReward(RemoveObjectData data) {
        LOG.info("Attempt to remove reward: " + data.objectName);

		if(!data.isDataValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

        Transaction tn = datastore.newTransaction();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
		Key rewardKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.username)).setKind(REWARD).newKey(data.objectName);

        try {
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity reward = tn.get(rewardKey);
            Entity owner = tn.get(ownerKey);

            if (user == null) {
				LOG.warning("User " + data.username + " does not exist");
				tn.rollback();

				return Response.status(Status.BAD_REQUEST).entity("User " + data.username+ " does not exist").build();
			}
				
			if (!ur.isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if (reward == null) {
				LOG.warning("Reward " + data.username + " doesn't exist.");
				tn.rollback();

				return Response.status(Status.NOT_FOUND).entity("Reward " + data.objectName + " doesn't exists.").build();
			}

            /*if(!ar.canRemove(user, owner)) {
                LOG.warning("User " + data.username + " can't remove this reward.");
                tn.rollback();

                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " can't remove this reward.").build();
            }*/

            tn.delete(rewardKey);
            tn.commit();

            return Response.ok("Reward " + data.objectName + " deleted.").build();
        } finally {
            if(tn.isActive()) {
                tn.rollback();
            }
        }
    }

    @POST
    @Path("/info")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response rewardInfo(RequestData data) {
        LOG.fine("Attempting to show reward " + data.name);

		if(!data.isDataValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key rewardKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.username)).setKind(REWARD).newKey(data.name);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
			
		Entity user = datastore.get(userKey);
		Entity reward = datastore.get(rewardKey);
		Entity token = datastore.get(tokenKey);

        if (user == null) {
			LOG.warning("User " + data.username + " does not exist.");
	
			return Response.status(Status.FORBIDDEN).build();
		}

        if (!ur.isLoggedIn(token, data.username)){
            LOG.warning("User " + data.username + " not logged in.");
            return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
        }

        /*
         * It may not make sense for a user to be a merchant to see the rewards since normal users have access to them.
        if(!isUserValid(user)) {
            LOG.warning("User " + data.username + " isn't a merchant.");
            
            return Response.status(Status.FORBIDDEN).entity("User " + data.username + " isn't a merchant.").build();
        }
        */

        if (reward == null) {
            LOG.warning("Reward " + data.name + " doesn't exist.");

            return Response.status(Status.NOT_FOUND).entity("Reward " + data.name + " doesn't exists.").build();
        }

        RewardData r = new RewardData(reward.getString(REWARD_NAME), reward.getString(DESCRIPTION), reward.getString(OWNER), reward.getString(PRICE), reward.getString(NREDEEMED));

        return Response.ok(g.toJson(r)).build();
    }
    
    @POST
    @Path("/list")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response showUserReward(RequestData data) {
        LOG.info("Attempt to list rewards of user: " + data.username);

		if(!data.isUsernameValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		
		Entity user = datastore.get(userKey);
		Entity token = datastore.get(tokenKey);

        if (user == null) {				
			LOG.warning("User " + data.username + " does not exist");
			
			return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
		}

		if (!ur.isLoggedIn(token, data.username)){
            LOG.warning("User " + data.username + " not logged in.");
            return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
        }

        List<RewardData> rewardList = getQueries(data.username);

        return Response.ok(g.toJson(rewardList)).build();
    }

    private boolean isUserValid(Entity user) {
		
		String role = user.getString(ROLE);
		
        if(!role.equalsIgnoreCase(Roles.MERCHANT.name())) {
            return false;
        }

		return true;
	}

    private List<RewardData> getQueries(String owner){
		Query<Entity> queryReward = Query.newEntityQueryBuilder().setKind(REWARD)
					.setFilter(CompositeFilter.and(PropertyFilter.eq(OWNER, owner)))
					.build();

		QueryResults<Entity> rewards = datastore.run(queryReward);

		List<RewardData> userRewards = new LinkedList<>();

		rewards.forEachRemaining(reward -> {
			userRewards.add(new RewardData(reward.getString(REWARD_NAME), reward.getString(DESCRIPTION), reward.getString(OWNER), reward.getString(PRICE), reward.getString(NREDEEMED)));
		});

		return userRewards;
	}
}
    