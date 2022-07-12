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
	private static final String USER = "Utilizador";
	private static final String PARCEL = "Parcela";
	private static final String FORUM = "Fórum";
	private static final String MESSAGE = "Mensagem";
	private static final String STAT = "Estatística";

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

	//Statistics information
	private static final String VALUE = "Valor";

	public StatisticsResource() {}

	// Updates a statistic
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

	// Removes the statistics related to a foruns messages
	public void removeMsgStats(Key statKey, Entity stat, Transaction tn, int counter){
		long val = -counter;
		
		if (stat != null){
			stat = Entity.newBuilder(statKey)
					.set(VALUE, val + stat.getLong(VALUE))
					.build();
				
			tn.put(stat);
		}
	}

	// Updates the statistics related to a given user
	public void updateUserStats(Entity user, Transaction tn, boolean isAdd, int stat){
		long val = 1L;

		if (!isAdd)
			val = -val;

		long nParcelsCrt = user.getLong(NPARCELSCRT);
		long nForums = user.getLong(NFORUMS);
		long nMsgs = user.getLong(NMSGS);

		switch(stat){
			case 1:
				nParcelsCrt += val;
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
		
		long nParcelsCo = user.getLong(NPARCELSCO);

		Builder build = Entity.newBuilder(user.getKey())
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
			.set(POINTS, user.getLong(POINTS))
			.set(NPARCELSCRT, nParcelsCrt)
			.set(NPARCELSCO, nParcelsCo)
			.set(NFORUMS, nForums)
			.set(NMSGS, nMsgs)
			.set(CTIME, user.getTimestamp(CTIME));

		for(long i = 0; i < nParcelsCo; i++){
			build.set(PARCEL+i, user.getString(PARCEL+i));
		}

		user = build.build();
				
		tn.put(user);
	}

	// Updated the statistics of a parcel's forum
	public void updateParcelForumStats(Entity user, boolean isAdd, boolean addPoints, Transaction tn){	
		long val = 1L;

		if (!isAdd)
			val = -1L;

		long nParcelsCo = user.getLong(NPARCELSCO);

		int p = 0;

		if(addPoints) p += 1500;

		Builder build = Entity.newBuilder(user.getKey())
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
        	.set(POINTS, user.getLong(POINTS) + p)
			.set(NPARCELSCRT, user.getLong(NPARCELSCRT) + val)
			.set(NPARCELSCO, nParcelsCo)
			.set(NFORUMS, user.getLong(NFORUMS) + val)
			.set(NMSGS, user.getLong(NMSGS))
			.set(CTIME, user.getTimestamp(CTIME));

		for(long i = 0; i < nParcelsCo; i++){
			build.set(PARCEL+i, user.getString(PARCEL+i));
		}

		user = build.build();
				
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
			long nParcels = user.getLong(NPARCELSCRT) + user.getLong(NPARCELSCO);

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
