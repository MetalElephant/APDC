package pt.unl.fct.di.adc.avindividual.resources;

import java.awt.geom.Line2D;
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

import pt.unl.fct.di.adc.avindividual.util.ParcelUpdateData;
import pt.unl.fct.di.adc.avindividual.util.ParcelVerifyData;
import pt.unl.fct.di.adc.avindividual.util.RemoveObjectData;
import pt.unl.fct.di.adc.avindividual.util.ParcelData;
import pt.unl.fct.di.adc.avindividual.util.ParcelSearchPositionData;
import pt.unl.fct.di.adc.avindividual.util.ParcelSearchRegionData;
import pt.unl.fct.di.adc.avindividual.util.RequestData;
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
	
	//Parcel info
	private static final String OWNER = "Owner";
	private static final String NOWNERS = "number of owners";
	private static final String COUNTY = "County";
	private static final String DISTRICT = "District";
	private static final String FREGUESIA = "Freguesia";
	private static final String DESCRIPTION = "description";
	private static final String GROUND_COVER_TYPE = "ground cover type";
	private static final String CURR_USAGE = "current usage";
	private static final String PREV_USAGE = "previous usage";
	private static final String AREA = "area";
	private static final String CONFIRMATION = "Confirmation";
	private static final String CONFIRMED = "Confirmed";
    private static final String NMARKERS = "number of markers";
	private static final String MARKER = "marker";

	//Bucket information
	private static final String PROJECT_ID = "Land It";
	private static final String BUCKET_NAME = "our-hull.appspot.com"; //"land--it.appspot.com";
	private static final String URL = "https://storage.googleapis.com/our-hull.appspot.com/";

	//Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String PARCEL = "Parcel";
	private static final String STAT = "Statistics";

	private static final boolean ADD = true;

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
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.owner + " does not exist").build();
			}
				
			if (!ur.isLoggedIn(token, data.owner)){
				LOG.warning("User " + data.owner + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " not logged in.").build();
			}

			if (parcel != null) {
				LOG.warning("Parcel name already exists.");
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("Parcel name already exists.").build();
			}

			LatLng[] markers = new LatLng[data.allLats.length];

			for(int i = 0; i< data.allLats.length; i++) {
				markers[i] = LatLng.of(data.allLats[i], data.allLngs[i]);
			}
			
			if(isOverlapped(markers)){
				LOG.warning("Parcel overlaps with another parcel.");
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("Parcel overlaps with another parcel.").build();
			}
			
			Builder builder = Entity.newBuilder(parcelKey)
					.set(COUNTY, data.county)
					.set(DISTRICT, data.district)
					.set(FREGUESIA, data.freguesia)
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
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.owner + " does not exist").build();
			}
				
			if (!ur.isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " not logged in.").build();
			}

			if (parcel == null) {
				LOG.warning("Parcel doesn't exists.");
				tn.rollback();
				return Response.status(Status.NOT_FOUND).entity("Parcel doesn't exists.").build();
			}

			/*
			if(!ar.canModify(user, owner)) {
				LOG.warning("User " + data.username + " can't modify this.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " does not have authorization to change this parcel.").build();
			}*/

			LatLng[] markers = new LatLng[data.allLats.length];

			for(int i = 0; i< data.allLats.length; i++) {
				markers[i] = LatLng.of(data.allLats[i], data.allLngs[i]);
			}
			
			if(isOverlappedUpdate(markers, data.parcelName)){
				LOG.warning("Parcel overlaps with another parcel.");
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("Parcel overlaps with another parcel.").build();
			}

			Builder builder = Entity.newBuilder(parcelKey)
					.set(COUNTY, parcel.getString(COUNTY))
					.set(DISTRICT, parcel.getString(DISTRICT))
					.set(FREGUESIA, parcel.getString(FREGUESIA))
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, parcel.getString(AREA))
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
		
			return Response.ok("Parcel updated.").build();
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

		Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);

		try {
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
			Entity owner = tn.get(ownerKey);
            Entity parcel = tn.get(parcelKey);

			if (user == null) {
				LOG.warning("User " + data.username + " does not exist.");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if (parcel == null){
				LOG.warning("Parcel to be removed " + data.objectName + " does not exist.");
				tn.rollback();
				return Response.status(Status.NOT_FOUND).entity("Parcel to be removed " + data.objectName + " does not exist.").build();
			}

			if (!ur.isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}
/* 
			if (!ar.canRemove(user, owner)) {
				LOG.warning("User " + data.username + " unathourized to remove parcel.");
				tn.rollback();

				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " unathourized to remove parcel.").build();
			}*/

			//Update statistics
			sr.updateStats(statKey, tn.get(statKey), tn, !ADD);

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
	
		if (!ur.isLoggedIn(token, data.username)){
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

		if (!ur.isLoggedIn(token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}
			
		List<ParcelInfo> parcelList = getUserParcels(data.username);

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

		if (!ur.isLoggedIn(token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}
			
		List<ParcelInfo> parcelList = getRepParcels(data.username);

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

		if (!ur.isLoggedIn(token, data.username)){
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

		if (!ur.isLoggedIn(token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}
			
		List<ParcelInfo> parcelList = getParcelByPosition(data.latMax, data.latMin, data.longMax, data.longMin);

		return Response.ok(g.toJson(parcelList)).build();	
	}

	@POST
	@Path("/verify")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response verifyParcel(ParcelVerifyData data){
		LOG.info("Attempt to verify parcels of user: " + data.username);

		if(!data.isDataValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		Key parcelKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.owner)).setKind(PARCEL).newKey(data.parcelName);
		Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);

		Transaction tn = datastore.newTransaction();

		try{
			Entity user = datastore.get(userKey);
			Entity token = datastore.get(tokenKey);
			Entity parcel = tn.get(parcelKey);

			if (user == null) {				
				LOG.warning("User does not exist");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}

			if (!ur.isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if (parcel == null) {
				LOG.warning("Parcel does not exist.");
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("Parcel does not exist.").build();
			}
/*
			if (!ar.canVerifyParcel(user)) {
				LOG.warning("User can't verify this parcel.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User can't verify this parcel.").build();
			}*/

			Builder builder = Entity.newBuilder(parcelKey)
					.set(COUNTY, parcel.getString(COUNTY))
					.set(DISTRICT, parcel.getString(DISTRICT))
					.set(FREGUESIA, parcel.getString(FREGUESIA))
					.set(DESCRIPTION, parcel.getString(DESCRIPTION))
					.set(GROUND_COVER_TYPE, parcel.getString(GROUND_COVER_TYPE))
					.set(CURR_USAGE, parcel.getString(CURR_USAGE))
					.set(PREV_USAGE, parcel.getString(PREV_USAGE))
					.set(AREA, parcel.getString(AREA))
					.set(CONFIRMATION, parcel.getString(CONFIRMATION))
					.set(CONFIRMED, true)
                    .set(NMARKERS, parcel.getString(NMARKERS))
					.set(NOWNERS, parcel.getString(NOWNERS));

			int n1 = Integer.parseInt(parcel.getString(NOWNERS));
			int n2 = Integer.parseInt(parcel.getString(NMARKERS));

			for(int i = 0; i < n1; i++){
				builder.set(OWNER+i, parcel.getString(OWNER+i));
			}
					
			for(int i = 0; i < n2; i++) {
				builder.set(MARKER+i, parcel.getLatLng(MARKER+i));
			}

			parcel = builder.build();

			//Update statistics
			sr.updateStats(statKey, tn.get(statKey), tn, ADD);
			
			tn.put(parcel);
			tn.commit();
		
			return Response.ok("Parcel verified.").build();

		}finally{
			if(tn.isActive())
				tn.rollback();
		}
	}

	private String getArea(LatLng[] markers){
		double area = 0.0;
     
        int j = markers.length-1;

        for (int i = 0; i < markers.length; i++)
        {
            area += (markers[j].getLatitude() + markers[i].getLatitude()) * (markers[j].getLongitude() - markers[i].getLongitude());
             
            j = i;
        }
     
        return String.valueOf(Math.abs(area / 2.0));
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

				if (outside && (markers[i].getLatitude() < latMax && markers[i].getLatitude() > latMin && markers[i].getLongitude() < longMax && markers[i].getLongitude() > longMin)){
					outside = false;
				}
			}
			
			if (!outside){
				int n1 = Integer.parseInt(parcel.getString(NOWNERS));
				String[] owners = new String[n1];

				for(int i = 0; i < n1; i ++){
					owners[i] = parcel.getString(OWNER+i);
				}

				userParcels.add(new ParcelInfo(parcel.getKey().getAncestors().get(0).getName(), owners, parcel.getKey().getName(), parcel.getString(COUNTY), 
											   parcel.getString(DISTRICT), parcel.getString(FREGUESIA), parcel.getString(DESCRIPTION), parcel.getString(GROUND_COVER_TYPE),
											   parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA), markers));
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
				search = FREGUESIA;
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

	private List<ParcelInfo> getUserParcels(String owner){
		Query<Entity> parcelQuery = Query.newEntityQueryBuilder().setKind(PARCEL)
								  .setFilter(PropertyFilter.hasAncestor(datastore.newKeyFactory().setKind(USER).newKey(owner)))
								  .build();

		QueryResults<Entity> parcels = datastore.run(parcelQuery);

		List<ParcelInfo> userParcels = new LinkedList<>();

		parcels.forEachRemaining(parcel -> {
			userParcels.add(parcelInfoBuilder(parcel));
		});

		return userParcels;
	}

	private List<ParcelInfo> getRepParcels(String region){
		Query<Entity> parcelQuery = Query.newEntityQueryBuilder().setKind(PARCEL)
								  .setFilter(PropertyFilter.eq(FREGUESIA, region))
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
		parcel.getString(DISTRICT), parcel.getString(FREGUESIA), parcel.getString(DESCRIPTION), parcel.getString(GROUND_COVER_TYPE),
		parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA), markers);

		return p;
	}

	private boolean contains(LatLng[] markers, LatLng[] auxMarkers){
		boolean overlaps = false;

		return overlaps;
	}
}