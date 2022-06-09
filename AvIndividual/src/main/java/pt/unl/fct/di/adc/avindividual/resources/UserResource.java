package pt.unl.fct.di.adc.avindividual.resources;

import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;
import java.util.Calendar;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.google.gson.Gson;

import pt.unl.fct.di.adc.avindividual.util.AuthToken;
import pt.unl.fct.di.adc.avindividual.util.LoginData;
import pt.unl.fct.di.adc.avindividual.util.UserUpdateData;
import pt.unl.fct.di.adc.avindividual.util.Info.UserInfo;
import pt.unl.fct.di.adc.avindividual.util.PasswordUpdateData;
import pt.unl.fct.di.adc.avindividual.util.RegisterData;
import pt.unl.fct.di.adc.avindividual.util.RemoveData;
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

	//private ForumResource fr = new ForumResource();

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
	private static final String PHOTO = "photo";
	private static final String POINTS = "points";
	private static final String CTIME = "creation time";

	private static final String UNDEFINED = "UNDEFINED";

	//Bucket information
	private static final String PROJECT_ID = "Land It";
	private static final String BUCKET_NAME = "our-hull-344121.appspot.com";
	private static final String URL =  "https://storage.googleapis.com/our-hull-344121.appspot.com/";

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
	private static final String STAT = "Statistics";
	private static final String VALUE = "Value";
	
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
		Key statsKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

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
					.set(ROLE, Roles.USER.getRole())
					.set(MPHONE, data.mobilePhone)
					.set(HPHONE, data.homePhone)
					.set(ADDRESS, data.address)
					.set(NIF, data.nif)
					.set(VISIBILITY, data.visibility)
					.set(PHOTO, uploadPhoto(data.username, data.photo))
					.set(POINTS, String.valueOf(points))
					.set(CTIME, Timestamp.now())
                    .build();

			//Date for 3 months from now, when code loses bonus
			Calendar expDate = Calendar.getInstance();
			expDate.add(Calendar.MONTH, 3);

			Entity generatedCodeEntity = Entity.newBuilder(generatedCodeKey)
			.set(EXPTIME, Timestamp.of(expDate.getTime()))
			.build();

			//Update statistics
			Entity stats = tn.get(statsKey);

			if (stats != null){
				stats = Entity.newBuilder(statsKey)
						.set(VALUE, 1L + stats.getLong(VALUE))
						.build();
					
				tn.put(stats);
			}

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
	public Response removeUser(RemoveData data) {
		LOG.info("Attempt to remove user: " + data.usernameToRemove);
		//TODO Remove user code and rewards
		//Check if data was input correctly
		if (!data.validData())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

		Transaction tn = datastore.newTransaction();

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key userToRemoveKey = datastore.newKeyFactory().setKind(USER).newKey(data.usernameToRemove);

		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);	
		Key tokenToRemoveKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.usernameToRemove);

		Key statsKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);

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
				LOG.warning("User to be removed" + data.usernameToRemove + " does not exist.");
				tn.rollback();
				return Response.status(Status.NOT_FOUND).entity("User to be removed " + data.usernameToRemove + " does not exist.").build();
			}

			if (!isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			if (!canRemove(user, userToRemove)) {
				LOG.warning("User " + data.username + " unathourized to remove other User");
				tn.rollback();

				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " unathourized to remove other User").build();
			}
			
			//Remove the token associated with the user if it exists
			if(tn.get(tokenToRemoveKey) != null)
				tn.delete(tokenToRemoveKey);
			
			removeUserCodes(data.usernameToRemove, tn);

			//Update statistics
			Entity stats = tn.get(statsKey);

			if (stats != null){
				stats = Entity.newBuilder(statsKey)
						.set(VALUE, stats.getLong(VALUE)-1L)
						.build();
					
				tn.put(stats);
			}

			tn.delete(userToRemoveKey);
			tn.commit();

			return Response.ok("User " + data.username + " deleted User " + data.usernameToRemove).build();

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
		if(!data.validEmailFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong email format: try example@domain.com").build();
		if(!data.validRoleFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong type of role: try 'USER', 'GBO', 'GS' or 'SU'").build();
	
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
				return Response.status(Status.NOT_FOUND).entity("User to be updated" + data.usernameToUpdate + " does not exist.").build();
			}

			if (!isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}
			
			//To set what will stay the same value or what will actually be changed
			if(!canModify(data, user, userToUpdate))
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " does not have authorization to change one or more attributes.").build();

				userToUpdate = Entity.newBuilder(userUpdateKey)
					.set(NAME, data.name)
					.set(PASSWORD, userToUpdate.getString(PASSWORD))
					.set(EMAIL, data.email)
					.set(ROLE, data.role)
					.set(MPHONE, data.mobilePhone)
					.set(HPHONE, data.homePhone)
					.set(ADDRESS, data.address)
					.set(NIF, data.nif)
					.set(VISIBILITY, data.visibility)
					.set(POINTS, userToUpdate.getString(POINTS))
					.set(CTIME, userToUpdate.getTimestamp(CTIME))
					.build();
			
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
	
			String newPwd = DigestUtils.sha512Hex(data.newPwd);
			if(user.getString(PASSWORD).equals(newPwd)) {
					LOG.warning("Old password can't be the same as new password.");
					tn.rollback();
					return Response.status(Status.CONFLICT).entity("Old password can't be the same as new password.").build();
			}

			if (!isLoggedIn(token, data.username)){
				LOG.warning("User " + data.username + " not logged in.");
				tn.rollback();
				return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
			}

			user = Entity.newBuilder(userKey)
					.set(NAME, user.getString(NAME))
					.set(PASSWORD, newPwd)
					.set(EMAIL, user.getString(EMAIL))
					.set(ROLE, user.getString(ROLE))
					.set(MPHONE, user.getString(MPHONE))
					.set(HPHONE, user.getString(HPHONE))
					.set(ADDRESS, user.getString(ADDRESS))
					.set(NIF, user.getString(NIF))
					.set(VISIBILITY, user.getString(VISIBILITY))
					.set(CTIME, user.getTimestamp(CTIME))
					.build();
			
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
	
	@POST
	@Path("/list")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showUsers(RequestData data) {
		LOG.info("Attempt to list users for user: " + data.username);

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
			
		String userRole = user.getString(ROLE);
			
		List<String> userList = getQueries(userRole);

		return Response.ok(g.toJson(userList)).build();
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
		user.getString(ROLE), user.getString(VISIBILITY));

		return Response.ok(g.toJson(u)).build();
	}

	// TODO: we need a new data that has the user redeeming the reward, the owner and the name
	@PUT
	@Path("/redeemReward")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response redeemReward() {
		return null;
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

	//TODO No roles so right now we can always do it for the sake of testing
	private boolean canRemove(Entity user, Entity userToRemove) {
		/*
		String role1 = user.getString(ROLE);
		String role2 = userToRemove.getString(ROLE);
		String name1 = user.getString(USERNAME);
		String name2 = userToRemove.getString(USERNAME);
			if (role1.equals(USER) && !name1.equals(name2)) { // can only remove themselves
				return false;
			}
			if (role1.equals(GBO) && !role2.equals(USER)) { // can only remove USER level 
				return false;
			}
			if (role1.equals(GS) && role2.equals(SU)) { // can remove all but SU
				return false;
			}
		*/
		return true;
	}

	//TODO we won't need to check for null values if we get the old info so we will only need canUpdateValues
	private boolean canModify(UserUpdateData data, Entity user, Entity userToModify) {
		//if(!data.canUpdateValues(user.getString(ROLE), userToModify.getString(ROLE)))
			//return false;
		
		//update values so its easier to do transaction.put throught the data from ModifyData
		if (data.name == null || data.name.length() == 0)
			data.name = userToModify.getString(NAME);
		
		if (data.email == null || data.email.length() == 0)
			data.email = userToModify.getString(EMAIL);
		
		if (data.role == null || data.role.length() == 0)
			data.role = userToModify.getString(ROLE);
		
		if (data.mobilePhone == null || data.mobilePhone.length() == 0)
			data.mobilePhone = userToModify.getString(MPHONE);
		
		if (data.homePhone == null || data.homePhone.length() == 0)
			data.homePhone = userToModify.getString(HPHONE);
		
		if (data.address == null || data.address.length() == 0)
			data.address = userToModify.getString(ADDRESS);
		
		if (data.nif == null || data.nif.length() == 0)
			data.nif = userToModify.getString(NIF);
		
		if (data.visibility == null || data.visibility.length() == 0)
			data.visibility = userToModify.getString(VISIBILITY);
		return true;
	}

	private void removeUserCodes(String user, Transaction tn){
		Query<Entity> codesQuery = Query.newEntityQueryBuilder().setKind(CODE)
								.setFilter(PropertyFilter.hasAncestor(
                				datastore.newKeyFactory().setKind(USER).newKey(user)))
								.build();
		
		QueryResults<Entity> userCodes = datastore.run(codesQuery);

		while(userCodes.hasNext()){
			tn.delete(userCodes.next().getKey());
		}
	}

	private List<String> getQueries(String role) {
		if (role.equals(Roles.USER.getRole())) {

			Query<Entity> queryUSER = Query.newEntityQueryBuilder().setKind(USER)
					.build();

			QueryResults<Entity> users = datastore.run(queryUSER);

			List<String> allUsers = new LinkedList<String>();
			allUsers.add("List of Active Users: ");

			users.forEachRemaining(userList -> {
				allUsers.add("Username: " + userList.getKey().getName() + " -|- Name: " + userList.getString(NAME)
						+ " -|- Email: " + userList.getString(EMAIL));
			});

			return allUsers;

		}

		if (role.equals(Roles.SU.getRole())) {

			Query<Entity> query = Query.newEntityQueryBuilder().setKind(USER).build();

			return buildQueryList(query);
		}

		return null;

	}
	
	private List<String> buildQueryList(Query<Entity> query) {	
		QueryResults<Entity> users = datastore.run(query);
		
		List<String> allUsers = new LinkedList<String>();
		allUsers.add("List of Users: ");
		
		users.forEachRemaining(userList-> {
			allUsers.add("Username: "+ userList.getKey().getName() +
					" -|- Name: "+ userList.getString(NAME) +
					" -|- Email: " + userList.getString(EMAIL) +
					" -|- Role: "+ userList.getString(ROLE)+
					" -|- Profile: "+ userList.getString(VISIBILITY)+
					" -|- Password: "+ userList.getString(PASSWORD)+
					" -|- Address: "+ userList.getString(ADDRESS)+
					" -|- Landphone: "+ userList.getString(HPHONE)+
					" -|- Mobile Phone: "+ userList.getString(MPHONE)+
					" -|- NIF: "+ userList.getString(NIF)+
					" -|- Creation Time: "+ userList.getTimestamp(CTIME).toString()
					);
		});
		
		return allUsers;
	}
}