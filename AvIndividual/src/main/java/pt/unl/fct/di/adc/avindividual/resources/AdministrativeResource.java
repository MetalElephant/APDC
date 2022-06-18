package pt.unl.fct.di.adc.avindividual.resources;

import java.io.IOException;
import java.util.Arrays;
import java.util.Random;
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

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import pt.unl.fct.di.adc.avindividual.util.RegisterModeratorData;
import pt.unl.fct.di.adc.avindividual.util.Roles;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class AdministrativeResource {

    private static final Logger LOG = Logger.getLogger(UserResource.class.getName());
	private final Gson g = new Gson();

	static final String SENDGRID_API_KEY = "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";
	static final String SENDGRID_SENDER = "app.land.it@gmail.com";

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

	private UserResource ur = new UserResource();
	private static final Random r = new Random();
	
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

	private static final String PUBLIC = "Public";

	//Roles
	private static final String SU = "SU";

	//Token information
	private static final String TOKENID = "token ID";
	private static final String TOKENUSER = "token user";
	private static final String TOKENCREATION = "token creation";
	private static final String TOKENEXPIRATION = "token expiration";

	//Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String CODE = "Code";
    
    public AdministrativeResource() {}

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerModerator(RegisterModeratorData data) throws IOException {
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

		data.optionalAttributes();

		Transaction tn = datastore.newTransaction();

		Key userRegKey = datastore.newKeyFactory().setKind(USER).newKey(data.usernameReg);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.usernameReg);
        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);

		try {
			Entity userReg = tn.get(userRegKey);
			Entity token = tn.get(tokenKey);
			Entity user = tn.get(userKey);

			//Check if user registering exists
			if(userReg == null) {
				LOG.warning("User registering doesn't exist: " + data.usernameReg);
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User registering doesn't exist").build();
			}

			//Check if user registering is logged in
			if(!ur.isLoggedIn(token, data.usernameReg)) {
				LOG.warning("User " + data.usernameReg + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.usernameReg + " not logged in.").build();
			}
            
			//Check if user already exists
			if (user != null) {
				LOG.warning("User already exists:" + data.username);
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("User Already Exists").build();
			}

			String password = generatePassword(8);

			if(verifyRegister(userReg)) {
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
						.set(POINTS, -1)
						.set(CTIME, Timestamp.now())
						.build();

				tn.add(user);
				tn.commit(); 

				LOG.fine("Registered moderator: " + data.username);

				sendAutomaticEmail(data.email, data.name, password);

				return Response.ok(g.toJson(null)).build();
			} else {
				LOG.warning("Unable to register new moderator.");
				return Response.status(Status.FORBIDDEN).build();
			}
		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}

	private boolean verifyRegister(Entity userReg) {
		if(userReg.getString(ROLE).equals(Roles.SU.getRole()) ||
				userReg.getString(ROLE).equals(Roles.MODERATOR.getRole())) {
					return true;
		}

		return false;
	}

	private void sendAutomaticEmail(String to_user, String username, String password) throws IOException {		
		// Set content for request.
		Email to = new Email(to_user);
		Email from = new Email(SENDGRID_SENDER);
		String subject = "Welcome to Land It, " + username + " !";
		Content content = new Content("text/plain", "Please use these credentials to login. You will be prompted to change the password.\n" 
											+ "Username: " + username + "\n"
											+ "Password: " + password);
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

	private static String generatePassword(int length) {
		String capitalCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
		String specialCharacters = "!@#$";
		String numbers = "1234567890";
		String combinedChars = capitalCaseLetters + lowerCaseLetters + specialCharacters + numbers;
		char[] password = new char[length];
  
		password[0] = lowerCaseLetters.charAt(r.nextInt(lowerCaseLetters.length()));
		password[1] = capitalCaseLetters.charAt(r.nextInt(capitalCaseLetters.length()));
		password[2] = specialCharacters.charAt(r.nextInt(specialCharacters.length()));
		password[3] = numbers.charAt(r.nextInt(numbers.length()));
	 
		for(int i = 4; i< length ; i++) {
		   password[i] = combinedChars.charAt(r.nextInt(combinedChars.length()));
		}

		return String.valueOf(password);
	}
}