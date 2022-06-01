package pt.unl.fct.di.adc.avindividual.resources;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import com.google.gson.Gson;

import pt.unl.fct.di.adc.avindividual.util.RequestData;

import com.google.cloud.datastore.*;

@Path("/stats")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class StatisticsResource {

	private static final Logger LOG = Logger.getLogger(StatisticsResource.class.getName());

	private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    //Create a stats entity with the key being the number of users/parcels in total
    //Add 1 to the count when a user/parcel is created and minus 1 when removed

	//Keys
	private static final String USER = "User";
	private static final String PARCEL = "Parcel";
	private static final String STAT = "Statistics";

	//Statistics information
	private static final String VALUE = "Value";

	public StatisticsResource() {}

	@GET
	@Path("/users")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response userStatistics() {
		LOG.info("Attempt to read users related statistics.");

		Key usersKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

		Entity users = datastore.get(usersKey);

		return Response.ok(users.getString(VALUE)).build();
	}

    @GET
	@Path("/parcels")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response parcelStatistics() {
		LOG.info("Attempt to read parcels related statistics.");

		Key parcelKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);

		Entity parcels = datastore.get(parcelKey);

		return Response.ok(parcels.getString(VALUE)).build();
	}

	@POST
	@Path("/parcelsByRegion")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response parcelRegionStatistics(RequestData data) {
		LOG.info("Attempt to read parcels related statistics.");

		if (!data.isUsernameValid())
		return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

		Key parcelKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);

		Entity parcels = datastore.get(parcelKey);

		return Response.ok(parcels.getString(VALUE)).build();
	}
}
