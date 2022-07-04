package pt.unl.fct.di.adc.avindividual.resources;

import java.util.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

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

	@GET
	@Path("/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response messageStatistics() {
		LOG.info("Attempt to read forum related statistics.");

		Key msgKey = datastore.newKeyFactory().setKind(STAT).newKey(MESSAGE);

		Entity msgs = datastore.get(msgKey);

		String val = String.valueOf(msgs.getLong(VALUE));

		return Response.ok(val).build();
	}

	@GET
	@Path("/averageParcels")
	@Produces(MediaType.APPLICATION_JSON)
	public Response averageParcelStatistics() {
		LOG.info("Attempt to read parcels related statistics.");

		Key parcelKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);
		Key usersKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

		Entity parcel = datastore.get(parcelKey);
		Entity users = datastore.get(usersKey);

		double val1 = parcel.getLong(VALUE);
		double val2 = users.getLong(VALUE);
		double aux = val1/val2;
		
		String res = String.format("%.1f", aux);

		return Response.ok(res).build();
	}

	@GET
	@Path("/averageForums")
	@Produces(MediaType.APPLICATION_JSON)
	public Response averageForumStatistics() {
		LOG.info("Attempt to read forum related statistics.");

		Key forumKey = datastore.newKeyFactory().setKind(STAT).newKey(FORUM);
		Key usersKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

		Entity forum = datastore.get(forumKey);
		Entity users = datastore.get(usersKey);

		double val1 = forum.getLong(VALUE);
		double val2 = users.getLong(VALUE);
		double aux = val1/val2;
		
		String res = String.format("%.1f", aux);

		return Response.ok(res).build();
	}

	@GET
	@Path("/averageMessages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response averageMessageStatistics() {
		LOG.info("Attempt to read forum related statistics.");

		Key msgKey = datastore.newKeyFactory().setKind(STAT).newKey(MESSAGE);
		Key usersKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

		Entity msg = datastore.get(msgKey);
		Entity users = datastore.get(usersKey);

		double val1 = msg.getLong(VALUE);
		double val2 = users.getLong(VALUE);
		double aux = val1/val2;

		String res = String.format("%.1f", aux);

		return Response.ok(res).build();
	}

	@GET
	@Path("/userMostParcels")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userMostParcelsStatistics() {
		LOG.info("Attempt to read user related statistics.");

		//TODO
		Query<Entity> statsQuery = Query.newEntityQueryBuilder().setKind(PARCEL).build();

		return Response.ok().build();
	}

	@GET
	@Path("/userMostForums")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userMostForumsStatistics() {
		LOG.info("Attempt to read user related statistics.");

		//TODO
		Query<Entity> statsQuery = Query.newEntityQueryBuilder().setKind(PARCEL).build();

		return Response.ok().build();
	}

	@GET
	@Path("/userMostMessages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userMostMessagesStatistics() {
		LOG.info("Attempt to read user related statistics.");

		//TODO
		Query<Entity> statsQuery = Query.newEntityQueryBuilder().setKind(PARCEL).build();

		return Response.ok().build();
	}
}
