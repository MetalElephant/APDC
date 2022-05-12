package pt.unl.fct.di.adc.avindividual.resources;

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
import com.google.cloud.datastore.Entity.Builder;
import com.google.gson.Gson;

import pt.unl.fct.di.adc.avindividual.util.RequestData;
import pt.unl.fct.di.adc.avindividual.util.RewardData;
import pt.unl.fct.di.adc.avindividual.util.Roles;

import com.google.cloud.datastore.*;

@Path("/reward")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RewardResource {

    private static final Logger LOG = Logger.getLogger(ParcelResource.class.getName());
    private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    private UserResource ur = new UserResource();
    
    // Reward info
    private static final String OWNER = "owner";
    private static final String REWARD_NAME = "name";
    private static final String DESCRIPTION = "description";
    private static final String PRICE = "points";

    // Useful user info
    private static final String ROLE = "role";

    // Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String REWARD = "Reward";
    
    @POST
	@Path("/registerReward")
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

            if (!ur.isLoggedIn(token, tn)){
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

            Builder builder = Entity.newBuilder(rewardKey)
                    .set(OWNER, data.owner)
                    .set(REWARD_NAME, data.name)
                    .set(DESCRIPTION, data.description)
                    .set(PRICE, data.price);

            reward = builder.build();

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
    @Path("/updateReward")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateReward(RewardData data) {
        LOG.info("Attempting to modify reward " + data.name);

        // Check if the data is valid
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

            if (user == null) {
				LOG.warning("User " + data.owner + " does not exist");
				tn.rollback();

				return Response.status(Status.BAD_REQUEST).entity("User " + data.owner + " does not exist").build();
			}
				
			if (!ur.isLoggedIn(token, tn)){
				LOG.warning("User " + data.owner + " not logged in.");
				tn.rollback();

				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " not logged in.").build();
			}

            if(!isUserValid(user)) {
                LOG.warning("User " + data.owner + " isn't a merchant.");
				tn.rollback();

				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " isn't a merchant.").build();
            }

			if (reward == null) {
				LOG.warning("Reward " + data.name + " doesn't exist.");
				tn.rollback();

				return Response.status(Status.NOT_FOUND).entity("Reward " + data.name + " doesn't exists.").build();
			}

            Builder builder = Entity.newBuilder(rewardKey)
                    .set(OWNER, data.owner)
                    .set(REWARD_NAME, data.name)
                    .set(DESCRIPTION, data.description)
                    .set(PRICE, data.price);

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
    @Path("/removeReward")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeReward(RequestData data) {
        LOG.info("Attempt to remove reward: " + data.name);

        Transaction tn = datastore.newTransaction();

        Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key rewardKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.username)).setKind(REWARD).newKey(data.name);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);

        try {
            Entity user = tn.get(ownerKey);
            Entity reward = tn.get(rewardKey);
            Entity token = tn.get(tokenKey);

            if (user == null) {
				LOG.warning("User " + data.username + " does not exist");
				tn.rollback();

				return Response.status(Status.BAD_REQUEST).entity("User " + data.username+ " does not exist").build();
			}
				
			if (!ur.isLoggedIn(token, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();

				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

            if(!isUserValid(user)) {
                LOG.warning("User " + data.username + " isn't a merchant.");
				tn.rollback();

				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " isn't a merchant.").build();
            }

			if (reward == null) {
				LOG.warning("Reward " + data.username + " doesn't exist.");
				tn.rollback();

				return Response.status(Status.NOT_FOUND).entity("Reward " + data.name + " doesn't exists.").build();
			}

            tn.delete(rewardKey);
            tn.commit();

            return Response.ok("Reward " + data.name + " deleted.").build();
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
        // TODO

        return Response.ok().build();
    }

    private boolean isUserValid(Entity user) {
		
		String role = user.getString(ROLE);
		
        if(!role.equalsIgnoreCase(Roles.MER.name())) {
            return false;
        }

		return true;
	}
}
    