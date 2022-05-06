package pt.unl.fct.di.adc.avindividual.resources;

import java.util.logging.Logger;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.google.cloud.datastore.Entity.Builder;

import pt.unl.fct.di.adc.avindividual.util.ParcelData;

import com.google.cloud.datastore.*;

@Path("/parcel")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class ParcelResource {

    private static final Logger LOG = Logger.getLogger(ParcelResource.class.getName());

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    private UserResource ur = new UserResource();

	public static final String PRIVATE = "Private";
	public static final String ACTIVE = "ACTIVE";
	public static final String INACTIVE = "INACTIVE";
	
	private static final String PARCEL_ID = "parcelId";
	private static final String OWNER = "owner";
	private static final String PARCEL_NAME = "name";
	private static final String DESCRIPTION = "description";
	private static final String GROUND_COVER_TYPE = "ground cover type";
	private static final String CURR_USAGE = "current usage";
	private static final String PREV_USAGE = "previous usage";
	private static final String AREA = "area";
    private static final String NPOINTS = "number of points";
	private static final String POINTS = "parcel point ";
   
    @POST
	@Path("/register")
	public Response putParcel(ParcelData data) {
		Transaction tn = datastore.newTransaction();
				
		Key userKey1 = datastore.newKeyFactory().setKind("User").newKey(data.owner);
		Entity user = tn.get(userKey1);
		Key parcelKey = datastore.newKeyFactory().setKind("Parcel").newKey(data.parcelName);
		Entity parcel = tn.get(parcelKey);
		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.owner);
		Entity token = tn.get(tokenKey);
		
		try {
			if(user == null || token == null || parcel != null) {
				LOG.warning("Something about the request is wrong");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Something about the request is wrong").build();
			}
				
			if(ur.isTokenExpired(token, tn)) {
				LOG.warning("Token has expired");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Token has expired").build();
			}

			if(isOverlapped(data.points)){
				LOG.warning("Parcel overlaps with another parcel");
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("Parcel overlaps with another parcel").build();
			}
			
			Builder builder = Entity.newBuilder(parcelKey)
					.set(OWNER, data.owner)
					.set(PARCEL_ID, data.parcelId)
					.set(PARCEL_NAME, data.parcelName)
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, data.area)
                    //Might break because isOverlap() reads it as a String
                    .set(NPOINTS, data.points.length);
			
			for(int i = 0; i< data.points.length; i++) {
				builder.set(POINTS+i, data.points[i]);
			}
			
			parcel = builder.build();
			
			tn.add(parcel);
			tn.commit();
			
			return Response.ok("Parcel added").build();
			
		} catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}
	
	@POST
	@Path("/modifyParcel")
	public Response modifyParcel(ParcelData data) {
		Transaction tn = datastore.newTransaction();

		Key parcelKey = datastore.newKeyFactory().setKind("Parcel").newKey(data.parcelName);
		Entity parcel = tn.get(parcelKey);
		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.owner);
		Entity user = tn.get(userKey);
		
		try {
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
					.set(PARCEL_ID, data.parcelId)
					.set(PARCEL_NAME, data.parcelName)
					.set(DESCRIPTION, data.description)
					.set(GROUND_COVER_TYPE, data.groundType)
					.set(CURR_USAGE, data.currUsage)
					.set(PREV_USAGE, data.prevUsage)
					.set(AREA, data.area)
					.build();
			
			tn.put(parcel);
			tn.commit();
			
		}catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		}
		
		return Response.ok("Parcel changed").build();
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