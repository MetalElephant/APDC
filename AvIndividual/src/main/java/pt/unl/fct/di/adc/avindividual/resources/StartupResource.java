package pt.unl.fct.di.adc.avindividual.resources;

import java.util.logging.Logger;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import pt.unl.fct.di.adc.avindividual.util.Roles;

import com.google.appengine.repackaged.org.apache.commons.codec.digest.DigestUtils;
import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;

@Path("/startup")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class StartupResource {

	private static final Logger LOG = Logger.getLogger(StatisticsResource.class.getName());

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    //Create a stats entity with the key being the number of users/parcels in total
    //Add 1 to the count when a user/parcel is created and minus 1 when removed

	//Keys
	private static final String USER = "User";
    private static final String PARCEL = "Parcel";
    private static final String STAT = "Statistics";
    private static final String VALUE = "Value";

	//User information
	private static final String NAME = "name";
	private static final String PASSWORD = "password";
	private static final String EMAIL = "email";
	private static final String ROLE = "role";
	private static final String MPHONE = "mobile phone";
	private static final String HPHONE = "home phone";
	private static final String ADDRESS = "address";
	private static final String NIF = "nif";
	private static final String VISIBILITY = "visibility";
	private static final String POINTS = "points";
	private static final String CTIME = "creation time";

	private static final String SU_NAME = "Name";
    private static final String SU_USERNAME = "Username";
    private static final String SU_PASSWORD = "Pass";
    private static final String SU_EMAIL = "email@gmail";
	private static final String SU_MPHONE = "112";
	private static final String SU_HPHONE = "112";
	private static final String SU_ADDRESS = "FCT UNL";
	private static final String SU_NIF = "0";
	private static final String SU_VISIBILITY = "Public";
	private static final String SU_POINTS = "-1";

	public StartupResource() {}

	@POST
	@Path("/superuser")
	public Response createSuperUser() {
		LOG.info("Attempt to create super user.");

        Transaction tn = datastore.newTransaction();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(SU_USERNAME);

        try {
            Entity SU = tn.get(userKey);

            if (SU != null){
                return Response.status(Status.CONFLICT).entity("Super User already exists.").build();
            }

            SU = Entity.newBuilder(userKey)
                    .set(NAME, SU_NAME)
                    .set(PASSWORD, DigestUtils.sha512Hex(SU_PASSWORD))
                    .set(EMAIL, SU_EMAIL)
                    .set(ROLE, Roles.SU.getRole())
                    .set(MPHONE, SU_MPHONE)
                    .set(HPHONE, SU_HPHONE)
                    .set(ADDRESS, SU_ADDRESS)
                    .set(NIF, SU_NIF)
                    .set(VISIBILITY, SU_VISIBILITY)
                    .set(POINTS, SU_POINTS)
                    .set(CTIME, Timestamp.now())
                    .build();
            
            tn.add(SU);
            tn.commit();

            return Response.ok("Super User created.").build();
        }finally{
            if (tn.isActive())
            tn.rollback();
        }
	}

    @POST
	@Path("/statistics")
	public Response createStatistics() {
		LOG.info("Attempt to create statistics.");

        Transaction tn = datastore.newTransaction();

        Key userStatsKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);
        Key parcelStatsKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);

        try {
            Entity uStats = tn.get(userStatsKey);
            Entity pStats = tn.get(parcelStatsKey);

            if (uStats != null){
                return Response.status(Status.CONFLICT).entity("Statistics already exist.").build();
            }

            uStats = Entity.newBuilder(userStatsKey)
                    .set(VALUE, 0L)
                    .build();

            pStats = Entity.newBuilder(parcelStatsKey)
                    .set(VALUE, 0L)
                    .build();
            
            tn.add(uStats, pStats);
            tn.commit();

            return Response.ok("Statistics created.").build();
        }finally{
            if (tn.isActive())
            tn.rollback();
        }
	}
}
