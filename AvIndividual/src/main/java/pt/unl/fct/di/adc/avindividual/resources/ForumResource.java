package pt.unl.fct.di.adc.avindividual.resources;

import java.util.LinkedList;
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

import pt.unl.fct.di.adc.avindividual.util.ForumMessageData;
import pt.unl.fct.di.adc.avindividual.util.ForumRegisterData;
import pt.unl.fct.di.adc.avindividual.util.RequestData;
import pt.unl.fct.di.adc.avindividual.util.Info.MessageInfo;

import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;

@Path("/forum")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class ForumResource {
    private static final Logger LOG = Logger.getLogger(ForumResource.class.getName());

    private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    private final Gson g = new Gson();

    UserResource ur = new UserResource();

    //Forum information
    private static final String TOPIC = "Topic";
    private static final String CRT_DATE = "Creation date";

    //Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String FORUM = "Forum";
    private static final String MESSAGE = "Message";
    private static final String OWNER = "Owner";


    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createForum(ForumRegisterData data){
        LOG.info("Attempt to create forum by user: " + data.username);

        if (!data.validData())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.username)).setKind(FORUM).newKey(data.forumName);

        Transaction tn = datastore.newTransaction();

        try{
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity forum = tn.get(forumKey);

            if (user == null) {
                LOG.warning("User does not exist");
                tn.rollback();
                return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
            }
    
            if (!ur.isLoggedIn(token, tn)){
                LOG.warning("User " + data.username + " not logged in.");
                tn.rollback();
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
            }

            if (forum != null){
                LOG.warning("Forum " + data.forumName + " already exists.");
                tn.rollback();
                return Response.status(Status.CONFLICT).entity("Forum " + data.forumName + " already exists.").build();
            }

            forum = Entity.newBuilder(forumKey)
                    .set(TOPIC, data.topic)
                    .set(CRT_DATE, Timestamp.now())
                    .build();

            tn.add(forum);
            tn.commit();

            return Response.ok("Forum successfully created.").build();
        }finally{
            if(tn.isActive())
                tn.rollback();
        }
    }

    @POST
    @Path("/message")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response postMessage(ForumMessageData data){
        LOG.info("Attempt to post message to forum: " + data.forum + " by user: " + data.username);

        if (!data.validData())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.owner)).setKind(FORUM).newKey(data.forum);

        IncompleteKey msgIncKey = datastore.newKeyFactory().addAncestors(PathElement.of(FORUM, data.forum)).setKind(MESSAGE).newKey();

        Key messageKey = datastore.allocateId(msgIncKey);

        Transaction tn = datastore.newTransaction();

        try{
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity forum = tn.get(forumKey);

            if (user == null) {
                LOG.warning("User does not exist");
                tn.rollback();
                return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
            }
    
            if (!ur.isLoggedIn(token, tn)){
                LOG.warning("User " + data.username + " not logged in.");
                tn.rollback();
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
            }

            if (forum == null){
                LOG.warning("Forum " + data.forum + " doesn't exists.");
                tn.rollback();
                return Response.status(Status.NOT_FOUND).entity("Forum " + data.forum + " doesn't exists.").build();
            }

            Entity message = Entity.newBuilder(messageKey)
            .set(MESSAGE, data.message)
            .set(OWNER, data.username)
            .set(CRT_DATE, Timestamp.now())
            .build();

            tn.add(message);
            tn.commit();

            return Response.ok("Message successfully posted.").build();
        }finally{
            if(tn.isActive())
                tn.rollback();
        }
    }

    @DELETE
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeForum(RequestData data){
        LOG.info("Attempt to delete forum: " + data.name);

        if (!data.isDataValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.username)).setKind(FORUM).newKey(data.name);

        Transaction tn = datastore.newTransaction();

        try{
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity forum = tn.get(forumKey);

            if (user == null) {
                LOG.warning("User does not exist");
                tn.rollback();
                return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
            }
    
            if (!ur.isLoggedIn(token, tn)){
                LOG.warning("User " + data.username + " not logged in.");
                tn.rollback();
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
            }

            if (forum == null){
                LOG.warning("Forum " + data.name + " doesn't exists.");
                tn.rollback();
                return Response.status(Status.NOT_FOUND).entity("Forum " + data.name + " doesn't exists.").build();
            }

            tn.delete(forumKey);
            tn.commit();

            return Response.ok("Message successfully posted.").build();
        }finally{
            if(tn.isActive())
                tn.rollback();
        }
    }

    @POST
    @Path("/list")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response listForums(RequestData data){
        LOG.info("Attempt to list forums of user: " + data.username);

        if (!data.isUsernameValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);

        Entity user = datastore.get(userKey);
        Entity token = datastore.get(tokenKey);

        if (user == null) {				
			LOG.warning("User does not exist");
			return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
		}

		if (!ur.isLoggedIn(token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}

        List<ForumRegisterData> forumList = getForumQueries(data.username);

		return Response.ok(g.toJson(forumList)).build();
    }

    @POST
    @Path("/listMessages")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response listForumMessage(RequestData data){
        LOG.info("Attempt to list messages of forum: " + data.name);

        if (!data.isDataValid())
        return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.username)).setKind(FORUM).newKey(data.name);

        Entity user = datastore.get(userKey);
        Entity token = datastore.get(tokenKey);
        Entity forum = datastore.get(forumKey);

        if (user == null) {				
			LOG.warning("User does not exist");
			return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
		}

		if (!ur.isLoggedIn(token, data.username)){
			LOG.warning("User " + data.username + " not logged in.");
			return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
		}

        if (forum == null){
            LOG.warning("Forum " + forum + " doesn't exists.");
            return Response.status(Status.NOT_FOUND).entity("Forum " + forum + " doesn't exists.").build();
        }

        List<MessageInfo> parcelList = getMessageQueries(data.name, data.username);

		return Response.ok(g.toJson(parcelList)).build();
    }

    private List<ForumRegisterData> getForumQueries(String username){
        Query<Entity> forumQuery = Query.newEntityQueryBuilder().setKind(FORUM)
								  .setFilter(PropertyFilter.hasAncestor(
                				  datastore.newKeyFactory().setKind(USER).newKey(username)))
								  .build();

		QueryResults<Entity> forumResult = datastore.run(forumQuery);

		List<ForumRegisterData> forums = new LinkedList<>();

		forumResult.forEachRemaining(f -> {
			forums.add(new ForumRegisterData(username, f.getKey().getName(), f.getString(TOPIC)));
		});

		return forums;
    }

    private List<MessageInfo> getMessageQueries(String forum, String username){
        Query<Entity> msgQuery = Query.newEntityQueryBuilder().setKind(MESSAGE)
								  .setFilter(PropertyFilter.hasAncestor(
                				  datastore.newKeyFactory().setKind(FORUM).newKey(forum)))
								  .build();

		QueryResults<Entity> messages = datastore.run(msgQuery);

		List<MessageInfo> forumMsg = new LinkedList<>();

		messages.forEachRemaining(msg -> {
			forumMsg.add(new MessageInfo(msg.getString(OWNER), msg.getString(MESSAGE), msg.getTimestamp(CRT_DATE)));
		});

		return forumMsg;
    }
    
}
