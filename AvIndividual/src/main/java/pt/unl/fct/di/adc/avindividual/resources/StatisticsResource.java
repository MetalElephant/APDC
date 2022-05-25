package pt.unl.fct.di.adc.avindividual.resources;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import com.google.gson.Gson;

import com.google.cloud.datastore.*;

@Path("/statistics")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class StatisticsResource {

    //TODO have a function create user rather than doing it manually everytime (same for parcel)
	private static final Logger LOG = Logger.getLogger(StatisticsResource.class.getName());

	private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    //Create a stats entity with the key being the number of users/parcels in total
    //Add 1 to the count when a user/parcel is created and minus 1 when removed

	//Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	
	public StatisticsResource() {}

	@GET
	@Path("/users")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response userStatistics() {
		LOG.info("Attempt to read users related statistics.");



		return Response.ok(":)").build();
	}

    @GET
	@Path("/parcels")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response parcelStatistics() {
		LOG.info("Attempt to read parcels related statistics.");

		return Response.ok(" :) ").build();
	}
}
