package pt.unl.fct.di.adc.avindividual.resources;

import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;
import java.util.Calendar;

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
import com.google.cloud.datastore.Entity.Builder;

import pt.unl.fct.di.adc.avindividual.util.AuthToken;
import pt.unl.fct.di.adc.avindividual.util.LoginData;
import pt.unl.fct.di.adc.avindividual.util.UserUpdateData;
import pt.unl.fct.di.adc.avindividual.util.Info.UserInfo;
import pt.unl.fct.di.adc.avindividual.util.PasswordUpdateData;
import pt.unl.fct.di.adc.avindividual.util.RegisterData;
import pt.unl.fct.di.adc.avindividual.util.RequestData;
import pt.unl.fct.di.adc.avindividual.util.Roles;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Acl;
import com.google.cloud.storage.Storage;
import com.google.appengine.repackaged.org.apache.commons.codec.digest.DigestUtils;
import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;
import com.google.cloud.storage.StorageOptions;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class UserResource {
	//TODO have a function create user rather than doing it manually everytime (same for parcel)
	private static final Logger LOG = Logger.getLogger(UserResource.class.getName());

	private final Gson g = new Gson();

	//private AdministrativeResource ar = new AdministrativeResource();
	private StatisticsResource sr = new StatisticsResource();
	//private ParcelResource pr = new ParcelResource();

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
	private static final String PHOTO = "photo";
	private static final String SPEC = "specialization";
	private static final String CTIME = "creation time";
	private static final String NPARCELS = "number of parcels";
	private static final String NFORUMS = "number of forums";
	private static final String NMSGS = "number of messages";

	private static final String UNDEFINED = "Não Definido";

	//Bucket information
	private static final String PROJECT_ID = "Land It";
	private static final String BUCKET_NAME = "our-hull.appspot.com";
	private static final String URL =  "https://storage.googleapis.com/our-hull.appspot.com/";

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
	private static final String STAT = "Statistics";
	private static final String CODE = "Code";

	//Forums
	private static final String PARCEL = "Parcel";
	private static final String FORUM = "Forum";
    private static final String MESSAGE = "Message";
	private static final String OWNER = "Owner";

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

			Entity redeemCodeEntity = tn.get(redeemCodeKey);

			int points = 0;
			//TODO Should also verify this in another method for frontend
			if (redeemCodeEntity != null)
				points = redeemCode(redeemCodeEntity, user, tn.get(codeOwnerKey));
			
			//call some function to verify code and reward points, extra rewards for the first 3 months
			//If indeed implements a points system update the other persons points as well
			
			//Create User and Code entity
			user = Entity.newBuilder(userKey)
					.set(NAME, data.name)
					.set(PASSWORD, DigestUtils.sha512Hex(data.password))
					.set(EMAIL, data.email)
					.set(ROLE, data.role)
					.set(MPHONE, data.mobilePhone)
					.set(HPHONE, data.homePhone)
					.set(ADDRESS, data.address)
					.set(NIF, data.nif)
					.set(PHOTO, uploadPhoto(data.username, data.photo))
					.set(SPEC, String.valueOf(points))
					.set(NPARCELS, 0)
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
	
	@POST
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
			Entity user = datastore.get(userKey);
			
			if (user != null){
				String hashedPwd = user.getString(PASSWORD);

				if(hashedPwd.equals(DigestUtils.sha512Hex(data.password))) {						
						Entity tokenEntity = tn.get(tokenKey);
						
						//Guarantee user isn't already logged in
						if (!canLogin(tokenEntity, tn)) {
							LOG.warning("User " + data.username + " already logged in.");
							tn.rollback();
							return Response.status(Status.CONFLICT).entity("User " + data.username + " already logged in.").build();
						}              
						
						AuthToken token = new AuthToken(data.username);
		
						tokenEntity = Entity.newBuilder(tokenKey)
								.set(TOKENID, token.tokenID)
								.set(TOKENUSER, token.username)
								.set(TOKENCREATION, token.validFrom)
								.set(TOKENEXPIRATION, token.validTo)
								.build();
						
						tn.add(tokenEntity);
						tn.commit();
						
						LOG.info("User logged in: "+data.username);
						
						return Response.ok(g.toJson(token)).build();

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

		Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

		try {
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity userToRemove = tn.get(userToRemoveKey);

			if (user == null) {
				LOG.warning("User " + data.username + " does not exist.");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if (userToRemove == null){
				LOG.warning("User to be removed" + data.name + " does not exist.");
				tn.rollback();
				return Response.status(Status.NOT_FOUND).entity("User to be removed " + data.name + " does not exist.").build();
			}

			if (!isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if(!canUpdate(user, userToRemove)) {
				LOG.warning("User " + data.username + " unathourized to remove other User");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " unathourized to remove other User").build();
			}
			
			//Remove the token associated with the user if it exists
			if(tn.get(tokenToRemoveKey) != null)
				tn.delete(tokenToRemoveKey);
			
			deleteUserEntities(data.name, tn);

			//Update statistics
			sr.updateStats(statKey, tn.get(statKey), tn, !ADD);

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
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if (userToUpdate == null){
				LOG.warning("User to be updated" + data.usernameToUpdate + " does not exist.");
				tn.rollback();
				return Response.status(Status.NOT_FOUND).entity("User to be updated " + data.usernameToUpdate + " does not exist.").build();
			}

			if (!isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}
			
			if(!canUpdate(user, userToUpdate)) {
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " does not have authorization to change one or more attributes.").build();
			}

			long nParcels = user.getLong(NPARCELS);

			Builder build = Entity.newBuilder(userUpdateKey)
			.set(NAME, data.name)
			.set(PASSWORD, userToUpdate.getString(PASSWORD))
			.set(EMAIL, data.email)
			.set(ROLE, userToUpdate.getString(ROLE))
			.set(MPHONE, data.mobilePhone)
			.set(HPHONE, data.homePhone)
			.set(ADDRESS, data.address)
			.set(NIF, data.nif)
			.set(PHOTO, data.photo == null ? userToUpdate.getString(PHOTO) : uploadPhoto(data.username, data.photo))
			.set(SPEC, userToUpdate.getString(SPEC))
			.set(NPARCELS, nParcels)
			.set(NFORUMS, user.getLong(NFORUMS))
			.set(NMSGS, user.getLong(NMSGS))
			.set(CTIME, userToUpdate.getTimestamp(CTIME));

			for(long i = 0; i < nParcels; i++){
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
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if(!user.getString(PASSWORD).equals(DigestUtils.sha512Hex(data.oldPwd))) {
				LOG.warning("Wrong password for :" + data.username);
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Original password is incorrect.").build();
			}

			if (!isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}
	
			String newPwd = DigestUtils.sha512Hex(data.newPwd);
			if(user.getString(PASSWORD).equals(newPwd)) {
					LOG.warning("Old password can't be the same as new password.");
					tn.rollback();
					return Response.status(Status.CONFLICT).entity("Old password can't be the same as new password.").build();
			}

			long nParcels = user.getLong(NPARCELS);

			Builder build = Entity.newBuilder(userKey)
					.set(NAME, user.getString(NAME))
					.set(PASSWORD, newPwd)
					.set(EMAIL, user.getString(EMAIL))
					.set(ROLE, user.getString(ROLE))
					.set(MPHONE, user.getString(MPHONE))
					.set(HPHONE, user.getString(HPHONE))
					.set(ADDRESS, user.getString(ADDRESS))
					.set(NIF, user.getString(NIF))
					.set(PHOTO, user.getString(PHOTO))
					.set(SPEC, user.getString(SPEC))
					.set(NPARCELS, nParcels)
					.set(NFORUMS, user.getLong(NFORUMS))
					.set(NMSGS, user.getLong(NMSGS))
					.set(CTIME, user.getTimestamp(CTIME));

			for(long i = 0; i < nParcels; i++){
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
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist.").build();
			}

			if (token == null) {
				LOG.warning("User " + data.username + " is not logged in.");
				tn.rollback();
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
			usersList.add(new UserInfo(user.getKey().getName(), user.getString(EMAIL), user.getString(NAME), user.getString(HPHONE), user.getString(MPHONE), 
									  user.getString(ADDRESS), user.getString(NIF), user.getString(ROLE), user.getString(PHOTO), user.getString(SPEC)));
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

		//TODO update with secret
       	//Key secretKey = datastore.newKeyFactory().setKind(SECRET).newKey(user.getString(ROLE));
        //Entity secret = datastore.get(secretKey);

        if (!isLoggedIn(token, data.username)){
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
				usersList.add(new UserInfo(user.getKey().getName(), user.getString(EMAIL), user.getString(NAME), user.getString(HPHONE), user.getString(MPHONE), 
									  user.getString(ADDRESS), user.getString(NIF), user.getString(ROLE), user.getString(PHOTO), user.getString(SPEC)));
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

		if (!isLoggedIn(token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}

		UserInfo u = new UserInfo(user.getKey().getName(), user.getString(EMAIL), user.getString(NAME),
						 user.getString(HPHONE), user.getString(MPHONE), user.getString(ADDRESS), user.getString(NIF),
						 user.getString(ROLE), user.getString(PHOTO), user.getString(SPEC));

		return Response.ok(g.toJson(u)).build();
	}

	public boolean canUpdate(Entity e1, Entity e2) {
		Roles e1Role = Roles.valueOf(e1.getString(ROLE));

		switch(e1Role) {
			case SUPERUSER:
				return true;
			case MODERADOR:
				Roles e2Role = Roles.valueOf(e2.getString(ROLE));
				return (e2Role != Roles.SUPERUSER && e2Role != Roles.MODERADOR );
			case PROPRIETARIO:
			case REPRESENTANTE:
			case COMERCIANTE:
				return e1.getKey().getName().equals(e2.getKey().getName());
			default:
				return false;
		}
	}

	//Verify if token exists and is valid
	private boolean canLogin(Entity token, Transaction tn){
		if (token == null)
			return true;

		if (token.getLong(TOKENEXPIRATION) < System.currentTimeMillis()){
			tn.delete(token.getKey());
			return true;
		}

		return false;	
	}

	public boolean isLoggedIn(Entity token, String username){
		if (token == null)
			return false;
	
		if(token.getLong(TOKENEXPIRATION) < System.currentTimeMillis()) {
			doLogout(new RequestData(username));
			return false;
		}
				
		return true;
	}

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

	//Add points from code to registered user and new user
	private int redeemCode(Entity code, Entity newUser, Entity codeOwner){
		Timestamp expDate = code.getTimestamp(EXPTIME);

		int bonus = 1000;
		 
		if (Timestamp.now().compareTo(expDate) < 0)
			bonus += 500;
		
		//TODO add the bonus to the owner of the code	

		return bonus;
	}

	private void deleteUserEntities(String username, Transaction tn){
		deleteEntities(username, PARCEL, tn);
		deleteEntities(username, FORUM, tn);
		deleteEntities(username, CODE, tn);
		deleteUserMessages(username, tn);
	}

	private void deleteEntities(String username, String entity, Transaction tn){
		Query<Entity> query = Query.newEntityQueryBuilder().setKind(entity)
									.setFilter(PropertyFilter.hasAncestor(datastore.newKeyFactory().setKind(USER).newKey(username)))
									.build();
	
		QueryResults<Entity> res = datastore.run(query);

		res.forEachRemaining(e -> {
			tn.delete(e.getKey());
		});
	}

	private void deleteUserMessages(String username, Transaction tn) {
		Query<Entity> query = Query.newEntityQueryBuilder().setKind(MESSAGE)
									.setFilter(PropertyFilter.eq(OWNER, username))
									.build();
	
		QueryResults<Entity> res = datastore.run(query);

		res.forEachRemaining(e -> {
			tn.delete(e.getKey());
		});
	}
}
