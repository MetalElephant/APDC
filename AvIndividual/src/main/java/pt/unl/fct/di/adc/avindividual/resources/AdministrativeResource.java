package pt.unl.fct.di.adc.avindividual.resources;

import java.io.IOException;

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

    private static final Logger LOG = Logger.getLogger(AdministrativeResource.class.getName());
	private final Gson g = new Gson();

	static final String SENDGRID_API_KEY = "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";
	static final String SENDGRID_SENDER = "app.land.it@gmail.com";

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

	private UserResource ur = new UserResource();
	private static final Random r = new Random();
	
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

	private static final String UNDEFINED = "Não Definido";

	//Keys
	private static final String USER = "Utilizador";
    private static final String TOKEN = "Token";
	private static final String SECRET = "Segredo";
    
    public AdministrativeResource() {}

	// Use remove user from UserResources to remove moderators

	// Use modify from UserResources to modify moderators

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerRepresentative(RegisterModeratorData data) throws IOException {
		LOG.info("Attempt to register user: " + data.username);

		//Check if data was input correctly
		if (!data.validData())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		if(!data.validEmailFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong email format: try example@domain.com").build();
		
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
				return Response.status(Status.NOT_FOUND).entity("User registering doesn't exist").build();
			}

			//Check if user registering is logged in
			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
            Entity secret = datastore.get(secretKey);
    
            if (!ur.isLoggedIn(secret, token, data.usernameReg, tn)){
                LOG.warning("User " + data.usernameReg + " not logged in.");
                return Response.status(Status.FORBIDDEN).entity("User " + data.usernameReg + " not logged in.").build();
            }
            
			//Check if user already exists
			if (user != null) {
				LOG.warning("User already exists:" + data.username);
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("User already exists.").build();
			}

			String password = generatePassword(12);

			if(verifyRegister(userReg)) {
				user = Entity.newBuilder(userKey)
						.set(NAME, data.name)
						.set(PASSWORD, DigestUtils.sha512Hex(password))
						.set(EMAIL, data.email)
						.set(ROLE, data.isRep ? Roles.REPRESENTANTE.getRole() : Roles.MODERADOR.getRole())
						.set(DISTRICT, data.district)
						.set(COUNTY, data.county)
						.set(AUTARCHY, data.autarchy)
						.set(STREET, data.street)
						.set(MPHONE, data.mobilePhone)
						.set(HPHONE, data.homePhone)
						.set(NIF, data.nif)
						.set(PHOTO, UNDEFINED)
						.set(POINTS, -1)
						.set(NPARCELSCRT, 0)
						.set(NPARCELSCO, 0)
						.set(NFORUMS, 0)
						.set(NMSGS, 0)
						.set(CTIME, Timestamp.now())
						.build();


				String subject = "Bem-vindo ao LANDIT, " + data.username + " !";
				Content content = new Content("text/plain", 
											"Por favor use as seguintes credenciais para fazer login. Será indicado que altere a password após o fazer.\n" 
											+ "Username: " + data.username + "\n"
											+ "Password: " + password);

				sendAutomaticEmail(data.email, subject, content);

				LOG.fine("Registered representative: " + data.username);

				tn.add(user);
				tn.commit();

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
		return (userReg.getString(ROLE).equals(Roles.SUPERUSER.getRole()) || userReg.getString(ROLE).equals(Roles.MODERADOR.getRole()));
	}

	public void sendAutomaticEmail(String to_user, String subject, Content content) throws IOException {		
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