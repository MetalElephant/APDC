package pt.unl.fct.di.adc.avindividual.resources;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.google.cloud.datastore.Entity.Builder;
import com.google.gson.Gson;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.servlet.http.HttpServletRequest;

import pt.unl.fct.di.adc.avindividual.util.AuthToken;
import pt.unl.fct.di.adc.avindividual.util.LoginData;
import pt.unl.fct.di.adc.avindividual.util.LogoutData;
import pt.unl.fct.di.adc.avindividual.util.ModifyData;
import pt.unl.fct.di.adc.avindividual.util.ParcelData;
import pt.unl.fct.di.adc.avindividual.util.PasswordChangeData;
import pt.unl.fct.di.adc.avindividual.util.RegisterData;
import pt.unl.fct.di.adc.avindividual.util.RemoveData;
import pt.unl.fct.di.adc.avindividual.util.ShowSelfData;
import pt.unl.fct.di.adc.avindividual.util.UserInfo;

import com.google.appengine.repackaged.org.apache.commons.codec.digest.DigestUtils;
import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class UserResource {

	private static final Logger LOG = Logger.getLogger(UserResource.class.getName());
	private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	
	//User information
	private static final String USERNAME = "username";
	private static final String NAME = "name";
	private static final String PASSWORD = "password";
	private static final String EMAIL = "email";
	private static final String ROLE = "role";
	private static final String MPHONE = "mobilephone";
	private static final String LPHONE = "landphone";
	private static final String ADDRESS = "address";
	private static final String NIF = "nif";
	private static final String PROFILE = "profile";
	private static final String STATE = "state";
	private static final String CTIME = "creation time";
	private static final String PUBLIC = "Public";
	public static final String PRIVATE = "Private";
	public static final String ACTIVE = "ACTIVE";
	public static final String INACTIVE = "INACTIVE";

	private static final String SU = "SU";

	//Token information
	public static final String TOKENID = "token ID";
	public static final String TOKENUSER = "token user";
	public static final String TOKENCREATION = "token creation";
	public static final String TOKENEXPIRATION = "token expiration";


	//Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
    private static final String USTATS = "User Stats";
	private static final String ULOGS = "User Logs";
	private static final String STATSCOUNT = "counter";

	//Login information
	private static final String USERLOGINS = "stats logins";
    private static final String USERFAILS = "stats failed";
    private static final String FIRSTLOGIN = "first login";
	private static final String LASTLOGIN = "last login";
	private static final String LOGINIP = "login ip";
	private static final String LOGINHOST = "login host";
	private static final String LOGINCITY = "login city";
	private static final String LOGINCOUNTRY = "login country";
	private static final String LOGINTIME = "login time";
	
	public UserResource() {}

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerUser(RegisterData data) {
		LOG.info("Attempt to register user: " + data.username);

		//Check if data is correctly input
		if (!data.validRegistration())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		if(!data.validEmailFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong email format: try example@domain.com").build();
		if(!data.validPasswordFormat())
			return Response.status(Status.BAD_REQUEST).entity("Passwords should be at least 5 chars long, contain at least 1 letter and 1 special character").build();
		if(!data.confirmedPassword())
			return Response.status(Status.BAD_REQUEST).entity("Passwords don't match.").build();
		data.optionalAttributes();

		Transaction tn = datastore.newTransaction();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key statsKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.username))
				.setKind(USTATS).newKey(STATSCOUNT);

		try {
			Entity user = tn.get(userKey);
            Entity stats;
			
			//We could possibly create super user elsewhere with a admin only page, see: secret from pp
            /*
			//SUPERUSER creation
			if(data.name.equals("SUPERUSER") && person==null) {
				person = Entity.newBuilder(userKey)
						.set(USERNAME, data.username)
						.set(NAME, data.name)
						.set(PASSWORD, DigestUtils.sha512Hex(data.password))
						.set(EMAIL, data.email)
						.set(ROLE, SU)
						.set(MPHONE, data.mobilePhone)
						.set(LPHONE,data.landPhone)
						.set(ADDRESS,data.address)
						.set(NIF,data.NIF)
						.set(PROFILE, PRIVATE)
						.set(STATE, ACTIVE)
						.set(CTIME, Timestamp.now()).build();

				tn.add(person);
				tn.commit(); 
				
				LOG.info("User registered: " + data.username);

				return Response.ok("User "+ data.username ).build();
			}
			*/
            
			//Check if user already exists
			if (user != null) {
				tn.rollback();
				return Response.status(Status.CONFLICT).entity("User Already Exists").build();
			}

			//Create user and statistics entity
			user = Entity.newBuilder(userKey)
					.set(USERNAME, data.username)
					.set(NAME, data.name)
					.set(PASSWORD, DigestUtils.sha512Hex(data.password))
					.set(EMAIL, data.email)
					.set(ROLE, USER)		
					.set(MPHONE, data.mobilePhone)
					.set(LPHONE,data.landPhone)
					.set(ADDRESS,data.address)
					.set(NIF,data.NIF)
					.set(PROFILE, PUBLIC)
					.set(STATE, INACTIVE)
					.set(CTIME, Timestamp.now())
                    .build();
            
            stats = Entity.newBuilder(statsKey)
				.set(USERLOGINS, 0L)
				.set(USERFAILS, 0L)
				.set(FIRSTLOGIN , Timestamp.now())
				.set(LASTLOGIN, Timestamp.now())
				.build();

			tn.add(user, stats);
			tn.commit(); 

			LOG.fine("User registered: " + data.username);
			return Response.ok("Registered user "+ data.username ).build();

		} finally {
			if (tn.isActive()) {
				tn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}
		}
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response doLogin(LoginData data, @Context HttpServletRequest request, @Context HttpHeaders headers) {	
		LOG.info("Attempt to login user: " + data.username);

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
		Key statsKey = datastore.newKeyFactory().addAncestor(PathElement.of(USER, data.username))
					   .setKind(USTATS).newKey(STATSCOUNT);
		Key logKey = datastore.allocateId(datastore.newKeyFactory()
					.addAncestors(PathElement.of(USER, data.username))
					.setKind(ULOGS).newKey());

		Transaction tn = datastore.newTransaction();

		try{
			Entity user = datastore.get(userKey);
			Entity stats = tn.get(statsKey);
			
			if (user != null){
				String hashedPwd = user.getString(PASSWORD);

				if(hashedPwd.equals(DigestUtils.sha512Hex(data.password))) {						
						Entity tokenEntity = tn.get(tokenKey);
						
						//Guarantee user is not logging in again
						if (tokenEntity != null) {
							tn.rollback();
							return Response.status(Status.CONFLICT).entity("User Already Logged In").build();
						}
						
						//Create login log, the token and update the statistics
	                    Entity log = Entity.newBuilder(logKey)
									.set(LOGINIP, request.getRemoteAddr())
									.set(LOGINHOST, request.getRemoteHost())
									.set(LOGINCITY, headers.getHeaderString("X-AppEngine-City"))
									.set(LOGINCOUNTRY, headers.getHeaderString("X-AppEngine-Country"))
									.set(LOGINTIME, Timestamp.now())
									.build();
	                    
						Entity uStats = Entity.newBuilder(statsKey)
										.set(USERLOGINS, 1L + stats.getLong(USERLOGINS))
										.set(USERFAILS, stats.getLong(USERFAILS))
										.set(FIRSTLOGIN, stats.getTimestamp(FIRSTLOGIN))
										.set(LASTLOGIN, Timestamp.now())
										.build();                    
						
						AuthToken token = new AuthToken(data.username);
		
						tokenEntity = Entity.newBuilder(tokenKey)
								.set(TOKENID, token.tokenID)
								.set(TOKENUSER, token.username)
								.set(TOKENCREATION, token.validFrom)
								.set(TOKENEXPIRATION, token.validTo)
								.build();
						
						//Put to overwrite previous stats
						tn.put(tokenEntity, log, uStats);
						tn.commit();
						
						LOG.info("User logged in: "+data.username);
						
						return Response.ok(g.toJson(token)).build();

					}else {
						LOG.warning("Wrong password for :" + data.username);
						
						Entity uStats = Entity.newBuilder(statsKey)
								.set(USERLOGINS, stats.getLong(USERLOGINS))
								.set(USERFAILS, 1L + stats.getLong(USERFAILS))
								.set(FIRSTLOGIN, stats.getTimestamp(FIRSTLOGIN))
								.set(LASTLOGIN, Timestamp.now())
								.build(); 
						
						tn.put(uStats);
						tn.commit();
						return Response.status(Status.FORBIDDEN).entity("Wrong password").build();
					}
			}else{
				LOG.warning("User " + data.username +" does not exist");
				return Response.status(Status.NOT_FOUND).entity("User " + data.username +" does not exist").build();
			}
		}finally{
			if (tn.isActive()){
				tn.rollback();
				return Response.status(Status.INTERNAL_SERVER_ERROR).build();
			}
		}
	}

	
	@DELETE
	@Path("/remove")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response removeUser(RemoveData data) {

		LOG.fine("Attempt to remove user: " + data.username2);

		Transaction tn = datastore.newTransaction();

		// Get both users
		Key userKey1 = datastore.newKeyFactory().setKind("User").newKey(data.username);
		Entity user = tn.get(userKey1);

		Key userKey2 = datastore.newKeyFactory().setKind("User").newKey(data.username2);
		Entity userToRemove = tn.get(userKey2);

		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.username);
		Entity token = tn.get(tokenKey);
		
		Key tokenKeytoRemove = datastore.newKeyFactory().setKind("Tokens").newKey(data.username2);

		try {

			if (user == null || userToRemove == null) {
				LOG.warning("User " + data.username + " does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}
			if (token == null) {
				// tn.rollback();
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - invalid token.").build();
			}
			if(isTokenExpired(token, tn)) {
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - token expired.").build();
			}

			if (!canRemove(user, userToRemove)) {
				return Response.status(Status.FORBIDDEN).entity("User Unathourized to Remove Other User").build();
			}
			
			//remove the authtoken associated with the user
			if(tokenKeytoRemove != null)
				tn.delete(tokenKeytoRemove);
			
			tn.delete(userKey2);
			tn.commit();

			return Response.ok(g.toJson(null)).entity("User" + data.username + " deleted User " + data.username2)
					.build();

		} catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();

		} finally {
			if (tn.isActive()) // some error might've ocurred that made it not be commited or rolled back
				tn.rollback();
		}
	}
	
	//No roles so right now we can always do it
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

	@POST
	@Path("/modify")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response modifyUser(ModifyData data) {

		LOG.fine("Attempt to modify user: " + data.username2);
		
		if(!data.validEmailFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong email format: try example@domain.com").build();
		if(!data.validRoleFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong type of role: try 'USER', 'GBO', 'GS' or 'SU'").build();
		if(!data.validStateFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong type of state: try 'ACTIVE' or 'INACTIVE'").build();

		
		Transaction tn = datastore.newTransaction();

		// Get both users
		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);
		Entity user = tn.get(userKey);
		
		Key userKey2 = datastore.newKeyFactory().setKind("User").newKey(data.username2);
		Entity userToModify = tn.get(userKey2);

		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.username);
		Entity token = tn.get(tokenKey);

		try {

			if (user == null || userToModify == null) {
				LOG.warning("User does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User does not exist").build();
			}
			if (token == null) {
				// tn.rollback();
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - invalid token.").build();
			}
			if(isTokenExpired(token, tn)) {
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - token expired.").build();
			}
			
			// To set what will stay the same value or what will actually be changed
			if(!canModify(data, user, userToModify))
				return Response.status(Status.FORBIDDEN).entity("User does not have authorization to change one or more attributes.").build();

			userToModify = Entity.newBuilder(userKey2)
					.set(USERNAME, data.username2)
					.set(NAME, data.name)
					.set(PASSWORD, userToModify.getString(PASSWORD))
					.set(EMAIL, data.email)
					.set(ROLE, data.role)
					.set(MPHONE, data.mobilePhone)
					.set(LPHONE, data.landPhone)
					.set(ADDRESS, data.address)
					.set(NIF, data.NIF)
					.set(PROFILE, data.profile)
					.set(STATE, data.state)
					.set(CTIME, userToModify.getTimestamp(CTIME)).build();
			
			tn.put(userToModify);
			tn.commit();

			return Response.ok("User " + data.username2 + "'s parameters updated.").build();

		} catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();

		} finally {
			if (tn.isActive()) // some error might've ocurred that made it not be commited or rolled back
				tn.rollback();
		}

	}
	
	private boolean canModify(ModifyData data, Entity user, Entity userToModify) {
		
		if(!data.canUpdateValues(user.getString(ROLE), userToModify.getString(ROLE)))
			return false;
		
		//update values so its easier to do transaction.put throught the data from ModifyData
		if (data.name == null)
			data.name = userToModify.getString(NAME);
		
		if (data.email == null)
			data.email = userToModify.getString(EMAIL);
		
		if (data.role == null)
			data.role = userToModify.getString(ROLE);
		
		if (data.mobilePhone == null)
			data.mobilePhone = userToModify.getString(MPHONE);
		
		if (data.landPhone == null)
			data.landPhone = userToModify.getString(LPHONE);
		
		if (data.address == null)
			data.address = userToModify.getString(ADDRESS);
		
		if (data.NIF == null)
			data.NIF = userToModify.getString(NIF);
		
		if (data.profile == null)
			data.profile = userToModify.getString(PROFILE);
		
		if (data.state == null)
			data.state = userToModify.getString(STATE);
		
		return true;
		
	}

	@POST
	@Path("/modifyPwd")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response modifyPwd(PasswordChangeData data) {

		LOG.fine("Attempt to modify password for user: " + data.username);
		
		if(!data.validParameters())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		if(!data.verifyPassword())
			return Response.status(Status.FORBIDDEN).entity("Passwords don't match").build();
		if(!data.validPasswordFormat())
			return Response.status(Status.BAD_REQUEST).entity("Passwords should be at least 5 chars long, contain at least 1 letter and 1 special character").build();
		
		Transaction tn = datastore.newTransaction();

		// Get both users
		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);
		Entity user = tn.get(userKey);

		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.username);
		Entity token = tn.get(tokenKey);
		
		try {


			if (user == null) {
				LOG.warning("User " + data.username + " does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST)
						.entity("User " + data.username + " does not exist").build();
			}
			if(!user.getString(PASSWORD).equals(DigestUtils.sha512Hex(data.oldPwd))) 
				return Response.status(Status.BAD_REQUEST)
						.entity("Wrong password").build();
			if (token == null) {
				// tn.rollback();
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - invalid token.").build();
			}
			if(isTokenExpired(token, tn)) {
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - token expired.").build();
			}

			user = Entity.newBuilder(userKey)
					.set(USERNAME, user.getString(USERNAME))
					.set(NAME, user.getString(NAME))
					.set(PASSWORD, DigestUtils.sha512Hex(data.newPwd))
					.set(EMAIL, user.getString(EMAIL))
					.set(ROLE, user.getString(ROLE))
					.set(MPHONE, user.getString(MPHONE))
					.set(LPHONE, user.getString(LPHONE))
					.set(ADDRESS, user.getString(ADDRESS))
					.set(NIF, user.getString(NIF))
					.set(PROFILE, user.getString(PROFILE))
					.set(STATE, user.getString(STATE))
					.set(CTIME, user.getTimestamp(CTIME)).build();
			
			tn.put(user);
			tn.commit();

			return Response.ok("User" + data.username + " updated password").build();

		} catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();

		} finally {
			if (tn.isActive()) // some error might've ocurred that made it not be commited or rolled back
				tn.rollback();
		}

	}

	@DELETE
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response doLogout(LogoutData data) {


		LOG.fine("Attempt to logout user: " + data.username);

		Transaction tn = datastore.newTransaction();

		// Get both users
		Key userKey1 = datastore.newKeyFactory().setKind("User").newKey(data.username);
		Entity user = tn.get(userKey1);

		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.username);
		Entity token = tn.get(tokenKey);

		try {

			if (user == null) {
				LOG.warning("User " + data.username + " does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}
			if (token == null) {//TODO - change here to isValidToken?
				// tn.rollback();
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - invalid token.").build();
			}
			

			tn.delete(tokenKey);
			tn.commit();

			return Response.ok(g.toJson(null)).entity("User" + data.username + " logged out.").build();

		} catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();

		} finally {
			if (tn.isActive()) // some error might've ocurred that made it not be commited or rolled back
				tn.rollback();
		}
	}

	@POST
	@Path("/token")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response getToken(LogoutData data) {
		
		LOG.fine("Attempt to retrieve login token for user: " + data.username);
		
		Transaction tn = datastore.newTransaction();

		// Get both users
		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);
		Entity user = tn.get(userKey);
		
		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.username);
		Entity token = tn.get(tokenKey);
		
		try {

			if (user == null) {
				LOG.warning("User does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}
			if (token == null) {
				// tn.rollback();
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - invalid token.").build();
			}
			if(isTokenExpired(token, tn)) {
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - token expired.").build();
			}
			
			AuthToken at = new AuthToken(data.username);
			
			return Response.ok(g.toJson(at)).build();

		} catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();

		} finally {
			if (tn.isActive()) // some error might've ocurred that made it not be commited or rolled back
				tn.rollback();
		}
		
	}
	
	@POST
	@Path("/show")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showUsers(LogoutData data) {
		
		LOG.fine("Attempt to retrieve login token for user: " + data.username);
		
		Transaction tn = datastore.newTransaction();

		// Get both users
		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);
		Entity user = tn.get(userKey);
		
		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.username);
		Entity token = tn.get(tokenKey);
		
		try {

			if (user == null) {
				LOG.warning("User does not exist");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
			}
			if (token == null) {
				// tn.rollback();
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - invalid token.").build();
			}
			if(isTokenExpired(token, tn)) {
				return Response.status(Status.FORBIDDEN)
						.entity("User " + data.username + " not logged in - token expired.").build();
			}
			
			String userRole = user.getString(ROLE);
			
			List<String> userList = getQueries(userRole);
			

			return Response.ok(g.toJson(userList)).build();

		} catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();

		} finally {
			if (tn.isActive()) // some error might've ocurred that made it not be commited or rolled back
				tn.rollback();
		}
		
	}
	
	private List<String> getQueries(String role) {


		if (role.equals(USER)) {

			Query<Entity> queryUSER = Query.newEntityQueryBuilder().setKind("User")
					.setFilter(CompositeFilter.and(
							PropertyFilter.eq(ROLE, USER),
							PropertyFilter.eq(PROFILE, PUBLIC), 
							PropertyFilter.eq(STATE, ACTIVE)))
					.build();

			QueryResults<Entity> users = datastore.run(queryUSER);

			List<String> allUsers = new ArrayList<String>();
			allUsers.add("List of Active Users: ");

			users.forEachRemaining(userList -> {
				allUsers.add("Username: " + userList.getString(USERNAME) + " -|- Name: " + userList.getString(NAME)
						+ " -|- Email: " + userList.getString(EMAIL));
			});

			return allUsers;

		}
		/*
		if (role.equals(GBO)) {

			// Define query
			Query<Entity> queryGBO = Query.newEntityQueryBuilder().setKind("User")
					.setFilter(CompositeFilter.and(
							PropertyFilter.eq(ROLE, USER)))
					.build();

			return buildQueryList(queryGBO);

		}
		if (role.equals(GS)) {

			// Queries don't have an OR operation, apparently, so we have to do 2 separate
			// ones
			Query<Entity> query = Query.newEntityQueryBuilder().setKind("User")
					.setFilter(CompositeFilter.and(
							PropertyFilter.eq(ROLE, USER)))
					.build();

			Query<Entity> query2 = Query.newEntityQueryBuilder().setKind("User")
					.setFilter(CompositeFilter.and(
							PropertyFilter.eq(ROLE, GBO)))
					.build();

			List<String> allUsers = buildQueryList(query);
			List<String> usersGBO = buildQueryList(query2);

			allUsers.addAll(usersGBO);

			return allUsers;
		}
		*/
		if (role.equals(SU)) {

			Query<Entity> query = Query.newEntityQueryBuilder().setKind("User").build();

			return buildQueryList(query);
		}

		return null;

	}
	
	private List<String> buildQueryList(Query<Entity> query) {
		
		QueryResults<Entity> users = datastore.run(query);
		
		List<String> allUsers = new ArrayList<String>();
		allUsers.add("List of Users: ");
		
		users.forEachRemaining(userList-> {
			allUsers.add("Username: "+ userList.getString(USERNAME) +
					" -|- Name: "+ userList.getString(NAME) +
					" -|- Email: " + userList.getString(EMAIL) +
					" -|- Role: "+ userList.getString(ROLE)+
					" -|- Profile: "+ userList.getString(PROFILE)+
					" -|- State: "+ userList.getString(STATE)+
					" -|- Password: "+ userList.getString(PASSWORD)+
					" -|- Address: "+ userList.getString(ADDRESS)+
					" -|- Landphone: "+ userList.getString(LPHONE)+
					" -|- Mobile Phone: "+ userList.getString(MPHONE)+
					" -|- NIF: "+ userList.getString(NIF)+
					" -|- Creation Time: "+ userList.getTimestamp(CTIME).toString()
					);
		});
		
		return allUsers;
	}
	
	/**
	 * Verify if token has expired, logout and remove said token if so
	 * @param token
	 * @return
	 */
	public boolean isTokenExpired(Entity token, Transaction t) {
		long currentTime = System.currentTimeMillis();
		
		if(token.getLong("token_validTo") < currentTime) {
			t.delete(token.getKey());
			t.commit();
			return true;
		}
			
		return false;
	}
	//---------------------------------------------------------------------------------------------------------------//
	
	@POST
	@Path("/op9")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response showSelf(ShowSelfData data) {
		LOG.fine("Attempting to show user " + data.username);

		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);
		Entity user = datastore.get(userKey);

		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.username);
		Entity token = datastore.get(tokenKey);
		
		Transaction tn = datastore.newTransaction();

		if (user == null) {
			LOG.warning("User " + data.username + " does not exist.");

			return Response.status(Status.FORBIDDEN).build();
		}

		if (token == null) {
			LOG.warning("User " + data.username + " is not logged in.");

			return Response.status(Status.FORBIDDEN).build();
		}

		if (isTokenExpired(token, tn)) {
			LOG.warning("User " + data.username + "  session has expired.");

			return Response.status(Status.FORBIDDEN).build();
		}

		UserInfo u = new UserInfo(user.getString("username"), user.getString("email"), user.getString("name"),
				user.getString("profileVisibility"), user.getString("homePhone"), user.getString("mobilePhone"),
				user.getString("address"), user.getString("nif"), user.getString("role"), user.getString("state"));

		return Response.ok(g.toJson(u)).build();

	}


}
