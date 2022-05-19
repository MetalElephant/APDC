package pt.unl.fct.di.adc.avindividual.resources;

import java.awt.geom.Line2D;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
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
import pt.unl.fct.di.adc.avindividual.util.ParcelData;
import pt.unl.fct.di.adc.avindividual.util.RequestData;
import pt.unl.fct.di.adc.avindividual.util.Info.ParcelInfo;

import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;

@Path("/parcel")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class ParcelResource {

    private static final Logger LOG = Logger.getLogger(ParcelResource.class.getName());
    private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    private UserResource ur = new UserResource();
	
	//Parcel info
	private static final String PARCEL_REGION = "parcel region";
	private static final String OWNER = "owner";
	private static final String PARCEL_NAME = "name";
	private static final String DESCRIPTION = "description";
	private static final String GROUND_COVER_TYPE = "ground cover type";
	private static final String CURR_USAGE = "current usage";
	private static final String PREV_USAGE = "previous usage";
	private static final String AREA = "area";
    private static final String NMARKERS = "number of markers";
	private static final String MARKER = "parcel marker ";

	//Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String PARCEL = "Parcel";

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
					.set(OWNER, data.owner)
					.set(PARCEL_REGION, data.parcelRegion)
					.set(PARCEL_NAME, data.parcelName)
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, data.area)
                    .set(NMARKERS, String.valueOf(data.allLats.length));
			

			for(int i = 0; i< data.allLats.length; i++) {
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

		Key parcelKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.owner)).setKind(PARCEL).newKey(data.parcelName);
		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.owner);
		
		try {
			Entity parcel = tn.get(parcelKey);
			Entity user = tn.get(userKey);
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

			if (parcel == null) {
				LOG.warning("Parcel doesn't exists.");
				tn.rollback();
				return Response.status(Status.NOT_FOUND).entity("Parcel doesn't exists.").build();
			}

			verifyChanges(data, parcel);

			Builder builder = Entity.newBuilder(parcelKey)
					.set(OWNER, data.owner)
					.set(PARCEL_NAME, data.parcelName)//TODO name shouldn't be changed because we couldn't track it anymore because of the key
					.set(PARCEL_REGION, parcel.getString(PARCEL_REGION))
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, parcel.getString(AREA))
                    .set(NMARKERS, parcel.getString(NMARKERS));
			
			for(int i = 0; i < Integer.parseInt(parcel.getString(NMARKERS)); i++) {
				builder.set(MARKER+i, parcel.getLatLng(MARKER+i));
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
	
	@POST
	@Path("/info")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response parcelInfo(RequestData data) {
		LOG.fine("Attempting to show parcel " + data.name);

		if(!data.isDataValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

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

		int n = Integer.parseInt(parcel.getString(NMARKERS));

		LatLng markers[] = new LatLng[n];

		for (int i = 0; i < n; i++){
			markers[i] = parcel.getLatLng(MARKER+i);
		}

		ParcelInfo p = new ParcelInfo(parcel.getString(OWNER), parcel.getString(PARCEL_NAME), parcel.getString(PARCEL_REGION), parcel.getString(DESCRIPTION), 
			parcel.getString(GROUND_COVER_TYPE), parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA), markers);
			
		return Response.ok(g.toJson(p)).build();
	}

	@POST
	@Path("/list")
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
			
		List<ParcelInfo> parcelList = getQueries(data.username);

		return Response.ok(g.toJson(parcelList)).build();	
	}

	private List<ParcelInfo> getQueries(String owner){
		Query<Entity> queryParcel = Query.newEntityQueryBuilder().setKind(PARCEL)
					.setFilter(CompositeFilter.and(PropertyFilter.eq(OWNER, owner)))
					.build();

		QueryResults<Entity> parcels = datastore.run(queryParcel);

		List<ParcelInfo> userParcels = new LinkedList<>();

		parcels.forEachRemaining(parcel -> {
			int n = Integer.parseInt(parcel.getString(NMARKERS));

			LatLng markers[] = new LatLng[n];

			for (int i = 0; i < n; i++){
				markers[i] = parcel.getLatLng(MARKER+i);
			}

			userParcels.add(new ParcelInfo(parcel.getString(OWNER), parcel.getString(PARCEL_NAME), parcel.getString(PARCEL_REGION), parcel.getString(DESCRIPTION), 
			parcel.getString(GROUND_COVER_TYPE), parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA), markers));
		});

		return userParcels;
	}
	

    //Run through every parcel and verify that they don't overlap with the given one
    private boolean isOverlapped(LatLng[] markers){
		Query<Entity> query = Query.newEntityQueryBuilder().setKind(PARCEL).build();

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

	private boolean contains(LatLng[] markers, LatLng[] auxMarkers){
		boolean overlaps = false;

		return overlaps;
	}

	public void verifyChanges(ParcelUpdateData data, Entity modified) {
		if(data.parcelName == null || data.parcelName.length() == 0) {
			data.parcelName = modified.getString(PARCEL_NAME);
		}
		
		if(data.description == null || data.description.length() == 0) {
			data.description = modified.getString(DESCRIPTION);
		}
		
		if(data.groundType == null || data.groundType.length() == 0) {
			data.groundType = modified.getString(GROUND_COVER_TYPE);
		}
		
		if(data.currUsage == null || data.currUsage.length() == 0) {
			data.currUsage = modified.getString(CURR_USAGE);
		}
		
		if(data.prevUsage == null || data.prevUsage.length() == 0) {
			data.prevUsage = modified.getString(PREV_USAGE);
		}
	}
}