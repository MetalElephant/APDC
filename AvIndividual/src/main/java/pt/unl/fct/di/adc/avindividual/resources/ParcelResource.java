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

import pt.unl.fct.di.adc.avindividual.util.LogoutData;
import pt.unl.fct.di.adc.avindividual.util.ModifyParcelData;
import pt.unl.fct.di.adc.avindividual.util.ParcelData;

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
	
   
    @POST
	@Path("/register")
	public Response putParcel(ParcelData data) {
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
				
			if (!ur.isLoggedIn(token, tn)){
				LOG.warning("User " + data.owner + " not logged in.");
				tn.rollback();
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
			
			return Response.ok("Parcel sucefully added.").build();

		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}
	
	@PUT
	@Path("/updateParcel")
	public Response updateParcel(ModifyParcelData data) {
		LOG.info("Attempting to register parcel " + data.parcelName);

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
				
			if (!ur.isLoggedIn(token, tn)){
				LOG.warning("User " + data.owner + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.owner + " not logged in.").build();
			}

			if (parcel == null) {
				LOG.warning("Parcel doesn't exists.");
				tn.rollback();
				return Response.status(Status.NOT_FOUND).entity("Parcel doesn't exists.").build();
			}

			Builder builder = Entity.newBuilder(parcelKey)
					.set(OWNER, data.owner)
					.set(PARCEL_REGION, data.parcelRegion)
					.set(PARCEL_NAME, data.parcelName)
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
	public Response parcelInfo(ParcelData data) {
		//TODO parcel data type with just owner and name, rest is unecessary
		LOG.fine("Attempting to show parcel " + data.parcelName);

		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
		Key parcelKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.owner)).setKind(PARCEL).newKey(data.parcelName);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.owner);


		try{
			Entity user = tn.get(userKey);
			Entity parcel = tn.get(parcelKey);
			Entity token = tn.get(tokenKey);

			if(parcel == null) {
				LOG.warning("Parcel does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Parcel does not exist").build();
			}
			
			if (user == null) {
				LOG.warning("User " + data.owner + " does not exist.");
	
				return Response.status(Status.FORBIDDEN).build();
			}
	
			if (!ur.isLoggedIn(token, tn)) {
				LOG.warning("User " + data.owner + "  session has expired.");
	
				return Response.status(Status.FORBIDDEN).build();
			}

			//TODO Need to make a new parcel data type to show information
			ParcelData p = new ParcelData(parcel.getString(OWNER), parcel.getString(PARCEL_NAME), parcel.getString(PARCEL_REGION), parcel.getString(DESCRIPTION), 
				parcel.getString(GROUND_COVER_TYPE), parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA), new double[0], new double[0]);

			return Response.ok(g.toJson(p)).build();

		}finally{
			if (tn.isActive())
				tn.rollback();
		}
	}

	@POST
	@Path("/list")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showUserParcel(LogoutData data) {
		LOG.info("Attempt to list parcels of user: " + data.username);
		
		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		
		try {
			Entity user = tn.get(userKey);
			Entity token = tn.get(tokenKey);

			if (user == null) {
				LOG.warning("User does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}

			if (!ur.isLoggedIn(token, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}
			
			
			List<ParcelData> parcelList = getQueries(data.username);

			return Response.ok(g.toJson(parcelList)).build();
		} finally {
			if (tn.isActive())
				tn.rollback();
		}	
	}

	private List<ParcelData> getQueries(String owner){
		Query<Entity> queryParcel = Query.newEntityQueryBuilder().setKind(PARCEL)
					.setFilter(CompositeFilter.and(
						PropertyFilter.eq(OWNER, owner)))
					.build();

			QueryResults<Entity> parcels = datastore.run(queryParcel);

			List<ParcelData> userParcels = new LinkedList<>();

			parcels.forEachRemaining(parcel -> {
				int n = Integer.parseInt(parcel.getString(NMARKERS));

				double[] lats = new double[n];
				double[] longs = new double[n];

				for (int i = 0; i < n; i++){
					LatLng l = parcel.getLatLng(MARKER+i);
					lats[i] = l.getLatitude();
					longs[i] = l.getLongitude();
				}

				//Ditto to line 236
				userParcels.add(new ParcelData(parcel.getString(OWNER), parcel.getString(PARCEL_NAME), parcel.getString(PARCEL_REGION), parcel.getString(DESCRIPTION), 
				parcel.getString(GROUND_COVER_TYPE), parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA), lats, longs));
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

            if (overlaps(markers, auxMarkers)){
                return true;
            }
		}
		return false;
	}

    //Checks if 2 parcels overlap eachother
    private boolean overlaps(LatLng[] markers, LatLng[] auxMarkers){
		//TODO make this code better
		boolean overlaps = false;
		//Checks if a parcel marker is inside the other one
		int last = auxMarkers.length-1;
		
		//Checks if any 2 lines between markers intersect
		for(int i = 0; i < markers.length-1 && !overlaps; i++){
			for (int j = 0; j < auxMarkers.length-1; j++){
				overlaps = Line2D.linesIntersect(markers[i].getLatitude(), markers[i].getLongitude(), markers[i+1].getLatitude(), markers[i+1].getLongitude(),
												auxMarkers[j].getLatitude(), auxMarkers[j].getLongitude(), auxMarkers[j+1].getLatitude(), auxMarkers[j+1].getLongitude());
			}
			overlaps = Line2D.linesIntersect(markers[i].getLatitude(), markers[i].getLongitude(), markers[i+1].getLatitude(), markers[i+1].getLongitude(),
					auxMarkers[last].getLatitude(), auxMarkers[last].getLongitude(), auxMarkers[0].getLatitude(), auxMarkers[0].getLongitude());
		}
		
		if (overlaps)
			return true;
		
		int last2 = markers.length-1;
		for (int i = 0; i < auxMarkers.length-1 && !overlaps; i++) {
			overlaps = Line2D.linesIntersect(markers[last2].getLatitude(), markers[last2].getLongitude(), markers[0].getLatitude(), markers[0].getLongitude(),
					auxMarkers[i].getLatitude(), auxMarkers[i].getLongitude(), auxMarkers[i+1].getLatitude(), auxMarkers[i+1].getLongitude());
		}
		
		if (overlaps)
			return true;
		
		overlaps = Line2D.linesIntersect(markers[last2].getLatitude(), markers[last2].getLongitude(), markers[0].getLatitude(), markers[0].getLongitude(),
				auxMarkers[last].getLatitude(), auxMarkers[last].getLongitude(), auxMarkers[0].getLatitude(), auxMarkers[0].getLongitude());

        return overlaps;
    }
}