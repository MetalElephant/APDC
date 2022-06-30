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

import pt.unl.fct.di.adc.avindividual.util.RequestData;

import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;

import com.google.cloud.datastore.*;

@Path("/stats")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class StatisticsResource {

	private static final Logger LOG = Logger.getLogger(StatisticsResource.class.getName());

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

	//Keys
	private static final String USER = "User";
	private static final String PARCEL = "Parcel";
	private static final String FORUM = "Forum";
	private static final String MESSAGE = "Message";
	private static final String STAT = "Statistics";

	//Statistics information
	private static final String VALUE = "Value";

	public StatisticsResource() {}

	public void updateStats(Key statKey, Entity stat, Transaction tn, boolean isAdd){
		long val = 1L;
		if (!isAdd)
			val = -val;
		
		if (stat != null){
			stat = Entity.newBuilder(statKey)
					.set(VALUE, val + stat.getLong(VALUE))
					.build();
				
			tn.put(stat);
		}
	}

	public void updateStats(Key statKey, Entity stat, Transaction tn, boolean isAdd, int counter){
		long val = counter;
		if (!isAdd)
			val = -val;
		
		if (stat != null){
			stat = Entity.newBuilder(statKey)
					.set(VALUE, val + stat.getLong(VALUE))
					.build();
				
			tn.put(stat);
		}
	}

	@GET
	@Path("/users")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userStatistics() {
		LOG.info("Attempt to read users related statistics.");

		Key usersKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

		Entity users = datastore.get(usersKey);

		String val = String.valueOf(users.getLong(VALUE));

		return Response.ok(val).build();
	}

    @GET
	@Path("/parcels")
	@Produces(MediaType.APPLICATION_JSON)
	public Response parcelStatistics() {
		LOG.info("Attempt to read parcels related statistics.");

		Key parcelKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);

		Entity parcel = datastore.get(parcelKey);

		String val = String.valueOf(parcel.getLong(VALUE));

		return Response.ok(val).build();
	}

	@GET
	@Path("/forums")
	@Produces(MediaType.APPLICATION_JSON)
	public Response forumStatistics() {
		LOG.info("Attempt to read forum related statistics.");

		Key forumKey = datastore.newKeyFactory().setKind(STAT).newKey(FORUM);

		Entity forums = datastore.get(forumKey);

		String val = String.valueOf(forums.getLong(VALUE));

		return Response.ok(val).build();
	}

	@POST
	@Path("/parcelsByRegion")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response parcelRegionStatistics(RequestData data) {
		LOG.info("Attempt to read parcels related statistics.");

		if (!data.isUsernameValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

		Query<Entity> statsQuery = Query.newEntityQueryBuilder().setKind(STAT)
								   .setFilter(CompositeFilter.and(PropertyFilter.eq("REGION", data.username)))//TODO not finished
								   .build();

		QueryResults<Entity> statsResult = datastore.run(statsQuery);

		long counter = 0;

		while(statsResult.hasNext()){
			Entity stat = statsResult.next();
			counter += stat.getLong(VALUE);
		}

		return Response.ok(counter).build();
	}

	@GET
	@Path("/userForum")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response userForumStatistics(RequestData data) {
		LOG.info("Attempt to read parcels related statistics.");

		Query<Entity> statsQuery = Query.newEntityQueryBuilder().setKind(STAT)
								   .setFilter(CompositeFilter.and(PropertyFilter.eq("REGION", data.username)))//TODO not finished
								   .build();

		QueryResults<Entity> statsResult = datastore.run(statsQuery);

		long counter = 0;

		while(statsResult.hasNext()){
			Entity stat = statsResult.next();
			counter += stat.getLong(VALUE);
		}

		return Response.ok(counter).build();
	}

	@GET
	@Path("/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response messagestatistics() {
		LOG.info("Attempt to read users related statistics.");

		Key msgKey = datastore.newKeyFactory().setKind(STAT).newKey(MESSAGE);

		Entity msg = datastore.get(msgKey);

		String val = String.valueOf(msg.getLong(VALUE));

		return Response.ok(val).build();
	}	
}
