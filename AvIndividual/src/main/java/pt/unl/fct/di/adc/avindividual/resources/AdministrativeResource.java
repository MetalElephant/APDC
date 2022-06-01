package pt.unl.fct.di.adc.avindividual.resources;

import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.appengine.repackaged.org.apache.commons.codec.digest.DigestUtils;
import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;
import com.google.gson.Gson;

import pt.unl.fct.di.adc.avindividual.util.RegisterData;
import pt.unl.fct.di.adc.avindividual.util.Roles;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class AdministrativeResource {

    private static final Logger LOG = Logger.getLogger(UserResource.class.getName());
	private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	
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
	private static final String CTIME = "creation time";


	private static final String PUBLIC = "Public";

	//Roles
	private static final String SU = "SU";

	//Token information
	private static final String TOKENID = "token ID";
	private static final String TOKENUSER = "token user";
	private static final String TOKENCREATION = "token creation";
	private static final String TOKENEXPIRATION = "token expiration";

	//Code info
	private static final String EXPTIME = "expiration time";

	//Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String CODE = "Code";
    
    public AdministrativeResource() {}

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerModerator(RegisterData data) {
		LOG.info("Attempt to register user: " + data.username);

		//Check if data was input correctly
		if (!data.validData())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		if(!data.validEmailFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong email format: try example@domain.com").build();
		if(!data.validPasswordFormat())
			return Response.status(Status.BAD_REQUEST).entity("Passwords should be at least 5 chars long, contain at least 1 "+
			"letter, 1 upper case letter and 1 special character").build();
		if(!data.confirmedPassword())
			return Response.status(Status.BAD_REQUEST).entity("Passwords don't match.").build();


		Transaction tn = datastore.newTransaction();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);

		try {
			Entity user = tn.get(userKey);
            
			//Check if user already exists
			if (user != null) {
				LOG.warning("User already exists:" + data.username);
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("User Already Exists").build();
			}

			//Create User
			user = Entity.newBuilder(userKey)
					.set(NAME, data.name)
					.set(PASSWORD, DigestUtils.sha512Hex(data.password))
					.set(EMAIL, data.email)
					.set(ROLE, Roles.MODERATOR.name())		
					.set(MPHONE, data.mobilePhone)
					.set(HPHONE, data.homePhone)
					.set(ADDRESS, data.address)
					.set(NIF, data.nif)
					.set(VISIBILITY, data.visibility)
					.set(CTIME, Timestamp.now())
                    .build();

			tn.add(user);
			tn.commit(); 

			LOG.fine("Registered moderator: " + data.username);

			return Response.ok(g.toJson(null)).build();
		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}
}