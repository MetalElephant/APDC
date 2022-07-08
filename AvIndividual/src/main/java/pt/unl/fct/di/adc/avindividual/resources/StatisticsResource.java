package pt.unl.fct.di.adc.avindividual.resources;

import java.util.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import com.google.cloud.datastore.Entity.Builder;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;

import pt.unl.fct.di.adc.avindividual.util.Roles;

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

	//User information
	private static final String NAME = "name";
	private static final String PASSWORD = "password";
	private static final String EMAIL = "email";
	private static final String ROLE = "role";
	private static final String MPHONE = "mobile phone";
	private static final String HPHONE = "home phone";
	private static final String ADDRESS = "address";
	private static final String NIF = "nif";
	private static final String PHOTO = "photo";
	private static final String SPEC = "specialization";
	private static final String CTIME = "creation time";
	private static final String NPARCELS = "number of parcels";
	private static final String NFORUMS = "number of forums";
	private static final String NMSGS = "number of messages";

	private static final String REWARD = "Reward";

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

	//For messages
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

	public void updateUserStats(Entity user, Transaction tn, boolean isAdd, int stat){
		long val = 1L;

		if (!isAdd)
			val = -val;

		long nParcels = user.getLong(NPARCELS);
		long nForums = user.getLong(NFORUMS);
		long nMsgs = user.getLong(NMSGS);

		switch(stat){
			case 1:
				nParcels += val;
			break;
			case 2:
				nForums += val;
			break;
			case 3:
				nMsgs += val;
			break;
			default:
			break;
		}

		
		Builder builder = Entity.newBuilder(user.getKey())
			.set(NAME, user.getString(NAME))
			.set(PASSWORD, user.getString(PASSWORD))
			.set(EMAIL, user.getString(EMAIL))
			.set(ROLE, user.getString(ROLE))
			.set(MPHONE, user.getString(MPHONE))
			.set(HPHONE, user.getString(HPHONE))
			.set(ADDRESS, user.getString(ADDRESS))
			.set(NIF, user.getString(NIF))
			.set(PHOTO, user.getString(PHOTO))
			.set(SPEC, user.getString(SPEC))
			.set(NPARCELS, nParcels)
			.set(NFORUMS, nForums)
			.set(NMSGS, nMsgs)
			.set(CTIME, user.getTimestamp(CTIME));

		user = builder.build();
				
		tn.put(user);
		
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

		Query<Entity> statsQuery = Query.newEntityQueryBuilder().setKind(USER)
										.setFilter(PropertyFilter.eq(ROLE, Roles.PROPRIETARIO.getRole()))
										.build();
							
		long[] max = new long[] {-1};
		String[] username = new String[] {"Username"};

		QueryResults<Entity> query = datastore.run(statsQuery);

		query.forEachRemaining(user -> {
			long nParcels = user.getLong(NPARCELS);

			if (nParcels > max[0]){
				max[0] = nParcels;
				username[0] = user.getKey().getName();
			}
		});

		return Response.ok(username).build();
	}

	@GET
	@Path("/userMostForums")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userMostForumsStatistics() {
		LOG.info("Attempt to read user related statistics.");

		Query<Entity> statsQuery = Query.newEntityQueryBuilder().setKind(USER).build();
							
		long[] max = new long[] {-1};
		String[] username = new String[] {"Username"};

		QueryResults<Entity> query = datastore.run(statsQuery);

		query.forEachRemaining(user -> {
			long nForums = user.getLong(NFORUMS);

			if (nForums > max[0]){
				max[0] = nForums;
				username[0] = user.getKey().getName();
			}
		});

		return Response.ok(username).build();
	}

	@GET
	@Path("/userMostMessages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response userMostMessagesStatistics() {
		LOG.info("Attempt to read user related statistics.");

		Query<Entity> statsQuery = Query.newEntityQueryBuilder().setKind(USER).build();
							
		long[] max = new long[] {-1};
		String[] username = new String[] {"Username"};

		QueryResults<Entity> query = datastore.run(statsQuery);

		query.forEachRemaining(user -> {
			long nMsgs = user.getLong(NMSGS);

			if (nMsgs > max[0]){
				max[0] = nMsgs;
				username[0] = user.getKey().getName();
			}
		});

		return Response.ok(username).build();
	}
}
