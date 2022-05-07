package pt.unl.fct.di.adc.avindividual.resources;

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

	public static final String PRIVATE = "Private";
	public static final String ACTIVE = "ACTIVE";
	public static final String INACTIVE = "INACTIVE";
	
	private static final String PARCEL_REGION = "parcel region";
	private static final String OWNER = "owner";
	private static final String PARCEL_NAME = "name";
	private static final String DESCRIPTION = "description";
	private static final String GROUND_COVER_TYPE = "ground cover type";
	private static final String CURR_USAGE = "current usage";
	private static final String PREV_USAGE = "previous usage";
	private static final String AREA = "area";
    private static final String NPOINTS = "number of points";
	private static final String POINTS = "parcel point ";

	//Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String PARCEL = "Parcel";
	
   
    @POST
	@Path("/register")
	public Response putParcel(ParcelData data) {
		LOG.info("Attempting to register parcel " + data.parcelName);

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
				return Response.status(Status.BAD_REQUEST).entity("Parcel name already exists.").build();
			}
			
			/**
			if(isOverlapped(data.points)){
				LOG.warning("Parcel overlaps with another parcel");
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("Parcel overlaps with another parcel").build();
			}
			*/
			
			Builder builder = Entity.newBuilder(parcelKey)
					.set(OWNER, data.owner)
					.set(PARCEL_REGION, data.parcelRegion)
					.set(PARCEL_NAME, data.parcelName)
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, data.area);
                    //Might break because isOverlap() reads it as a String
					/**
                    .set(NPOINTS, data.points.length);
			
			for(int i = 0; i< data.points.length; i++) {
				builder.set(POINTS+i, data.points[i]);
			}
			*/

			parcel = builder.build();
			
			tn.add(parcel);
			tn.commit();
			
			return Response.ok("Parcel added").build();

		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}
	
	@PUT
	@Path("/updateParcel")
	public Response updateParcel(ParcelData data) {
		Transaction tn = datastore.newTransaction();

		Key parcelKey = datastore.newKeyFactory().setKind(PARCEL).newKey(data.parcelName);
		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
		
		try {
			Entity parcel = tn.get(parcelKey);
			Entity user = tn.get(userKey);

			if(parcel == null) {
				LOG.warning("Parcel does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Parcel does not exist").build();
			}
			
			if(user == null) {
				LOG.warning("User does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User does not exist").build();
			}
			
			if(!parcel.getString("owner").equals(user.getString("username"))) {
				LOG.warning("User does not have the permission");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User does not have the permission").build();
			}
			
			parcel = Entity.newBuilder(parcelKey)
					.set(OWNER, data.owner)
					.set(PARCEL_REGION, data.parcelRegion)
					.set(PARCEL_NAME, data.parcelName)
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, data.area)
					.build();
			
			tn.put(parcel);
			tn.commit();
		
			return Response.ok("Parcel changed").build();
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

			ParcelData p = new ParcelData(parcel.getString(OWNER), parcel.getString(PARCEL_NAME), parcel.getString(PARCEL_REGION), parcel.getString(DESCRIPTION), 
				parcel.getString(GROUND_COVER_TYPE), parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA));

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
	public Response showUsers(LogoutData data) {
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
				userParcels.add(new ParcelData(parcel.getString(OWNER), parcel.getString(PARCEL_NAME), parcel.getString(PARCEL_REGION), parcel.getString(DESCRIPTION), 
				parcel.getString(GROUND_COVER_TYPE), parcel.getString(CURR_USAGE), parcel.getString(PREV_USAGE), parcel.getString(AREA)));
			});

		return userParcels;
	}
	

    //Run through every parcel and verify that they don't overlap with the given one
    private boolean isOverlapped(LatLng[] points){
		Query<Entity> query = Query.newEntityQueryBuilder().setKind("User").build();

		QueryResults<Entity> parcels = datastore.run(query);

		while(parcels.hasNext()){
			Entity parcel = parcels.next();
			int nParcels = Integer.parseInt(parcel.getString(NPOINTS));

			LatLng[] loc = new LatLng[nParcels];

            for(int i = 0; i < nParcels; i++){
                loc[i] = parcel.getLatLng(POINTS + i);
            }

            if (overlaps(points, loc)){
                return true;
            }
		}
		return false;
	}

    //Calculates if 2 arrays of LatLng overlap eachother
    private boolean overlaps(LatLng[] points1, LatLng[] points2){
		
        return false;
    }
}