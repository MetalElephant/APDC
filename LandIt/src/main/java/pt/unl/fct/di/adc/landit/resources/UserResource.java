package pt.unl.fct.di.adc.landit.resources;

import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;
import java.util.Calendar;
import java.util.Date;

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

import com.google.gson.Gson;

import pt.unl.fct.di.adc.landit.util.AuthToken;
import pt.unl.fct.di.adc.landit.util.LoginData;
import pt.unl.fct.di.adc.landit.util.PasswordUpdateData;
import pt.unl.fct.di.adc.landit.util.RegisterData;
import pt.unl.fct.di.adc.landit.util.RequestData;
import pt.unl.fct.di.adc.landit.util.Roles;
import pt.unl.fct.di.adc.landit.util.UserUpdateData;
import pt.unl.fct.di.adc.landit.util.Info.UserInfo;

import com.google.cloud.datastore.Entity.Builder;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.Storage;
import com.google.appengine.repackaged.org.apache.commons.codec.digest.DigestUtils;
import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.storage.StorageOptions;

@Path("/user")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class UserResource {
	private static final Logger LOG = Logger.getLogger(UserResource.class.getName());

	private final Gson g = new Gson();

	private StatisticsResource sr = new StatisticsResource();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	
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

	//Forum information
    private static final String TOPIC = "Tópico";
    private static final String CRT_DATE = "Data de criação";

	//Bucket information
	private static final String PROJECT_ID = "Land It";
    private static final String BUCKET_NAME = "landit-app.appspot.com";
    private static final String URL = "https://storage.googleapis.com/landit-app.appspot.com/";

	//Token information
	private static final String TOKENID = "ID";
	//private static final String TOKENUSER = "Utilizador";
	public static final long EXPIRATION_TIME = 1000 * 60 * 60 * 2; // 2h

	//Code info
	private static final String EXPTIME = "Tempo de expiração";

	//Keys
	private static final String USER = "Utilizador";
    private static final String TOKEN = "Token";
	private static final String STAT = "Estatística";
	private static final String CODE = "Código";
	private static final String SECRET = "Segredo";

	//Forums
	private static final String PARCEL = "Parcela";
	private static final String FORUM = "Fórum";
    private static final String MESSAGE = "Mensagem";

	private static final boolean ADD = true;
	
	public UserResource() {}

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerUser(RegisterData data) {
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

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key codeOwnerKey = datastore.newKeyFactory().setKind(USER).newKey(data.getCodeUser());
		Key redeemCodeKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.getCodeUser())).setKind(CODE).newKey(data.code);
		Key generatedCodeKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.username)).setKind(CODE).newKey(data.generateCode());
		Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

		try {
			Entity user = tn.get(userKey);
            
			//Check if user already exists
			if (user != null) {
				LOG.warning("User already exists:" + data.username);
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("User Already Exists").build();
			}

			Entity codeOwner = tn.get(codeOwnerKey);

			Entity redeemCodeEntity = tn.get(redeemCodeKey);
			
			int points = 0;

			//TODO Should also verify this in another method for frontend
			if (redeemCodeEntity != null) {
				points = redeemCode(redeemCodeEntity, user, codeOwner);
				addPointsToOwner(codeOwner, points, tn);	
			}
			
			//call some function to verify code and reward points, extra rewards for the first 3 months
			//If indeed implements a points system update the other persons points as well
			
			//Create User and Code entity
			user = Entity.newBuilder(userKey)
				.set(NAME, data.name)
				.set(PASSWORD, DigestUtils.sha512Hex(data.password))
				.set(EMAIL, data.email)
				.set(ROLE, data.role)
				.set(DISTRICT, data.district)
				.set(COUNTY, data.county)
				.set(AUTARCHY, data.autarchy)
				.set(STREET, data.street)
				.set(MPHONE, data.mobilePhone)
				.set(HPHONE, data.homePhone)
				.set(NIF, data.nif)
				.set(PHOTO, uploadPhoto(data.username, data.photo))
				.set(POINTS, points)
				.set(NPARCELSCRT, 0)
				.set(NPARCELSCO, 0)
				.set(NFORUMS, 0)
				.set(NMSGS, 0)
				.set(CTIME, Timestamp.now())
				.build();

			//Date for 3 months from now, when code loses bonus
			Calendar expDate = Calendar.getInstance();
			expDate.add(Calendar.MONTH, 3);

			Entity generatedCodeEntity = Entity.newBuilder(generatedCodeKey)
				.set(EXPTIME, Timestamp.of(expDate.getTime()))
				.build();

			//Update statistics
			sr.updateStats(statKey, tn.get(statKey), tn, ADD);

			tn.add(user, generatedCodeEntity);

			tn.commit();

			LOG.fine("Registered user: " + data.username);

			return Response.ok(g.toJson(null)).build();
		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}
	
	@PUT
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response doLogin(LoginData data) {	
		LOG.info("Attempt to login user: " + data.username);
		
        //Check if data was input correctly
        if (!data.validData())
                return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);

		Transaction tn = datastore.newTransaction();

		try{
			Entity user = tn.get(userKey);
			
			if (user != null){
				String hashedPwd = user.getString(PASSWORD);

				if(hashedPwd.equals(DigestUtils.sha512Hex(data.password))) {						
					Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
					Entity secret = tn.get(secretKey);
					Entity tokenEntity = tn.get(tokenKey);
					
					/*Guarantee user isn't already logged in
					if (!canLogin(secret, tokenEntity, tn)) {
						LOG.warning("User " + data.username + " already logged in.");
						return Response.status(Status.CONFLICT).entity("User " + data.username + " already logged in.").build();
					}*/
					
					String token = createToken(secret);

					if(token.equals("null")) {
						LOG.warning("Error creating token.");
						return Response.status(Status.EXPECTATION_FAILED).entity("Error creating token.").build();
					}

					AuthToken tokenObj = new AuthToken(data.username, token);
	
					tokenEntity = Entity.newBuilder(tokenKey)
							.set(TOKENID, tokenObj.tokenID)
							.set(USER, tokenObj.username)
							.build();
					
					tn.put(tokenEntity);
					tn.commit();
					
					LOG.info("User logged in: " + data.username);
					
					return Response.ok(g.toJson(tokenObj)).build();

				}else {
					LOG.warning("Wrong password for user:" + data.username);
					tn.rollback();
					return Response.status(Status.FORBIDDEN).entity("Wrong password.").build();
				}
			}else{
				LOG.warning("User: " + data.username +" does not exist");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User: " + data.username +" does not exist.").build();
			}
		}finally{
			if (tn.isActive())
				tn.rollback();		
		}
	}

	
	@DELETE
	@Path("/remove")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response removeUser(RequestData data) {
		LOG.info("Attempt to remove user: " + data.name);
		//TODO Remove user code and rewards
		//Check if data was input correctly
		if (!data.isDataValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key userToRemoveKey = datastore.newKeyFactory().setKind(USER).newKey(data.name);

		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);	
		Key tokenToRemoveKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.name);

		Key statKeyU = datastore.newKeyFactory().setKind(STAT).newKey(USER);
		Key statKeyP = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);

		try {
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity userToRemove = tn.get(userToRemoveKey);

			if (user == null) {
				LOG.warning("User " + data.username + " does not exist.");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if (userToRemove == null){
				LOG.warning("User to be removed" + data.name + " does not exist.");
				return Response.status(Status.NOT_FOUND).entity("User to be removed " + data.name + " does not exist.").build();
			}

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!isLoggedIn(secret, token, data.username, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if(!canUpdate(user, userToRemove)) {
				LOG.warning("User " + data.username + " unathourized to remove other User");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " unathourized to remove other User").build();
			}
			
			//Remove the token associated with the user if it exists
			if(tn.get(tokenToRemoveKey) != null)
				tn.delete(tokenToRemoveKey);
			
			deleteUserEntities(userToRemove, data.name, statKeyP, tn);

			//Update statistics
			sr.updateStats(statKeyU, tn.get(statKeyU), tn, !ADD);

			tn.delete(userToRemoveKey);
			tn.commit();

			return Response.ok("User " + data.username + " deleted User " + data.name).build();
		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}

	@PUT
	@Path("/update")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updateUser(UserUpdateData data) {
		LOG.info("Attempt to update user: " + data.usernameToUpdate);
		
		//Check if data was input correctly
		if (!data.validData())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		if(!data.validEmailFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong email format: try example@domain.com").build();
		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);		
		Key userUpdateKey = datastore.newKeyFactory().setKind(USER).newKey(data.usernameToUpdate);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);

		try {
			Entity user = tn.get(userKey);
			Entity userToUpdate = tn.get(userUpdateKey);
			Entity token = tn.get(tokenKey);

			if (user == null) {
				LOG.warning("User " + data.username + " does not exist.");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if (userToUpdate == null){
				LOG.warning("User to be updated" + data.usernameToUpdate + " does not exist.");
				return Response.status(Status.NOT_FOUND).entity("User to be updated " + data.usernameToUpdate + " does not exist.").build();
			}

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!isLoggedIn(secret, token, data.username, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}
			
			if(!canUpdate(user, userToUpdate)) {
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " does not have authorization to change one or more attributes.").build();
			}

			long nParcelsCo = user.getLong(NPARCELSCO);

			Builder build = Entity.newBuilder(userUpdateKey)
				.set(NAME, data.name)
				.set(PASSWORD, userToUpdate.getString(PASSWORD))
				.set(EMAIL, data.email)
				.set(ROLE, userToUpdate.getString(ROLE))
				.set(DISTRICT, data.district)
				.set(COUNTY, data.county)
				.set(AUTARCHY, data.autarchy)
				.set(STREET, data.street)
				.set(MPHONE, data.mobilePhone)
				.set(HPHONE, data.homePhone)
				.set(NIF, data.nif)
				.set(PHOTO, data.photo == null ? userToUpdate.getString(PHOTO) : uploadPhoto(data.username, data.photo))
				.set(POINTS, userToUpdate.getLong(POINTS))
				.set(NPARCELSCRT, userToUpdate.getLong(NPARCELSCRT))
				.set(NPARCELSCO, nParcelsCo)
				.set(NFORUMS, user.getLong(NFORUMS))
				.set(NMSGS, user.getLong(NMSGS))
				.set(CTIME, userToUpdate.getTimestamp(CTIME));

			for(long i = 0; i < nParcelsCo; i++){
				build.set(PARCEL+i, userToUpdate.getString(PARCEL+i));
			}

			userToUpdate = build.build();
		
			tn.put(userToUpdate);
			tn.commit();

			return Response.ok("User " + data.usernameToUpdate + "'s parameters updated.").build();

		} finally {
			if (tn.isActive())
				tn.rollback();
		}

	}

	@PUT
	@Path("/updatePwd")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response updatePwd(PasswordUpdateData data) {
		LOG.info("Attempt to modify password for user: " + data.username);
		
		if(!data.validData())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		if(!data.validPasswordFormat())
			return Response.status(Status.BAD_REQUEST).entity("Passwords should be at least 5 chars long, contain at least 1 letter and 1 special character.").build();
		if(!data.verifyPassword())
			return Response.status(Status.BAD_REQUEST).entity("Password confirmation doesn't match password.").build();
		
		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		
		try {
			Entity user = tn.get(userKey);
			Entity token = tn.get(tokenKey);

			if (user == null) {
				LOG.warning("User " + data.username + " does not exist.");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if(!user.getString(PASSWORD).equals(DigestUtils.sha512Hex(data.oldPwd))) {
				LOG.warning("Wrong password for :" + data.username);
				return Response.status(Status.BAD_REQUEST).entity("Original password is incorrect.").build();
			}

			Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
			Entity secret = tn.get(secretKey);

			if (!isLoggedIn(secret, token, data.username, tn)){
				LOG.warning("User " + data.username + " not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}
	
			String newPwd = DigestUtils.sha512Hex(data.newPwd);

			if(user.getString(PASSWORD).equals(newPwd)) {
					LOG.warning("Old password can't be the same as new password.");
					return Response.status(Status.CONFLICT).entity("Old password can't be the same as new password.").build();
			}

			long points = user.getLong(POINTS);

			if(points < 0) {
				points = 0;
			}

			long nParcelsCo = user.getLong(NPARCELSCO);

			Builder build = Entity.newBuilder(userKey)
					.set(NAME, user.getString(NAME))
					.set(PASSWORD, newPwd)
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
					.set(POINTS, points)
					.set(NPARCELSCRT, user.getLong(NPARCELSCRT))
					.set(NPARCELSCO, nParcelsCo)
					.set(NFORUMS, user.getLong(NFORUMS))
					.set(NMSGS, user.getLong(NMSGS))
					.set(CTIME, user.getTimestamp(CTIME));

			for(long i = 0; i < nParcelsCo; i++){
				build.set(PARCEL+i, user.getString(PARCEL+i));
			}

			user = build.build();

			tn.put(user);
			tn.commit();

			return Response.ok("User" + data.username + " updated password").build();

		} finally {
			if (tn.isActive())
				tn.rollback();
		}

	}

	@DELETE
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doLogout(RequestData data) {
		LOG.info("Attempt to logout user: " + data.username);

		if(!data.isUsernameValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);

		try {
			Entity user = tn.get(userKey);
			Entity token = tn.get(tokenKey);

			if (user == null) {
				LOG.warning("User " + data.username + " does not exist");
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if (token == null) {
				LOG.warning("User " + data.username + " is not logged in.");
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}
			
			tn.delete(tokenKey);
			tn.commit();

			return Response.ok(g.toJson(null)).build();

		} finally {
			if (tn.isActive())
				tn.rollback();
		}
	}
	
	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showUsers() {
		LOG.info("Attempt to list users for users");

		Query<Entity> queryUser = Query.newEntityQueryBuilder().setKind(USER).build();

		QueryResults<Entity> usersRes = datastore.run(queryUser);

		List<UserInfo> usersList = new LinkedList<>();

		usersRes.forEachRemaining(user -> {
			usersList.add(new UserInfo(user.getKey().getName(), user.getString(EMAIL), user.getString(NAME), 
							user.getString(DISTRICT), user.getString(COUNTY), user.getString(AUTARCHY), user.getString(STREET), 
							user.getString(HPHONE), user.getString(MPHONE), user.getString(NIF), user.getString(ROLE), user.getString(PHOTO), (int) user.getLong(POINTS)));
		});

		return Response.ok(g.toJson(usersList)).build();
	}

	@POST
    @Path("/showAllExceptSelf")
    @Consumes(MediaType.APPLICATION_JSON + ";charset=utf-8")
    @Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
    public Response showAllExceptSelf(RequestData data) {
        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        
        Entity userEntity = datastore.get(userKey);
        Entity token = datastore.get(tokenKey);

        if (userEntity == null) {
            LOG.warning("User does not exist");
            return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
        }

		Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(userEntity.getString(ROLE));
		Entity secret = datastore.get(secretKey);

		if (!isLoggedIn(secret, token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}

		Query<Entity> queryUser = Query.newEntityQueryBuilder().setKind(USER)
									   .setFilter(PropertyFilter.eq(ROLE, Roles.PROPRIETARIO.getRole()))
									   .build();

		QueryResults<Entity> usersRes = datastore.run(queryUser);

		List<UserInfo> usersList = new LinkedList<>();

		usersRes.forEachRemaining(user -> {
			if (!user.getKey().getName().equals(data.username)){
				usersList.add(new UserInfo(user.getKey().getName(), user.getString(EMAIL), user.getString(NAME), 
								user.getString(DISTRICT), user.getString(COUNTY), user.getString(AUTARCHY), user.getString(STREET), 
								user.getString(HPHONE), user.getString(MPHONE), user.getString(NIF), user.getString(ROLE), user.getString(PHOTO), (int) user.getLong(POINTS)));
			}
		});

        return Response.ok(g.toJson(usersList)).build();
    }

	@POST
	@Path("/info")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showSelf(RequestData data) {
		LOG.info("Attempting to show user " + data.username);

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

		if (!isLoggedIn(secret, token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}

		UserInfo u = new UserInfo(user.getKey().getName(), user.getString(EMAIL), user.getString(NAME), 
						user.getString(DISTRICT), user.getString(COUNTY), user.getString(AUTARCHY), user.getString(STREET), 
						user.getString(HPHONE), user.getString(MPHONE), user.getString(NIF), user.getString(ROLE), user.getString(PHOTO), (int) user.getLong(POINTS));

		return Response.ok(g.toJson(u)).build();
	}

	// Creates a JWT token given a secret
	private String createToken(Entity secret) {
		try {
			Algorithm alg = Algorithm.HMAC256(secret.getString(SECRET));
			long expirationTime = (new Date().getTime()) + EXPIRATION_TIME;
			Date expirationDate = new Date(expirationTime);

			return JWT.create()
					.withIssuer("landit")
					.withExpiresAt(expirationDate)
					.sign(alg);
		} catch(JWTCreationException exception) {
			return "null";
		}
	}

	// Verifies if a JWT token is valid given a secret
	private boolean verifyToken(String secret, String token) {
		try {
			Algorithm alg = Algorithm.HMAC256(secret);
			JWTVerifier verifier = JWT.require(alg)
							.withIssuer("landit")
							.acceptExpiresAt(EXPIRATION_TIME / 1000)
							.build();
			verifier.verify(token);
			
			return true;
		} catch(JWTVerificationException exception) {
			return false;
		}
	}
	
	// Checks if a user is already logged in, given a transaction
	public boolean isLoggedIn(Entity secret, Entity token, String username, Transaction tn){
		if (token == null)
			return false;
		
		if (!verifyToken(secret.getString(SECRET), token.getString(TOKENID))){
			tn.delete(token.getKey());
			tn.commit();
			return false;
		}

		return true;
	}

	// Checks if a user is already logged in
	public boolean isLoggedIn(Entity secret, Entity token, String username){
		if (token == null)
			return false;
		
		Transaction tn = datastore.newTransaction();

		if (!verifyToken(secret.getString(SECRET), token.getString(TOKENID))){
			try{
				tn.delete(token.getKey());
				tn.commit();

				return false;

			}finally{
				if (tn.isActive())
					tn.rollback();;
			}
			
		}
		return true;
	}

	// Checks if an update can proceed given two entities based on their roles
	public boolean canUpdate(Entity e1, Entity e2) {
		Roles e1Role = Roles.valueOf(e1.getString(ROLE));

		switch(e1Role) {
			case SUPERUSER:
				return true;
			case MODERADOR:
				Roles e2Role = Roles.valueOf(e2.getString(ROLE));
				return (e1.getKey().getName().equals(e2.getKey().getName()) || (e2Role != Roles.SUPERUSER && e2Role != Roles.MODERADOR));
			case PROPRIETARIO:
			case REPRESENTANTE:
			case COMERCIANTE:
				return e1.getKey().getName().equals(e2.getKey().getName());
			default:
				return false;
		}
	}

	// Uploads a photo
	private String uploadPhoto(String name, byte[] data){
		if (data == null || data.length == 0)
			return UNDEFINED;

		Storage storage = StorageOptions.newBuilder().setProjectId(PROJECT_ID).build().getService();
		BlobId blobId = BlobId.of(BUCKET_NAME, name);
		BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType("image/jpeg").build();
		storage.create(blobInfo, data);
		storage.createAcl(blobId, Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER));

		return URL + name;
	}

	// Add points from code to registered user and new user
	private int redeemCode(Entity code, Entity newUser, Entity codeOwner){
		Timestamp expDate = code.getTimestamp(EXPTIME);

		int bonus = 0;
		 
		if (Timestamp.now().compareTo(expDate) < 0)
			bonus += 500;

		return bonus;
	}

	// Deletes everything that has the give user as an ancestor of the given type entity
	private void deleteEntities(String username, String entity, Transaction tn){
		Query<Entity> query = Query.newEntityQueryBuilder().setKind(entity)
									.setFilter(PropertyFilter.hasAncestor(datastore.newKeyFactory().setKind(USER).newKey(username)))
									.build();
	
		QueryResults<Entity> res = datastore.run(query);

		Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(entity);

		res.forEachRemaining(e -> {
			tn.delete(e.getKey());
			sr.updateStats(statKey, tn.get(statKey), tn, !ADD);
		});
	}

	// Deletes all the messages created by a given user
	private void deleteUserMessages(String username, Transaction tn) {
		Query<Entity> query = Query.newEntityQueryBuilder().setKind(MESSAGE)
									.setFilter(PropertyFilter.eq(OWNER, username))
									.build();
	
		QueryResults<Entity> res = datastore.run(query);

		Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(MESSAGE);

		res.forEachRemaining(e -> {
			tn.delete(e.getKey());
			sr.updateStats(statKey, tn.get(statKey), tn, !ADD);
		});
	}

	// Deletes a user from all the parcels (if he is a co-owner of them)
	private void removeFromParcels(Entity user, Transaction tn){
		long nParcelsCo = user.getLong(NPARCELSCO);
		String username = user.getKey().getName();

		Key parcelKey;
		Entity parcel;

		for(int i = 0; i < nParcelsCo; i++){
			String parcelInfo = user.getString(PARCEL+i);
			String parcelOwner = parcelInfo.substring(0, parcelInfo.indexOf(":"));
			String parcelName = parcelInfo.substring(parcelInfo.indexOf(":")+1);

			parcelKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, parcelOwner)).setKind(PARCEL).newKey(parcelName);
			parcel = tn.get(parcelKey);

			int n1 = Integer.parseInt(parcel.getString(NOWNERS));
			int n2 = Integer.parseInt(parcel.getString(NMARKERS));

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
					.set(CONFIRMED, parcel.getBoolean(CONFIRMED))
                    .set(NMARKERS, parcel.getString(NMARKERS))
					.set(NOWNERS, parcel.getString(NOWNERS));

			int aux = 0;

			for(int j = 0; j < n1; j++){
				String owner = parcel.getString(OWNER+j);
				if (!owner.equals(username))
					builder.set(OWNER+(aux++), owner);
			}
					
			for(int j = 0; j < n2; j++) {
				builder.set(MARKER+j, parcel.getLatLng(MARKER+j));
			}

			parcel = builder.build();

			tn.put(parcel);
		}
	}

	// Adds a given amount of points to a user
	private void addPointsToOwner(Entity codeOwner, int points, Transaction tn) {
		long nParcelsCo = codeOwner.getLong(NPARCELSCO);
		
		Builder builder = Entity.newBuilder(codeOwner.getKey())
			.set(NAME, codeOwner.getString(NAME))
			.set(PASSWORD, codeOwner.getString(PASSWORD))
			.set(EMAIL, codeOwner.getString(EMAIL))
			.set(ROLE, codeOwner.getString(ROLE))
			.set(DISTRICT, codeOwner.getString(DISTRICT))
			.set(COUNTY, codeOwner.getString(COUNTY))
			.set(AUTARCHY, codeOwner.getString(AUTARCHY))
			.set(STREET, codeOwner.getString(STREET))
			.set(MPHONE, codeOwner.getString(MPHONE))
			.set(HPHONE, codeOwner.getString(HPHONE))
			.set(NIF, codeOwner.getString(NIF))
			.set(PHOTO, codeOwner.getString(PHOTO))
			.set(POINTS, codeOwner.getLong(POINTS) + points)
			.set(NPARCELSCRT, codeOwner.getLong(NPARCELSCRT))
			.set(NPARCELSCO, nParcelsCo)
			.set(NFORUMS, codeOwner.getLong(NFORUMS))
			.set(NMSGS, codeOwner.getLong(NMSGS))
			.set(CTIME, codeOwner.getTimestamp(CTIME));

		for(long i = 0; i < nParcelsCo; i++) {
			builder.set(PARCEL+i, codeOwner.getString(PARCEL+i));
		}

		codeOwner = builder.build();

		tn.put(codeOwner);
	}

	// Deletes all entities that are realted to a given user
	private void deleteUserEntities(Entity user, String username, Key statKey, Transaction tn){
		deleteParcels(username, statKey, tn);
		removeFromParcels(user, tn);
		deleteEntities(username, FORUM, tn);
		deleteEntities(username, CODE, tn);
		deleteUserMessages(username, tn);
	}

	// Deletes all the parcels that he is the sole owner and transfers parcel ownership of the parcel if there are co-owners
	private void deleteParcels(String username, Key statKey, Transaction tn){
		Query<Entity> query = Query.newEntityQueryBuilder().setKind(PARCEL)
									.setFilter(PropertyFilter.hasAncestor(datastore.newKeyFactory().setKind(USER).newKey(username)))
									.build();
									
		QueryResults<Entity> res = datastore.run(query);

		res.forEachRemaining(parcel -> {
			int nOwners = Integer.parseInt(parcel.getString(NOWNERS));;

			if (nOwners > 0){
				String parcelName = parcel.getKey().getName();
				String owner = parcel.getString(OWNER+(nOwners-1));
				nOwners--;

				updateForumRemoval(username, owner, parcelName, tn);
				updateParcelRemoval(nOwners, owner, parcelName, parcel, tn);
				updateUserOwner(owner, parcelName, tn);
			}else{
				sr.updateStats(statKey, tn.get(statKey), tn, !ADD);
			}

			tn.delete(parcel.getKey());
		});
	}

	// Updates a parcel, giving its main ownership to the last co-owner
	private void updateParcelRemoval(int nOwners, String owner, String parcelName, Entity parcel, Transaction tn){
		int nMarkers = Integer.parseInt(parcel.getString(NMARKERS));

		Key parcelKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, owner)).setKind(PARCEL).newKey(parcelName);

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
			.set(CONFIRMED, parcel.getBoolean(CONFIRMED))
			.set(NMARKERS, parcel.getString(NMARKERS))
			.set(NOWNERS, String.valueOf(nOwners));

		for(int i = 0; i < nOwners; i++){
			builder.set(OWNER+i, parcel.getString(OWNER+i));
		}
		
		for(int i = 0; i< nMarkers; i++) {
			builder.set(MARKER+i, parcel.getLatLng(MARKER+i));
		}

		Entity newParcel = builder.build();

		tn.put(newParcel);
	}

	// Updates a parcel's foruns to a new owner
	private void updateForumRemoval(String oldOwner, String newOwner, String parcelName, Transaction tn){
		Key oldForumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, oldOwner)).setKind(FORUM).newKey(parcelName);
		Key newForumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, newOwner)).setKind(FORUM).newKey(parcelName);

		Entity oldForum = tn.get(oldForumKey);

		Entity newForum = Entity.newBuilder(newForumKey)
                    .set(TOPIC, oldForum.getString(TOPIC))
                    .set(CRT_DATE, oldForum.getString(CRT_DATE))
                    .build();

		Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(FORUM);

		sr.updateStats(statKey, tn.get(statKey), tn, !ADD);

		tn.put(newForum);
	}

	// Update the a user as the new main owner of a parcel
	private void updateUserOwner(String username, String parcelName, Transaction tn){
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
					.set(POINTS, user.getLong(POINTS))
					.set(NPARCELSCRT, user.getLong(NPARCELSCRT)+1)
					.set(NPARCELSCO, nParcelsCo-1)
					.set(NFORUMS, user.getLong(NFORUMS)+1)
					.set(NMSGS, user.getLong(NMSGS))
					.set(CTIME, user.getTimestamp(CTIME));
			
			int aux = 0;
			String parcelInfo, parcel;

			for(long i = 0; i < nParcelsCo; i++){
				parcelInfo = user.getString(PARCEL+i);
				parcel = parcelInfo.substring(parcelInfo.indexOf(":")+1);

				if(!parcelName.equals(parcel))
					build.set(PARCEL+(aux++), parcelInfo);
			}

			user = build.build();

			tn.put(user);
	}
}
