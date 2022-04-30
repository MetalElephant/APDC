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

import com.google.gson.Gson;

import pt.unl.fct.di.adc.avindividual.util.AuthToken;
import pt.unl.fct.di.adc.avindividual.util.LoginData;
import pt.unl.fct.di.adc.avindividual.util.LogoutData;
import pt.unl.fct.di.adc.avindividual.util.ModifyData;
import pt.unl.fct.di.adc.avindividual.util.ParcelData;
import pt.unl.fct.di.adc.avindividual.util.PasswordChangeData;
import pt.unl.fct.di.adc.avindividual.util.RegisterData;
import pt.unl.fct.di.adc.avindividual.util.RemoveData;

import com.google.appengine.repackaged.org.apache.commons.codec.digest.DigestUtils;
import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class RegisterResource {

	private static final Logger LOG = Logger.getLogger(RegisterResource.class.getName());
	private int currParcelId = 1;
	private final Gson g = new Gson();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();
	
	private static final String USER = "USER";
	private static final String GS = "GS";
	private static final String GBO = "GBO";
	private static final String SU = "SU";
	private static final String PUBLIC = "Public";
	public static final String PRIVATE = "Private";
	public static final String ACTIVE = "ACTIVE";
	public static final String INACTIVE = "INACTIVE";
	
	private static final String USERNAME = "username";
	private static final String PARCELID = "parcelId";
	private static final String OWNER = "owner";
	private static final String MARKER1 = "marker1";
	private static final String MARKER2 = "marker2";
	private static final String MARKER3 = "marker3";
	private static final String MARKER4 = "marker4";
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
	
	/**
	 * Empty constructor
	 */
	public RegisterResource() {

	}

	//----------------------------------------------------------------------------------------------------------------//

	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerUser(RegisterData data) {

		LOG.fine("Attempt to register user: " + data.username);

		// check validity of stuff
		if (!data.validRegistration())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		if(!data.validEmailFormat())
			return Response.status(Status.BAD_REQUEST).entity("Wrong email format: try example@domain.com").build();
		if(!data.validPasswordFormat())
			return Response.status(Status.BAD_REQUEST).entity("Passwords should be at least 5 chars long, contain at least 1 letter and 1 special character").build();
		if(!data.confirmedPassword())
			return Response.status(Status.BAD_REQUEST).entity("Passwords don't match.").build();
		data.optionalAttributes();


		// Transaction --> if information is not correct, we can rollback
		Transaction tn = datastore.newTransaction();

		try {
			Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);
			Entity person = tn.get(userKey);
			
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

				tn.put(person);
				tn.commit(); 
				
				LOG.info("User registered: " + data.username);

				return Response.ok("User "+ data.username ).build();
			}
			
			//other users - not superuser - creation
			if ((person != null)) {
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("User Already Exists").build();
			}

			person = Entity.newBuilder(userKey)
					.set(USERNAME, data.username)
					.set(NAME, data.name)
					.set(PASSWORD, DigestUtils.sha512Hex(data.password))
					.set(EMAIL, data.email)
					.set(ROLE, USER)
					
					.set(MPHONE, data.mobilePhone)
					.set(LPHONE,data.landPhone)
					.set(ADDRESS,data.address)
					.set(NIF,data.NIF)//the fucking string problem
					.set(PROFILE, PUBLIC)
					.set(STATE, INACTIVE)
					.set(CTIME, Timestamp.now()).build();

			tn.put(person);
			tn.commit(); 

			LOG.info("User registered: " + data.username);

			return Response.ok("User "+ data.username ).build();

		} finally {
			if (tn.isActive()) // some error might've ocurred that made it not be commited or rolled back
				tn.rollback();
		}

	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
	public Response doLogin(LoginData data) {
		
		LOG.fine("Attempt to login user: " + data.username);

		Key userKey = datastore.newKeyFactory().setKind("User").newKey(data.username);
		Entity user = datastore.get(userKey);
		
		if(user!= null) {
			String hashedPwd = user.getString(PASSWORD);
			
			//if password matches, login
			if(hashedPwd.equals(DigestUtils.sha512Hex(data.password))) {
				
				Transaction tn = datastore.newTransaction();

				
				try {
					String userRole = user.getString(ROLE);
					AuthToken token = new AuthToken(data.username, userRole); //authentication token
					
					Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(token.username);
					Entity tokenEntity = tn.get(tokenKey);
					
					//Guarantee user is not logging in again
					if (tokenEntity != null) {
						tn.rollback();
						return Response.ok().entity("User Already Logged In").build();
					}		
					
					tokenEntity = Entity.newBuilder(tokenKey)
							.set("token_ID", token.tokenID)
							.set("token_username", token.username)
							.set("token_validFrom", token.validFrom)
							.set("token_validTo", token.validTo)
							.set("token_user_role", token.role)
							.build();

					tn.add(tokenEntity);
					tn.commit();					
					
					LOG.info("User logged in: "+data.username);
					
					return Response.ok(g.toJson(token)).entity("User sucessfully logged in").build();
					
					
				}finally {
					if (tn.isActive()) // some error might've ocurred that made it not be commited or rolled back
						tn.rollback();
				}

			}
			else {
				LOG.warning("Wrong password for :" + data.username);
				return Response.status(Status.FORBIDDEN).entity("Wrong password").build();
			}
		}
		else {//username doesn't exist
			LOG.warning("User " + data.username +" does not exist");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username +" does not exist").build();
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
	
	private boolean canRemove(Entity user, Entity userToRemove) {

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
	
	@POST
	@Path("/parcel")
	public Response putParcel(ParcelData data) {
		Transaction tn = datastore.newTransaction();
		float p1,p2,p3,p4;
		
		p1 = data.points[0];
		p2 = data.points[1];
		p3 = data.points[2];
		p4 = data.points[3];
		
		Key userKey1 = datastore.newKeyFactory().setKind("User").newKey(data.owner);
		Entity user = tn.get(userKey1);
		Key parcelKey = datastore.newKeyFactory().setKind("Parcel").newKey(currParcelId);
		Entity parcel = tn.get(parcelKey);
		Key tokenKey = datastore.newKeyFactory().setKind("Tokens").newKey(data.owner);
		Entity token = tn.get(tokenKey);
		
		try {
			if(user == null) {
				LOG.warning("Something about the request is wrong");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Something about the request is wrong").build();
			}
			if(token == null) {
				LOG.warning("Something about the token is wrong");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Something about the token is wrong").build();
			}
			if(parcel != null) {
				LOG.warning("Something about the parcel is wrong");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Something about the parcel is wrong").build();
			}
			if(isTokenExpired(token, tn)) {
				LOG.warning("Token has expired");
				tn.rollback();
				return Response.status(Status.BAD_REQUEST).entity("Token has expired").build();
			}
			
			parcel = Entity.newBuilder(parcelKey)
					.set(OWNER, data.owner)
					.set(MARKER1, p1)
					.set(MARKER2, p2)
					.set(MARKER3, p3)
					.set(MARKER4, p4)
					.set(PARCELID, currParcelId)
					.build();
			
			tn.put(parcel);
			tn.commit();
			currParcelId++;
			
			return Response.ok("parcel added").build();
			
		} catch (Exception e) {
			tn.rollback();
			LOG.severe(e.getMessage());
			return Response.status(Status.INTERNAL_SERVER_ERROR).build();
		} finally {
			if (tn.isActive())
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
			
			AuthToken at = new AuthToken(data.username, user.getString(ROLE));
			
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
	private boolean isTokenExpired(Entity token, Transaction t) {
		long currentTime = System.currentTimeMillis();
		
		if(token.getLong("token_validTo") < currentTime) {
			t.delete(token.getKey());
			t.commit();
			return true;
		}
			
		return false;
	}
	//---------------------------------------------------------------------------------------------------------------//
	


}
