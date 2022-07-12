package pt.unl.fct.di.adc.avindividual.resources;

import java.awt.geom.Line2D;
import java.io.IOException;
import java.util.Calendar;
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

import com.google.cloud.datastore.Entity.Builder;
import com.google.gson.Gson;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import pt.unl.fct.di.adc.avindividual.util.ParcelUpdateData;
import pt.unl.fct.di.adc.avindividual.util.ParcelVerifyData;
import pt.unl.fct.di.adc.avindividual.util.RemoveObjectData;
import pt.unl.fct.di.adc.avindividual.util.ParcelData;
import pt.unl.fct.di.adc.avindividual.util.ParcelSearchPositionData;
import pt.unl.fct.di.adc.avindividual.util.ParcelSearchRegionData;
import pt.unl.fct.di.adc.avindividual.util.RequestData;
import pt.unl.fct.di.adc.avindividual.util.Roles;
import pt.unl.fct.di.adc.avindividual.util.Info.OwnerInfo;
import pt.unl.fct.di.adc.avindividual.util.Info.ParcelInfo;

import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;


@Path("/parcel")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class ParcelResource {

    private static final Logger LOG = Logger.getLogger(ParcelResource.class.getName());
    private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    private UserResource ur = new UserResource();
	//private AdministrativeResource ar = new AdministrativeResource();
	private StatisticsResource sr = new StatisticsResource();
	
	static final String SENDGRID_API_KEY = "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";
	static final String SENDGRID_SENDER = "app.land.it@gmail.com";

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

	//Parcel info
	private static final String OWNER = "Dono";
	private static final String NOWNERS = "Número de co-donos";
	//private static final String DISTRICT = "Distrito";
	//private static final String COUNTY = "Concelho";
	//private static final String AUTARCHY = "Freguesia";
	private static final String DESCRIPTION = "Descrição";
	private static final String GROUND_COVER_TYPE = "Tipo de solo";
	private static final String CURR_USAGE = "Uso atual";
	private static final String PREV_USAGE = "Uso prévio";
	private static final String AREA = "Área";
	private static final String CONFIRMATION = "Confirmação";
	private static final String CONFIRMED = "Confirmado";
    private static final String NMARKERS = "Número de marcadores";
	private static final String MARKER = "Marcador";

	//Bucket information
	private static final String PROJECT_ID = "Land It";
    private static final String BUCKET_NAME = "landit-app.appspot.com";
    private static final String URL =  "https://storage.googleapis.com/landit-app.com/";

	//Keys
	private static final String USER = "Utilizador";
    private static final String TOKEN = "Token";
	private static final String FORUM = "Fórum";
	private static final String PARCEL = "Parcela";
	private static final String STAT = "Estatística";
	private static final String SECRET = "Segredo";

	private static final boolean ADD = true;

	private static final String TOPIC = "Tópico";
    private static final String CRT_DATE = "Data de criação";
	private static final String PARCEL_TOPIC = "Discussão da parcela";

	private static final double ERROR = 0.8798618961777017;

	public ParcelResource() { }
	
    @POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerParcel(ParcelData data) {
		LOG.info("Attempting to register parcel " + data.parcelName);
		
		if (!data.isDataValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		
		Transaction tn = datastore.newTransaction();
				
		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
		Key parcelKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.owner)).setKind(PARCEL).newKey(data.parcelName);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.owner);
		
		try {
			Entity user = tn.get(userKey);
			Entity parcel = tn.get(parcelKey);
			Entity token = tn.get(tokenKey);

			if (user == null) {
				LOG.warning("User " + data.owner + " does not exist");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.owner + " does not exist").build();
			}
				
			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!ur.isLoggedIn(secret, token, data.owner, tn)){
				LOG.warning("User " + data.owner + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " not logged in.").build();
			}

			if (parcel != null) {
				LOG.warning("Parcel name already exists.");
				return Response.status(Status.CONFLICT).entity("Parcel name already exists.").build();
			}

			if (!validUsers(data.owners, tn)){
				LOG.warning("Username of owners invalid.");
				return Response.status(Status.BAD_REQUEST).entity("Username of one or more owners invalid.").build();
			}

			LatLng[] markers = new LatLng[data.allLats.length];

			for(int i = 0; i< data.allLats.length; i++) {
				markers[i] = LatLng.of(data.allLats[i], data.allLngs[i]);
			}
			
			if(isOverlapped(markers)){
				LOG.warning("Parcel overlaps with another parcel.");
				return Response.status(Status.CONFLICT).entity("Parcel overlaps with another parcel.").build();
			}
			
			Builder builder = Entity.newBuilder(parcelKey)
					.set(COUNTY, data.county)
					.set(DISTRICT, data.district)
					.set(AUTARCHY, data.autarchy)
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, getArea(markers))
					.set(CONFIRMATION, uploadConfirmation(data.owner + ":" + data.parcelName, data.confirmation, data.type))
					.set(CONFIRMED, false)
                    .set(NMARKERS, String.valueOf(data.allLats.length))
					.set(NOWNERS, String.valueOf(data.owners.length));
			
			for(int i = 0; i < data.owners.length; i++){
				builder.set(OWNER+i, data.owners[i]);
			}
			
			for(int i = 0; i< markers.length; i++) {
				builder.set(MARKER+i, markers[i]);
			}

			parcel = builder.build();
			
			tn.add(parcel);
			tn.commit();
			
			return Response.ok("Parcel sucessfully added.").build();

		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}
	
	@PUT
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateParcel(ParcelUpdateData data) {
		LOG.info("Attempting to modify parcel " + data.parcelName);

		if (!data.isDataValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		Key parcelKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.owner)).setKind(PARCEL).newKey(data.parcelName);
		Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
		
		try {
			Entity user = tn.get(userKey);
			Entity token = tn.get(tokenKey);
			Entity parcel = tn.get(parcelKey);
			Entity owner = tn.get(ownerKey);
			
			if (user == null) {
				LOG.warning("User " + data.username + " does not exist");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}
				
			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!ur.isLoggedIn(secret, token, data.username, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if (parcel == null) {
				LOG.warning("Parcel doesn't exists.");
				return Response.status(Status.NOT_FOUND).entity("Parcel doesn't exists.").build();
			}

			if(!canModify(user, owner, parcel)) {
				LOG.warning("User " + data.username + " can't modify this.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " does not have authorization to change this parcel.").build();
			}

			if (!validUsers(data.owners, tn)){
				LOG.warning("Username of owners invalid.");
				return Response.status(Status.BAD_REQUEST).entity("Username of one or more owners invalid.").build();
			}

			LatLng[] markers = new LatLng[data.allLats.length];

			for(int i = 0; i< data.allLats.length; i++) {
				markers[i] = LatLng.of(data.allLats[i], data.allLngs[i]);
			}

			if(isOverlappedUpdate(markers, data.parcelName)){
				LOG.warning("Parcel overlaps with another parcel.");
				return Response.status(Status.CONFLICT).entity("New parcel markers overlap with other parcels markers.").build();
			}

			if (parcel.getBoolean(CONFIRMED)){
				List<String> ownersAdded = ownersAdded(parcel, data.owners, tn);
				List<String> ownersRemoved = ownersRemoved(parcel, data.owners, tn);

				boolean cantUpdateOwners = !canRemove(user, owner) && (ownersAdded.size() != 0 || ownersRemoved.size() != 0);
        		boolean isRemovingSelf = ownersRemoved.size() == 1 && ownersRemoved.contains(data.username) && ownersAdded.size() == 0;

       			//If the user isn't the owner who created the parcel they can't edit the owners list, unless to remove themselves
        		if (cantUpdateOwners && !isRemovingSelf){
					LOG.warning("User does not have permission to update list of co-owners.");
					tn.rollback();
					return Response.status(Status.BAD_REQUEST).entity("User does not have permission to update list of co-owners.").build();
				}
				String parcelInfo = data.owner + ":" + data.parcelName;

				for(String added: ownersAdded){
					addOwner(added, parcelInfo, tn, false);
				}

				for(String removed: ownersRemoved){
					removeOwner(removed, data.parcelName, tn);
				}
			}

			Builder builder = Entity.newBuilder(parcelKey)
					.set(COUNTY, parcel.getString(COUNTY))
					.set(DISTRICT, parcel.getString(DISTRICT))
					.set(AUTARCHY, parcel.getString(AUTARCHY))
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, getArea(markers))
					.set(CONFIRMATION, parcel.getString(CONFIRMATION))
					.set(CONFIRMED, parcel.getBoolean(CONFIRMED))
                    .set(NMARKERS, String.valueOf(data.allLats.length))
					.set(NOWNERS, String.valueOf(data.owners.length));

			for(int i = 0; i < data.owners.length; i++){
				builder.set(OWNER+i, data.owners[i]);
			}
					
			for(int i = 0; i< data.allLats.length; i++) {
				builder.set(MARKER+i, markers[i]);
			}

			parcel = builder.build();
			
			tn.put(parcel);
			tn.commit();
		
			return Response.ok("Parcel sucessfully updated.").build();
		}finally{
			if (tn.isActive())
				tn.rollback();
		}
	}

	@DELETE
	@Path("/remove")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteParcel(RemoveObjectData data){
		LOG.info("Attempting to remove parcel: " + data.objectName);

		if (!data.isDataValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);	
		Key parcelKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.owner)).setKind(PARCEL).newKey(data.objectName);

		Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.owner)).setKind(FORUM).newKey(data.objectName);
		Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);

		try {
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
			Entity owner = tn.get(ownerKey);
            Entity parcel = tn.get(parcelKey);

			if (user == null) {
				LOG.warning("User " + data.username + " does not exist.");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if (parcel == null){
				LOG.warning("Parcel to be removed " + data.objectName + " does not exist.");
				return Response.status(Status.NOT_FOUND).entity("Parcel to be removed " + data.objectName + " does not exist.").build();
			}

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!ur.isLoggedIn(secret, token, data.username, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if(!canRemove(user, owner)) {
				LOG.warning("User " + data.username + " unathourized to remove parcel.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " unathourized to remove parcel.").build();
			}

			if (parcel.getBoolean(CONFIRMED)){
				tn.delete(forumKey);

				int nOwners = Integer.parseInt(parcel.getString(NOWNERS));

				for(int i = 0; i < nOwners; i++)
					removeOwner(parcel.getString(OWNER+i) , data.objectName, tn);

				sr.updateStats(statKey, tn.get(statKey), tn, !ADD);
				sr.updateParcelForumStats(owner, !ADD, !ADD, tn);
			}

			tn.delete(parcelKey);
			tn.commit();

			return Response.ok("User " + data.username + " deleted the parcel " + data.objectName).build();

		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}
	
	@POST
	@Path("/info")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response parcelInfo(RequestData data) {
		LOG.info("Attempting to show parcel " + data.name);

		if(!data.isDataValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key parcelKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.username)).setKind(PARCEL).newKey(data.name);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
			
		Entity user = datastore.get(userKey);
		Entity parcel = datastore.get(parcelKey);
		Entity token = datastore.get(tokenKey);

		if (user == null) {
			LOG.warning("User " + data.username + " does not exist.");
			return Response.status(Status.FORBIDDEN).build();
		}

		if(parcel == null) {
			LOG.warning("Parcel does not exist");
			return Response.status(Status.BAD_REQUEST).entity("Parcel does not exist").build();
		}
	
		Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
		Entity secret = datastore.get(secretKey);

		if (!ur.isLoggedIn(secret, token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}

		ParcelInfo p = parcelInfoBuilder(parcel);
			
		return Response.ok(g.toJson(p)).build();
	}

	@GET
	@Path("/list")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showUserParcel() {
		LOG.info("Attempt to list all parcels");
			
		Query<Entity> parcelQuery = Query.newEntityQueryBuilder().setKind(PARCEL).build();

		QueryResults<Entity> parcels = datastore.run(parcelQuery);

		List<ParcelInfo> parcelList = new LinkedList<>();

		parcels.forEachRemaining(parcel -> {
			parcelList.add(parcelInfoBuilder(parcel));
		});

		return Response.ok(g.toJson(parcelList)).build();	
	}

	@POST
	@Path("/listUser")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showUserParcel(RequestData data) {
		LOG.info("Attempt to list parcels of user: " + data.username);

		if(!data.isUsernameValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		
		Entity user = datastore.get(userKey);
		Entity token = datastore.get(tokenKey);

		if (user == null) {				
			LOG.warning("User does not exist");
			return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
		}

		Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
		Entity secret = datastore.get(secretKey);

		if (!ur.isLoggedIn(secret, token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}
			
		List<ParcelInfo> parcelList = getUserParcels(data.username, user);

		return Response.ok(g.toJson(parcelList)).build();	
	}

	@POST
	@Path("/listRep")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showRepresentativeParcel(RequestData data) {
		LOG.info("Attempt to list parcels for representative: " + data.username);

		if(!data.isUsernameValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		
		Entity user = datastore.get(userKey);
		Entity token = datastore.get(tokenKey);

		if (user == null) {				
			LOG.warning("User does not exist");
			return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
		}

		Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
		Entity secret = datastore.get(secretKey);

		if (!ur.isLoggedIn(secret, token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}
			
		List<ParcelInfo> parcelList = getRepParcels(user.getString(AUTARCHY));

		return Response.ok(g.toJson(parcelList)).build();	
	}

	@POST
	@Path("/searchByRegion")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response searchParcelRegion(ParcelSearchRegionData data){
		LOG.info("Attempt to list specific parcels");

		if(!data.isDataValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		
		Entity user = datastore.get(userKey);
		Entity token = datastore.get(tokenKey);

		if (user == null) {				
			LOG.warning("User does not exist");
			return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
		}

		Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
		Entity secret = datastore.get(secretKey);

		if (!ur.isLoggedIn(secret, token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}
			
		List<ParcelInfo> parcelList = getParcelByRegion(data.region, data.type);

		return Response.ok(g.toJson(parcelList)).build();	
	}

	@POST
	@Path("/searchByPosition")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response searchParcelPosition(ParcelSearchPositionData data){
		LOG.info("Attempt to list specific parcels");

		if(!data.isDataValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		data.validatePosition();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		
		Entity user = datastore.get(userKey);
		Entity token = datastore.get(tokenKey);

		if (user == null) {				
			LOG.warning("User does not exist");
			return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
		}

		Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
		Entity secret = datastore.get(secretKey);

		if (!ur.isLoggedIn(secret, token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}
			
		List<ParcelInfo> parcelList = getParcelByPosition(data.latMax, data.latMin, data.longMax, data.longMin);

		return Response.ok(g.toJson(parcelList)).build();	
	}

	@POST
	@Path("/verify")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response verifyParcel(ParcelVerifyData data) throws IOException{
		LOG.info("Attempt to verify parcels of user: " + data.username);

		if(!data.isDataValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		Key parcelKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.owner)).setKind(PARCEL).newKey(data.parcelName);
		Key statKeyP = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);
		Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.owner)).setKind(FORUM).newKey(data.parcelName);
        Key statKeyF = datastore.newKeyFactory().setKind(STAT).newKey(FORUM);
		Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);

		Transaction tn = datastore.newTransaction();

		try {
			Entity user = tn.get(userKey);
			Entity token = tn.get(tokenKey);
			Entity parcel = tn.get(parcelKey);
			Entity owner = tn.get(ownerKey);

			if (user == null) {				
				LOG.warning("User does not exist");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);
	
			if (!ur.isLoggedIn(secret, token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if (parcel == null) {
				LOG.warning("Parcel does not exist.");
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("Parcel does not exist.").build();
			}

			if (!canVerify(user)) {
				LOG.warning("User can't verify this parcel.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User can't verify this parcel.").build();
			}

			if (data.confirmation){
				Builder builder = Entity.newBuilder(parcelKey)
					.set(COUNTY, parcel.getString(COUNTY))
					.set(DISTRICT, parcel.getString(DISTRICT))
					.set(AUTARCHY, parcel.getString(AUTARCHY))
					.set(DESCRIPTION, parcel.getString(DESCRIPTION))
					.set(GROUND_COVER_TYPE, parcel.getString(GROUND_COVER_TYPE))
					.set(CURR_USAGE, parcel.getString(CURR_USAGE))
					.set(PREV_USAGE, parcel.getString(PREV_USAGE))
					.set(AREA, parcel.getString(AREA))
					.set(CONFIRMATION, parcel.getString(CONFIRMATION))
					.set(CONFIRMED, data.confirmation)
                    .set(NMARKERS, parcel.getString(NMARKERS))
					.set(NOWNERS, parcel.getString(NOWNERS));
			
			int n1 = Integer.parseInt(parcel.getString(NOWNERS));
			int n2 = Integer.parseInt(parcel.getString(NMARKERS));
			
			String parcelInfo = data.owner + ":" + data.parcelName;
			String aux;

			for(int i = 0; i < n1; i++){
				aux = parcel.getString(OWNER+i);
				builder.set(OWNER+i, aux);
				addOwner(aux, parcelInfo, tn, true);
			}
					
			for(int i = 0; i < n2; i++) {
				builder.set(MARKER+i, parcel.getLatLng(MARKER+i));
			}

			parcel = builder.build();

			//Update statistics
			sr.updateStats(statKeyP, tn.get(statKeyP), tn, ADD);
			sr.updateParcelForumStats(owner, ADD, ADD, tn);

			createForum(tn, forumKey, statKeyF, owner);

			tn.put(parcel);
			}
			
			sendEmailToOwners(owner, parcel, tn, data.reason, data.confirmation);

			tn.commit();
		
			return Response.ok("Parcel verified.").build();
		} finally {
			if(tn.isActive())
				tn.rollback();
		}
	}

	@POST
    @Path("/ownerInfo")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response showInfo(RequestData data) {
        LOG.info("Attempting to show user " + data.name);

        if(!data.isDataValid()){
            return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
        }

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);

        Entity user = datastore.get(userKey);
        Entity token = datastore.get(tokenKey);

        Entity owner = datastore.get(userKey);

        if (user == null) {
            LOG.warning("User does not exist");
            return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
        }

        if (owner == null) {
            LOG.warning("User does not exist");
            return Response.status(Status.BAD_REQUEST).entity("User " + data.name + " does not exist").build();
        }

        Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
        Entity secret = datastore.get(secretKey);

        if (!ur.isLoggedIn(secret, token, data.username)){
            LOG.warning("User " + data.username + " not logged in.");
            return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
        }

        OwnerInfo u = new OwnerInfo(user.getKey().getName(), user.getString(EMAIL), user.getString(NAME), 
                        user.getString(DISTRICT), user.getString(COUNTY), user.getString(AUTARCHY), user.getString(STREET), 
                        user.getString(HPHONE), user.getString(MPHONE));

        return Response.ok(g.toJson(u)).build();
    }

	private boolean canModify(Entity user, Entity owner, Entity parcel) {
		Roles userRole = Roles.valueOf(user.getString(ROLE));

		switch(userRole) {
			case SUPERUSER:
			case MODERADOR:
				return true;
			case PROPRIETARIO:
				return user.getKey().getName().equals(owner.getKey().getName()) || isCoOwner(user, parcel);
			case REPRESENTANTE:
			case COMERCIANTE:
				return false;
			default:
				return false;
		}
	}

	private boolean canRemove(Entity user, Entity owner) {
		Roles userRole = Roles.valueOf(user.getString(ROLE));

		switch(userRole) {
			case SUPERUSER:
			case MODERADOR:
				return true;
			case PROPRIETARIO:
				return user.getKey().getName().equals(owner.getKey().getName());
			case REPRESENTANTE:
			case COMERCIANTE:
				return false;
			default:
				return false;
		}
	}

	private boolean isCoOwner(Entity user, Entity parcel){
		String username = user.getKey().getName();
		int nOwners = Integer.parseInt(parcel.getString(NOWNERS));

		for(int i = 0; i < nOwners; i++){
			if (username.equals(parcel.getString(OWNER+i)))
				return true;
		}

		return false;
	}

	private boolean validUsers(String[] owners, Transaction tn){
		Key userKey;

		for(int i = 0; i < owners.length; i++){
			userKey = datastore.newKeyFactory().setKind(USER).newKey(owners[i]);
			if (tn.get(userKey) == null)
				return false;
		}

		return true;
	}

	private boolean canVerify(Entity e1) {
		return Roles.valueOf(e1.getString(ROLE)) == Roles.REPRESENTANTE;
	}

	private List<String> ownersAdded(Entity parcel, String[] owners, Transaction tn){
		List<String> added = new LinkedList<>();

		for(int i = 0; i < owners.length; i++){
			if (!containsOwner(parcel, owners[i]))
				added.add(owners[i]);
		}

		return added;
	}

	private List<String> ownersRemoved(Entity parcel, String[] owners, Transaction tn){
		List<String> removed = new LinkedList<>();
		int nOwners = Integer.parseInt(parcel.getString(NOWNERS));

		for(int i = 0; i < nOwners; i++){
			if (!isStillOwner(parcel.getString(OWNER+i), owners))
				removed.add(parcel.getString(OWNER+i));
		}

		return removed;
	}

	private boolean isStillOwner(String username, String[] owners){
		for(int i = 0; i < owners.length; i++){
			if (owners[i].equals(username))
				return true;
		}

		return false;
	}

	private boolean containsOwner(Entity parcel, String owner){
		int nOwners = Integer.parseInt(parcel.getString(NOWNERS));

		for(int i = 0; i < nOwners; i++){
			if (owner.equals(parcel.getString(OWNER+i)))
				return true;
		}
		return false;
	}

	private void addOwner(String username, String parcelInfo, Transaction tn, boolean confirmation){
        int p = 0;
        if(confirmation) p += 1500;

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(username);
        Entity user = tn.get(userKey);

        long nParcelsCo = user.getLong(NPARCELSCO);

        Builder build = Entity.newBuilder(userKey)
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
                .set(NPARCELSCRT, user.getLong(NPARCELSCRT))
                .set(NPARCELSCO, nParcelsCo + 1L)
                .set(NFORUMS, user.getLong(NFORUMS))
                .set(NMSGS, user.getLong(NMSGS))
                .set(CTIME, user.getTimestamp(CTIME));

        for(long j = 0; j < nParcelsCo; j++){
            build.set(PARCEL+j, user.getString(PARCEL+j));
        }

        build.set(PARCEL+nParcelsCo, parcelInfo);

        user = build.build();

        tn.put(user);
    }

	private void removeOwner(String owner, String parcelName, Transaction tn){
		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(owner);
		Entity user = tn.get(userKey);

		long nParcelsCo = user.getLong(NPARCELSCO);

		Builder build = Entity.newBuilder(userKey)
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
				.set(NPARCELSCRT, user.getLong(NPARCELSCRT))
				.set(NPARCELSCO, nParcelsCo - 1L)
				.set(NFORUMS, user.getLong(NFORUMS))
				.set(NMSGS, user.getLong(NMSGS))
				.set(CTIME, user.getTimestamp(CTIME));

		for(long j = 0; j < nParcelsCo; j++){
			String parcelInfo = user.getString(PARCEL+j);
			String pName = parcelInfo.substring(parcelInfo.indexOf(":")+1);

			if (pName.equals(parcelName)){
				if(j == nParcelsCo-1)
					break;

				build.set(PARCEL+j, user.getString(PARCEL+(nParcelsCo-1)));
				nParcelsCo--;
				j--;
			}else
				build.set(PARCEL+j, user.getString(PARCEL+j));
		}
	
		user = build.build();

		tn.put(user);
	}

	private String getArea(LatLng[] markers){
		double area = 0.0;
     
        int j = markers.length-1;

        for (int i = 0; i < markers.length; i++)
        {
			area += (graphPoint(markers[j].getLatitude()) + graphPoint(markers[i].getLatitude())) * (graphPoint(markers[j].getLongitude()) - graphPoint(markers[i].getLongitude()));

            j = i;
        }
     
        area = Math.abs(area / 2.0) * ERROR;

        return String.format("%.2f", area) + " m²";
	}

	private double graphPoint(double p){
		p = Math.toRadians(p);

        double a = Math.pow(Math.sin((-p) / 2), 2)
                + Math.cos(p) * Math.cos(0.0);

        double c = 2 * Math.asin(Math.sqrt(a));

        return (c * 6371000);
	}

	private String uploadConfirmation(String name, byte[] data, int type){
		String content; 

		if (type == 1)
			content = "application/pdf";
		else
			content = "image/jpeg";

		Storage storage = StorageOptions.newBuilder().setProjectId(PROJECT_ID).build().getService();
		BlobId blobId = BlobId.of(BUCKET_NAME, name);
		BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(content).build();
		storage.create(blobInfo, data);
		storage.createAcl(blobId, Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER));

		return URL + name;
	}

	private void createForum(Transaction tn, Key forumKey, Key statKey, Entity user){
		Entity forum = tn.get(forumKey);

		if(forum == null){
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.HOUR, 1);
	
			forum = Entity.newBuilder(forumKey)
					.set(TOPIC, PARCEL_TOPIC)
					.set(CRT_DATE, cal.getTime().toString())
					.build();
	
			sr.updateStats(statKey, tn.get(statKey), tn, ADD);
	
			tn.add(forum);
		}
	}

	private List<ParcelInfo> getParcelByPosition(double latMax, double latMin, double longMax, double longMin){
		Query<Entity> parcelQuery = Query.newEntityQueryBuilder().setKind(PARCEL)
									.setFilter(CompositeFilter.and(PropertyFilter.eq(CONFIRMED, true)))
								    .build();

		QueryResults<Entity> parcels = datastore.run(parcelQuery);

		List<ParcelInfo> userParcels = new LinkedList<>();

		parcels.forEachRemaining(parcel -> {
			int n2 = Integer.parseInt(parcel.getString(NMARKERS));
			LatLng[] markers = new LatLng[n2];
			boolean outside = true;

			for (int i = 0; i < n2; i++){
				markers[i] = parcel.getLatLng(MARKER+i);

				if (markers[i].getLatitude() < latMax && markers[i].getLatitude() > latMin && markers[i].getLongitude() < longMax && markers[i].getLongitude() > longMin){
					outside = false;
					break;
				}
			}
			
			if (!outside){
				userParcels.add(parcelInfoBuilder(parcel));
			}
		});

		return userParcels;
	}

	private List<ParcelInfo> getParcelByRegion(String region, int type){
		String search;

		switch(type){
			case 1:
				search = COUNTY;
				break;
			case 2:
				search = DISTRICT;
				break;
			default:
				search = AUTARCHY;
				break;
		}

		Query<Entity> parcelQuery = Query.newEntityQueryBuilder().setKind(PARCEL)
								    .setFilter(CompositeFilter.and(PropertyFilter.eq(search, region), PropertyFilter.eq(CONFIRMED, true)))
								    .build();

		QueryResults<Entity> parcels = datastore.run(parcelQuery);

		List<ParcelInfo> userParcels = new LinkedList<>();

		parcels.forEachRemaining(parcel -> {
			userParcels.add(parcelInfoBuilder(parcel));
		});

		return userParcels;
	}

	private List<ParcelInfo> getUserParcels(String owner, Entity user){
		Query<Entity> parcelQuery = Query.newEntityQueryBuilder().setKind(PARCEL)
								  .setFilter(PropertyFilter.hasAncestor(datastore.newKeyFactory().setKind(USER).newKey(owner)))
								  .build();

		QueryResults<Entity> parcels = datastore.run(parcelQuery);

		List<ParcelInfo> userParcels = new LinkedList<>();

		parcels.forEachRemaining(parcel -> {
			userParcels.add(parcelInfoBuilder(parcel));
		});

		long n = user.getLong(NPARCELSCO);

		Key parcelKey;
		String parcelOwner, parcelName, parcelInfo;
		int endPos;

		for (long i = 0; i < n; i++){		
			parcelInfo = user.getString(PARCEL+i);
			endPos = parcelInfo.indexOf(":");
			parcelOwner = parcelInfo.substring(0, endPos);
			parcelName = parcelInfo.substring(endPos+1, parcelInfo.length());

			parcelKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, parcelOwner)).setKind(PARCEL).newKey(parcelName);
			userParcels.add(parcelInfoBuilder(datastore.get(parcelKey)));
		}

		return userParcels;
	}

	private List<ParcelInfo> getRepParcels(String region){
		Query<Entity> parcelQuery = Query.newEntityQueryBuilder().setKind(PARCEL)
								  .setFilter(PropertyFilter.eq(AUTARCHY, region))
								  .build();

		QueryResults<Entity> parcels = datastore.run(parcelQuery);

		List<ParcelInfo> userParcels = new LinkedList<>();

		parcels.forEachRemaining(parcel -> {
			userParcels.add(parcelInfoBuilder(parcel));
		});

		return userParcels;
	}

    //Run through every parcel and verify that they don't overlap with the given one
    private boolean isOverlapped(LatLng[] markers){
		Query<Entity> query = Query.newEntityQueryBuilder().setKind(PARCEL)
								   .setFilter(CompositeFilter.and(PropertyFilter.eq(CONFIRMED, true))).build();

		QueryResults<Entity> parcels = datastore.run(query);

		while(parcels.hasNext()){
			Entity parcel = parcels.next();
			int nParcels = Integer.parseInt(parcel.getString(NMARKERS));

			LatLng[] auxMarkers = new LatLng[nParcels];

            for(int i = 0; i < nParcels; i++){
                auxMarkers[i] = parcel.getLatLng(MARKER + i);
            }

            if (overlaps(markers, auxMarkers))
                return true;
            

			if (contains(markers, auxMarkers))
				return true;

			if (contains(auxMarkers, markers))
				return true;
		}
		return false;
	}

	private boolean isOverlappedUpdate(LatLng[] markers, String name){
		Query<Entity> query = Query.newEntityQueryBuilder().setKind(PARCEL)
								   .setFilter(CompositeFilter.and(PropertyFilter.eq(CONFIRMED, true))).build();

		QueryResults<Entity> parcels = datastore.run(query);

		while(parcels.hasNext()){
			Entity parcel = parcels.next();

			if(!parcel.getKey().getName().equals(name)){
				int nMarkers = Integer.parseInt(parcel.getString(NMARKERS));

				LatLng[] auxMarkers = new LatLng[nMarkers];

           	 	for(int i = 0; i < nMarkers; i++){
               		auxMarkers[i] = parcel.getLatLng(MARKER + i);
           		}

            	if (overlaps(markers, auxMarkers) || contains(markers, auxMarkers))
                	return true;
			}
		}

		return false;
	}

	private boolean overlaps(LatLng[] markers, LatLng[] auxMarkers) {
		boolean overlaps = false;
		//Checks if a parcel marker is inside the other one
		int aux1, aux2;
		//Checks if any 2 lines between markers intersect
		for(int i = 0; i < markers.length-1 && !overlaps; i++){
			//Verify if it's the last line to check with first line
			if (i < markers.length-1)
				aux1 = i+1;
			else
				aux1 = 0;

			for (int j = 0; j < auxMarkers.length; j++){
				//Verify if it's the last line to check with first line
				if (j < auxMarkers.length-1)
					aux2 = j+1;
				else
					aux2 = 0;
				
				overlaps = Line2D.linesIntersect(markers[i].getLatitude(), markers[i].getLongitude(), markers[aux1].getLatitude(), markers[aux1].getLongitude(),
												auxMarkers[j].getLatitude(), auxMarkers[j].getLongitude(), auxMarkers[aux2].getLatitude(), auxMarkers[aux2].getLongitude());
			}
		}

		return overlaps;
	}

	private ParcelInfo parcelInfoBuilder(Entity parcel){
		int n1 = Integer.parseInt(parcel.getString(NOWNERS));
		int n2 = Integer.parseInt(parcel.getString(NMARKERS));

		String[] owners = new String[n1];
		LatLng markers[] = new LatLng[n2];

		for(int i = 0; i < n1; i ++){
			owners[i] = parcel.getString(OWNER+i);
		}

		for (int i = 0; i < n2; i++){
			markers[i] = parcel.getLatLng(MARKER+i);
		}

		ParcelInfo p = new ParcelInfo(parcel.getKey().getAncestors().get(0).getName(), owners, parcel.getKey().getName(), parcel.getString(COUNTY), 
		parcel.getString(DISTRICT), parcel.getString(AUTARCHY), parcel.getString(DESCRIPTION), parcel.getString(GROUND_COVER_TYPE),
		parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA), markers, parcel.getString(CONFIRMATION), parcel.getBoolean(CONFIRMED));

		return p;
	}

	private boolean contains(LatLng[] markers, LatLng[] auxMarkers){
		for(int i = 0; i < auxMarkers.length; i++){
			if (!isInside(markers, markers.length, auxMarkers[i]))
				return false;
		}
		
		return true;
	}

	    // Returns true if the point p lies
    	// inside the polygon[] with n vertices
    private boolean isInside(LatLng[] polygon, int n, LatLng p)
    {

        // Create a point for line segment from p to infinite
        LatLng extreme = LatLng.of(60.0, p.getLongitude());

        int count = 0, i = 0;
        do
        {
            int next = (i + 1) % n;

            if (doIntersect(polygon[i], polygon[next], p, extreme))
            {
                if (orientation(polygon[i], p, polygon[next]) == 0)
                {
                    return onSegment(polygon[i], p,
                            polygon[next]);
                }

                count++;
            }
            i = next;
        } while (i != 0);

        return (count % 2 == 1);
    }

    //Check if point q lies on the line segment 'pr'
    private boolean onSegment(LatLng p, LatLng q, LatLng r)
    {
        if (q.getLatitude() <= Math.max(p.getLatitude(), r.getLatitude()) &&
            q.getLatitude() >= Math.min(p.getLatitude(), r.getLatitude()) &&
            q.getLongitude() <= Math.max(p.getLongitude(), r.getLongitude()) &&
            q.getLongitude() >= Math.min(p.getLongitude(), r.getLongitude()))
        {
            return true;
        }
        return false;
    }
 
    //Find orientation of ordered triplet (p, q, r).
    static int orientation(LatLng p, LatLng q, LatLng r)
    {
        double val = (q.getLongitude() - p.getLongitude()) * (r.getLatitude() - q.getLatitude())
                - (q.getLatitude() - p.getLatitude()) * (r.getLongitude() - q.getLongitude());
 
        if (val == 0.0)
        {
            return 0; // collinear
        }
        return (val > 0) ? 1 : 2; // clock or counterclock wise
    }
 
    //Check if line segment 'p1q1' and 'p2q2' intersect
    private boolean doIntersect(LatLng p1, LatLng q1, LatLng p2, LatLng q2)
    {
        int o1 = orientation(p1, q1, p2);
        int o2 = orientation(p1, q1, q2);
        int o3 = orientation(p2, q2, p1);
        int o4 = orientation(p2, q2, q1);
 
        if (o1 != o2 && o3 != o4)
        {
            return true;
        }
 
        if (o1 == 0 && onSegment(p1, p2, q1))
        {
            return true;
        }
 
        if (o2 == 0 && onSegment(p1, q2, q1))
        {
            return true;
        }
 
        if (o3 == 0 && onSegment(p2, p1, q2))
        {
            return true;
        }
 
        if (o4 == 0 && onSegment(p2, q1, q2))
        {
            return true;
        }
 
        return false;
    }

	private void sendEmailToOwners(Entity owner, Entity parcel, Transaction tn, String reason, boolean confirmation) throws IOException {
        String subject = "Resultado de verificação da sua parcela, " + parcel.getKey().getName();

		Content content;

		if(confirmation) {
			content = new Content("text/plain", 
								"É com agrado que o informamos que a sua parcela, " + parcel.getKey().getName() + ", foi verificada com sucesso.\n" +
								"Dado este resultado foram debitados 1500 pontos na sua conta para usufruir das nossas rewards.\n\n" +
								"Obrigado por utilizar o nosso serviço!");
		} else {
			content = new Content("text/plain", 
								"Infelizmente não foi possível verificar a sua parcela, " + parcel.getKey().getName() + ", como legítima.\n" +
								"Por favor altere a informação necessária da parcela de acordo com o feedback dado de seguida.\n\n" +
								"Razão:\n" +
								reason);
		}

		int n1 = Integer.parseInt(parcel.getString(NOWNERS));

		for(int i = 0; i < n1; i ++){
			String username = parcel.getString(OWNER+i);
			Key userKey = datastore.newKeyFactory().setKind(USER).newKey(username);
			Entity user = datastore.get(userKey);

			sendAutomaticEmail(user.getString(EMAIL), subject, content);
		}

		sendAutomaticEmail(owner.getString(EMAIL), subject, content);
    }

	private void sendAutomaticEmail(String to_user, String subject, Content content) throws IOException {		
		// Set content for request.
		Email to = new Email(to_user);
		Email from = new Email(SENDGRID_SENDER);
		Mail mail = new Mail(from, subject, to, content);

		// Instantiates SendGrid client.
		SendGrid sendgrid = new SendGrid(SENDGRID_API_KEY);

		// Instantiate SendGrid request.
		Request request = new Request();

		try {
			// Set request configuration.
			request.setMethod(Method.POST);
			request.setEndpoint("mail/send");
			request.setBody(mail.build());

			// Use the client to send the API request.
			com.sendgrid.Response response = sendgrid.api(request);

			if (response.getStatusCode() != 202) {
				LOG.warning(String.format("An error occurred: %s", response.getStatusCode()));
			}
		} catch (IOException ex) {
			throw ex;
		}
	}
}