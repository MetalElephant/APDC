package pt.unl.fct.di.adc.landit.resources;

import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.google.gson.Gson;

import pt.unl.fct.di.adc.landit.util.RemoveObjectData;
import pt.unl.fct.di.adc.landit.util.RequestData;
import pt.unl.fct.di.adc.landit.util.RewardData;
import pt.unl.fct.di.adc.landit.util.RewardRedeemData;
import pt.unl.fct.di.adc.landit.util.RewardUpdateData;
import pt.unl.fct.di.adc.landit.util.Roles;

import com.google.cloud.datastore.Entity.Builder;
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
    private static final String OWNER = "Dono";
    //private static final String REWARD_NAME = "Nome";
    private static final String DESCRIPTION = "Descrição";
    private static final String PRICE = "Preço";
    private static final String NREDEEMED = "Vezes resgatado";

	//User information
	private static final String NAME = "Nome";
	private static final String PASSWORD = "Password";
	private static final String EMAIL = "Email";
	private static final String ROLE = "Papel";
	private static final String MPHONE = "Telemóvel";
	private static final String HPHONE = "Telefone";
	private static final String DISTRICT = "Distrito";
	private static final String COUNTY = "Concelho";
	private static final String AUTARCHY = "Freguesia";
	private static final String STREET = "Rua";
	private static final String NIF = "NIF";
	private static final String POINTS = "Pontos";
	private static final String PHOTO = "Foto";
	private static final String NPARCELSCRT = "Núm de parcelas criadas";
	private static final String NPARCELSCO = "Núm de parcelas co-propriedade";
	private static final String NFORUMS = "Número de fóruns";
	private static final String NMSGS = "Número de mensagens";
	private static final String CTIME = "Tempo da criação";

    // Keys
	private static final String USER = "Utilizador";
    private static final String TOKEN = "Token";
	private static final String REWARD = "Recompensa";
    private static final String SECRET = "Segredo";
    
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
				return Response.status(Status.BAD_REQUEST).entity("User " + data.owner + " does not exist").build();
			}

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!ur.isLoggedIn(secret, token, data.owner, tn)){
				LOG.warning("User " + data.owner + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " not logged in.").build();
			}

            if(!isUserValid(user)) {
                LOG.warning("User " + data.owner + " isn't a merchant.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " isn't a merchant.").build();
            }

            if(reward != null) {
                LOG.warning("Reward name already exists.");
				tn.rollback();

				return Response.status(Status.CONFLICT).entity("Reward name already exists.").build();
            }

            reward = Entity.newBuilder(rewardKey)
                    .set(OWNER, data.owner)
                    .set(NAME, data.name)
                    .set(DESCRIPTION, data.description)
                    .set(PRICE, data.price)
                    .set(NREDEEMED, 0)
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
				return Response.status(Status.NOT_FOUND).entity("User " + data.username + " does not exist").build();
			}

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!ur.isLoggedIn(secret, token, data.username, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if (reward == null) {
				LOG.warning("Reward " + data.name + " doesn't exist.");
				return Response.status(Status.NOT_FOUND).entity("Reward " + data.name + " doesn't exists.").build();
			}

            if(!canModifyOrRemove(user, owner)) {
                LOG.warning("User " + data.username + " can't modify this.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " does not have authorization to change this reward.").build();
            }

            Builder builder = Entity.newBuilder(rewardKey)
                    .set(OWNER, data.owner)
                    .set(NAME, data.name)
                    .set(DESCRIPTION, data.description)
                    .set(PRICE, data.price)
                    .set(NREDEEMED, reward.getLong(NREDEEMED));

			for(int i = 0; i < reward.getLong(NREDEEMED); i++) {
				builder.set(USER + i, reward.getString(USER + i));
			}

			builder.set(USER + reward.getLong(NREDEEMED), data.username);

			reward = builder.build();

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
		Key rewardKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.owner)).setKind(REWARD).newKey(data.objectName);

        try {
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity reward = tn.get(rewardKey);
            Entity owner = tn.get(ownerKey);

            if (user == null) {
				LOG.warning("User " + data.username + " does not exist");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username+ " does not exist").build();
			}

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!ur.isLoggedIn(secret, token, data.username, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if (reward == null) {
				LOG.warning("Reward " + data.objectName + " doesn't exist.");
				return Response.status(Status.NOT_FOUND).entity("Reward " + data.objectName + " doesn't exists.").build();
			}

            if(!canModifyOrRemove(user, owner)) {
                LOG.warning("User " + data.username + " can't remove this reward.");
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " can't remove this reward.").build();
            }

            tn.delete(rewardKey);
            tn.commit();

            return Response.ok("Reward " + data.objectName + " deleted.").build();
        } finally {
            if(tn.isActive()) {
                tn.rollback();
            }
        }
    }

	@PUT
    @Path("/redeem")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response redeemReward(RewardRedeemData data) {
	    LOG.info("Attempting to redeem reward " + data.reward);

	    if(!data.isDataValid()){
	    	return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
	    }

	    Transaction tn = datastore.newTransaction();

	    Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
	    Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
	    Key rewardKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.owner)).setKind(REWARD).newKey(data.reward);
	
	    try {
		    Entity user = tn.get(userKey);
		    Entity token = tn.get(tokenKey);
		    Entity reward = tn.get(rewardKey);

	    	if(user == null) {
		    	LOG.warning("User " + data.username + " does not exist.");
	    		return Response.status(Status.NOT_FOUND).entity("User " + data.username + " does not exist.").build();
		    }

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!ur.isLoggedIn(secret, token, data.username, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

		    if(reward == null) {
	    	    LOG.warning("Reward " + data.reward + " does not exist.");
	        	return Response.status(Status.NOT_FOUND).entity("Reward " + data.reward + " does not exist.").build();
	    	}

			if(!canUserRedeemReward(data.username, user.getString(COUNTY), reward)) {
				LOG.warning("User " + data.username + " has already redeemed the reward.");
	        	return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " has already redeemed the reward.").build();
			}

	    	long points = user.getLong(POINTS) - reward.getLong(PRICE);

	    	if(points < 0) {
	    		LOG.warning("User " + data.username + " does not have enough points to redeem this reward.");
	    		return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not have enough points to redeem this reward.").build();
	    	}

    		Builder builderUser = Entity.newBuilder(userKey)
				.set(NAME, user.getString(NAME))
				.set(PASSWORD, user.getString(PASSWORD))
				.set(EMAIL, user.getString(EMAIL))
				.set(ROLE, user.getString(ROLE))
				.set(DISTRICT, user.getString(DISTRICT))
				.set(COUNTY, user.getString(COUNTY))
				.set(AUTARCHY, user.getString(AUTARCHY))
				.set(STREET, user.getString(STREET))
				.set(MPHONE, user.getString(MPHONE))
				.set(HPHONE, user.getString(HPHONE))
				.set(NIF, user.getString(NIF))
				.set(PHOTO, user.getString(PHOTO))
				.set(POINTS, points)
				.set(NPARCELSCRT, user.getLong(NPARCELSCRT))
				.set(NPARCELSCO, user.getLong(NPARCELSCO))
				.set(NFORUMS, user.getLong(NFORUMS))
				.set(NMSGS, user.getLong(NMSGS))
				.set(CTIME, user.getTimestamp(CTIME));

	    	user = builderUser.build();

			long length = reward.getLong(NREDEEMED);

		    Builder builderReward = Entity.newBuilder(rewardKey)
		    		.set(OWNER, reward.getString(OWNER))
	    			.set(NAME, reward.getString(NAME))
    				.set(DESCRIPTION, reward.getString(DESCRIPTION))
				    .set(PRICE, reward.getLong(PRICE))
			    	.set(NREDEEMED, length + 1L);

			for(int i = 0; i < length; i++) {
				builderReward.set(USER + i, reward.getString(USER + i));
			}

			builderReward.set(USER + length, data.username);

		    reward = builderReward.build();

		    tn.put(user, reward);

		    tn.commit();

	    	return Response.ok("Successful redeem.").build();
    	} finally {
		    if (tn.isActive())
		    	tn.rollback();
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

		Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
		Entity secret = datastore.get(secretKey);

		if (!ur.isLoggedIn(secret, token, data.username, datastore.newTransaction())){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}

        if (reward == null) {
            LOG.warning("Reward " + data.name + " doesn't exist.");
            return Response.status(Status.NOT_FOUND).entity("Reward " + data.name + " doesn't exists.").build();
        }

        RewardData r = new RewardData(reward.getString(NAME), reward.getString(DESCRIPTION), reward.getString(OWNER), (int) reward.getLong(PRICE), (int) reward.getLong(NREDEEMED));

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

        Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
		Entity secret = datastore.get(secretKey);

		if (!ur.isLoggedIn(secret, token, data.username, datastore.newTransaction())){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}

        List<RewardData> rewardList = getQueries(data.username);

        return Response.ok(g.toJson(rewardList)).build();
    }

	@GET
    @Path("/listAll")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response showAllRewards() {
        LOG.info("Attempt to list all rewards");
        return Response.ok(g.toJson(allRewards())).build();
    }

	@POST
    @Path("/listRedeemable")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	@Consumes(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response showRedeemableRewards(RequestData data) {
        LOG.info("Attempt to list redeemable rewards for " + data.username);

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Entity user = datastore.get(userKey);

        if(user == null) {
            LOG.warning("User " + data.username + " does not exist");
            return Response.status(Status.NOT_FOUND).entity("User " + data.username + " does not exist").build();
        }

		List<RewardData> list = rewardsUserCanRedeem(data.username, user.getString(COUNTY));

        return Response.ok(g.toJson(list)).build();
    }

	@POST
    @Path("/listRedeemed")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Consumes(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response showRedeemedRewards(RequestData data) {
        LOG.info("Attempt to list redeemable rewards for " + data.username);

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Entity user = datastore.get(userKey);

        if(user == null) {
            LOG.warning("User " + data.username + " does not exist");
            return Response.status(Status.NOT_FOUND).entity("User " + data.username + " does not exist").build();
        }

        List<RewardData> list = rewardsUserHasRedeemed(data.username);

        return Response.ok(g.toJson(list)).build();
    }

	// Checks if given user if of role COMERCIANTE
    private boolean isUserValid(Entity user) {
		
		String role = user.getString(ROLE);
		
        if(!role.equalsIgnoreCase(Roles.COMERCIANTE.getRole())) {
            return false;
        }

		return true;
	}

	// Checks how two given entities should interact
    private boolean canModifyOrRemove(Entity e1, Entity e2) {
		Roles e1Role = Roles.valueOf(e1.getString(ROLE));

		switch(e1Role) {
			case SUPERUSER:
            case MODERADOR:
				return true;
            case COMERCIANTE:
				if(e1.getKey().getName().equals(e2.getKey().getName()))
					return true;
				break;
			case PROPRIETARIO:
			case REPRESENTANTE:
			default:
				break;
		}

		return false;
	}

	// Returns a list with all the rewards created by a given entity
    private List<RewardData> getQueries(String owner){
		Query<Entity> queryReward = Query.newEntityQueryBuilder().setKind(REWARD)
					.setFilter(CompositeFilter.and(PropertyFilter.eq(OWNER, owner)))
					.build();

		QueryResults<Entity> rewards = datastore.run(queryReward);

		List<RewardData> userRewards = new LinkedList<>();

		rewards.forEachRemaining(reward -> {
			userRewards.add(new RewardData(reward.getString(NAME), reward.getString(DESCRIPTION), reward.getString(OWNER), (int) reward.getLong(PRICE), (int) reward.getLong(NREDEEMED)));
		});

		return userRewards;
	}

	// Returns a list with all the rewards that have been created
	private List<RewardData> allRewards() {
		Query<Entity> queryReward = Query.newEntityQueryBuilder().setKind(REWARD).build();

        QueryResults<Entity> rewards = datastore.run(queryReward);

		List<RewardData> rewardsList = new LinkedList<>();

		rewards.forEachRemaining(reward -> {
			rewardsList.add(new RewardData(reward.getString(NAME), reward.getString(DESCRIPTION), reward.getString(OWNER), (int) reward.getLong(NREDEEMED), (int) reward.getLong(PRICE)));
		});

		return rewardsList;
	}
	
	// Checks if a user can redeem a reward, based on their county
	private boolean canUserRedeemReward(String user, String county, Entity reward) {
		List<RewardData> rewards = rewardsUserCanRedeem(user, county);

		for (RewardData r : rewards) {
			if(r.name.equals(reward.getString(NAME))) {
				return true;
			}
		}

		return false;
	}

	// Returns a list with all the rewards the user can redeem
	private List<RewardData> rewardsUserCanRedeem(String username, String county) {
		Query<Entity> queryReward = Query.newEntityQueryBuilder().setKind(REWARD).build();

        QueryResults<Entity> rewards = datastore.run(queryReward);

		List<RewardData> rewardsList = new LinkedList<>();

		rewards.forEachRemaining(reward -> {
			if(!hasRedeemed(username, reward) && sameCounty(county, reward)) {
				rewardsList.add(new RewardData(reward.getString(NAME), reward.getString(DESCRIPTION), reward.getString(OWNER), (int) reward.getLong(PRICE), (int) reward.getLong(NREDEEMED)));
			}
		});

		return rewardsList;
	}

	// Checks if a given county is the same one as the given reward's owner
	private boolean sameCounty(String county, Entity reward) {
		Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(reward.getString(OWNER));
		Entity owner = datastore.get(ownerKey);

		if(county.equals(owner.getString(COUNTY))) {
				return true;
		}

		return false;
	}

	// Returns a list with all the rewards a user has already redeemed
	private List<RewardData> rewardsUserHasRedeemed(String username) {
        Query<Entity> queryReward = Query.newEntityQueryBuilder().setKind(REWARD).build();

        QueryResults<Entity> rewards = datastore.run(queryReward);

        List<RewardData> rewardsList = new LinkedList<>();

        rewards.forEachRemaining(reward -> {
            if(hasRedeemed(username, reward)) {
                rewardsList.add(new RewardData(reward.getString(NAME), reward.getString(DESCRIPTION), reward.getString(OWNER), (int) reward.getLong(PRICE), (int) reward.getLong(NREDEEMED)));
            }
        });

        return rewardsList;
    }

	// Checks if a user, given their username, has already redeemed a given reward
	private boolean hasRedeemed(String username, Entity reward) {
		long nUsers = reward.getLong(NREDEEMED);

		for(long i = 0; i < nUsers; i++) {
			if(reward.getString(USER + i).equals(username)) {
				return true;
			}
		}

		return false;
	}
}