package pt.unl.fct.di.adc.avindividual.resources;

import java.util.Calendar;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Logger;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import com.google.gson.Gson;

import pt.unl.fct.di.adc.avindividual.util.ForumMessageData;
import pt.unl.fct.di.adc.avindividual.util.ForumRegisterData;
import pt.unl.fct.di.adc.avindividual.util.ForumRemoveData;
import pt.unl.fct.di.adc.avindividual.util.RemoveMessageData;
import pt.unl.fct.di.adc.avindividual.util.RequestData;
import pt.unl.fct.di.adc.avindividual.util.Roles;
import pt.unl.fct.di.adc.avindividual.util.SortByOrder;
import pt.unl.fct.di.adc.avindividual.util.Info.ForumInfo;
import pt.unl.fct.di.adc.avindividual.util.Info.MessageInfo;

import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.CompositeFilter;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;


@Path("/forum")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class ForumResource {
    private static final Logger LOG = Logger.getLogger(ForumResource.class.getName());
	
	private final Gson g = new Gson();

	private UserResource ur = new UserResource();

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    //User information
    private static final String ROLE = "role";

    //Forum information
    private static final String TOPIC = "Topic";
    private static final String CRT_DATE = "Creation date";

    //Keys
	private static final String USER = "User";
    private static final String TOKEN = "Token";
	private static final String FORUM = "Forum";
    private static final String MESSAGE = "Message";
    private static final String OWNER = "Owner";
    private static final String ORDER = "Order";
    private static final String STAT = "Statistics";

    private static final boolean ADD = true;

    private StatisticsResource sr = new StatisticsResource();


    public ForumResource() {}

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
        Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(FORUM);
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
    
            if (!ur.isLoggedIn(token, data.username)){
                LOG.warning("User " + data.username + " not logged in.");
                tn.rollback();
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
            }

            if (forum != null){
                LOG.warning("Forum " + data.forumName + " already exists.");
                tn.rollback();
                return Response.status(Status.CONFLICT).entity("Forum " + data.forumName + " already exists.").build();
            }

            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.HOUR, 1);

            forum = Entity.newBuilder(forumKey)
                    .set(TOPIC, data.topic)
                    .set(CRT_DATE, cal.getTime().toString())
                    .build();

            sr.updateStats(statKey, tn.get(statKey), tn, ADD);

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

        Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(MESSAGE);

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
    
            if (!ur.isLoggedIn(token, data.username)){
                LOG.warning("User " + data.username + " not logged in.");
                tn.rollback();
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
            }

            if (forum == null){
                LOG.warning("Forum " + data.forum + " doesn't exists.");
                tn.rollback();
                return Response.status(Status.NOT_FOUND).entity("Forum " + data.forum + " doesn't exists.").build();
            }

            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.HOUR, 1);

            Entity message = Entity.newBuilder(messageKey)
            .set(MESSAGE, data.message)
            .set(OWNER, data.username)
            .set(ORDER, System.currentTimeMillis())
            .set(CRT_DATE, cal.getTime().toString())
            .build();

            sr.updateStats(statKey, tn.get(statKey), tn, ADD);

            tn.add(message);
            tn.commit();

            return Response.ok("Message successfully posted.").build();
        }finally{
            if(tn.isActive())
                tn.rollback();
        }
    }

    @DELETE
    @Path("/removeForum")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeForum(ForumRemoveData data){
        LOG.info("Attempt to delete forum: " + data.name);

        if (!data.isDataValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        Key ownerKey = datastore.newKeyFactory().setKind(USER).newKey(data.owner);
        Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.owner)).setKind(FORUM).newKey(data.name);
        Key statKeyF = datastore.newKeyFactory().setKind(STAT).newKey(FORUM);
        Key statKeyM = datastore.newKeyFactory().setKind(STAT).newKey(MESSAGE);

        Transaction tn = datastore.newTransaction();

        try{
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity owner = tn.get(ownerKey);
            Entity forum = tn.get(forumKey);

            if (user == null) {
                LOG.warning("User does not exist");
                tn.rollback();
                return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
            }
    
            if (!ur.isLoggedIn(token, data.username)){
                LOG.warning("User " + data.username + " not logged in.");
                tn.rollback();
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
            }

            if (forum == null){
                LOG.warning("Forum " + data.name + " doesn't exists.");
                tn.rollback();
                return Response.status(Status.NOT_FOUND).entity("Forum " + data.name + " doesn't exists.").build();
            }

            if(!canRemove(user, owner)) {
                LOG.warning("User " + data.username + " can't be removed by the user.");
                tn.rollback();
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " can't be removed by the user.").build();
            }

            int n = deleteForumMessages(data.name, tn);

            sr.updateStats(statKeyM, tn.get(statKeyM), tn, !ADD, n);

            sr.updateStats(statKeyF, tn.get(statKeyF), tn, !ADD);

            tn.delete(forumKey);
            tn.commit();

            return Response.ok("Forum successfully deleted.").build();
        }finally{
            if(tn.isActive())
                tn.rollback();
        }
    }

    @DELETE
    @Path("/removeMessage")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeMessage(RemoveMessageData data){
        LOG.info("Attempt to delete message from forum: " + data.forumName);

        if (!data.isDataValid())
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key tokenKey = datastore.newKeyFactory().setKind(TOKEN).newKey(data.username);
        Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.forumOwner)).setKind(FORUM).newKey(data.forumName);
        Key statKey = datastore.newKeyFactory().setKind(STAT).newKey(MESSAGE);

        Transaction tn = datastore.newTransaction();

        try{
            Entity user = tn.get(userKey);
            Entity token = tn.get(tokenKey);
            Entity forum = tn.get(forumKey);
            Entity stat = tn.get(statKey);

            if (user == null) {
                LOG.warning("User does not exist");
                tn.rollback();
                return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
            }
    
            if (!ur.isLoggedIn(token, data.username)){
                LOG.warning("User " + data.username + " not logged in.");
                tn.rollback();
                return Response.status(Status.FORBIDDEN).entity("User " + data.username + " not logged in.").build();
            }

            if (forum == null){
                LOG.warning("Forum " + data.forumName + " doesn't exists.");
                tn.rollback();
                return Response.status(Status.NOT_FOUND).entity("Forum " + data.forumName + " doesn't exists.").build();
            }

            Query<Entity> msgQuery = Query.newEntityQueryBuilder().setKind(MESSAGE)
								  .setFilter(CompositeFilter.and(PropertyFilter.eq(MESSAGE, data.msg),PropertyFilter.eq(OWNER, data.msgOwner)))
								  .build();
        
            QueryResults<Entity> messages = datastore.run(msgQuery);

            if (!messages.hasNext())
                return Response.status(Status.NOT_FOUND).entity("Message does not exist.").build();

            sr.updateStats(statKey, tn.get(statKey), tn, !ADD);

            tn.delete(messages.next().getKey());
            tn.commit();

            return Response.ok("Message successfully deleted.").build();
        }finally{
            if(tn.isActive())
                tn.rollback();
        }
    }

    @GET
    @Path("/list")
    @Produces(MediaType.APPLICATION_JSON)
    public Response listForums(){
        LOG.info("Attempt to list all forums");

        List<ForumInfo> forumList = new LinkedList<>();

        Query<Entity> forumQuery = Query.newEntityQueryBuilder().setKind(FORUM).build();

		QueryResults<Entity> forumResult = datastore.run(forumQuery);

		forumResult.forEachRemaining(f -> {
			forumList.add(new ForumInfo(f.getKey().getAncestors().get(0).getName(), f.getKey().getName(),
                                        f.getString(TOPIC), f.getString(CRT_DATE)));
		});

		return Response.ok(g.toJson(forumList)).build();
    }

    @POST
    @Path("/search")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response searchForums(RequestData data){
        LOG.info("Attempt to search forums.");

        if (!data.isDataValid())
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

        List<ForumInfo> results = forumSearchQuery(data.name);

        return Response.ok(g.toJson(results)).build();
    }

    @POST
    @Path("/listUser")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response listUserForums(RequestData data){
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

        List<ForumInfo> forumList = getUserForumQueries(data.username);

		return Response.ok(g.toJson(forumList)).build();
    }

    @POST
    @Path("/listMessages")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response listForumMessage(RequestData data){
        LOG.info("Attempt to list messages of forum: " + data.name);

        if (!data.isDataValid())
        return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
        Key forumKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.username)).setKind(FORUM).newKey(data.name);

        Entity user = datastore.get(userKey);
        Entity forum = datastore.get(forumKey);

        if (user == null || forum == null){
            LOG.warning("Forum " + data.name + " doesn't exists.");
            return Response.status(Status.NOT_FOUND).entity("Forum " + data.name + " doesn't exists.").build();
        }

        List<MessageInfo> parcelList = getMessageQueries(data.name);

		return Response.ok(g.toJson(parcelList)).build();
    }

    private boolean canModify(Entity e1, Entity e2) {
		Roles e1Role = Roles.valueOf(e1.getString(ROLE));

		switch(e1Role) {
			case SUPERUSER:
				return true;
			case MODERADOR:
			case PROPRIETARIO:
			case REPRESENTANTE:
			case COMERCIANTE:
				if(e1 == e2)
					return true;
				break;
			default:
				break;
		}

		return false;
	}

	private boolean canRemove(Entity e1, Entity e2) {
		Roles e1Role = Roles.valueOf(e1.getString(ROLE));
		Roles e2Role = Roles.valueOf(e2.getString(ROLE));

		switch(e1Role) {
			case SUPERUSER:
				return true;
			case MODERADOR:
				if(e1 == e2 || e2Role != Roles.SUPERUSER) 
					return true;
				break;
			case PROPRIETARIO:
			case REPRESENTANTE:
			case COMERCIANTE:
				if(e1 == e2)
					return true;
				break;
			default:
				break;
		}

		return false;
	}

    private int deleteForumMessages(String forumName, Transaction tn){
        Query<Entity> msgQuery = Query.newEntityQueryBuilder().setKind(MESSAGE)
								  .setFilter(PropertyFilter.hasAncestor(
                				  datastore.newKeyFactory().setKind(FORUM).newKey(forumName)))
								  .build();
        
        QueryResults<Entity> messages = datastore.run(msgQuery);

        int counter = 0;

        while(messages.hasNext()){
            counter ++;
            tn.delete(messages.next().getKey());
        }

        return counter;
    }

    private List<ForumInfo> forumSearchQuery(String query){
        Query<Entity> forumQuery = Query.newEntityQueryBuilder().setKind(FORUM)
								  .build();

		QueryResults<Entity> forumResult = datastore.run(forumQuery);

		List<ForumInfo> forums = new LinkedList<>();

		forumResult.forEachRemaining(f -> {
            if (isQueryOk(f.getKey().getName(), query))
			    forums.add(new ForumInfo(f.getKey().getAncestors().get(0).getName(), f.getKey().getName(), f.getString(TOPIC), f.getString(CRT_DATE)));
		});

		return forums;
    }

    private static boolean isQueryOk(String name, String query){
        name = name.toLowerCase();
        query = query.toLowerCase();

        if (query.equals(name))
            return true;

        String[] sections = query.split(" ");
        String aux;

        for (int i = 0; i < sections.length; i ++){
            aux = sections[i];
            if (aux.length() > 2 && name.contains(aux))
                return true;
        }

        return false;
    }

    private List<ForumInfo> getUserForumQueries(String username){
        Query<Entity> forumQuery = Query.newEntityQueryBuilder().setKind(FORUM)
								  .setFilter(PropertyFilter.hasAncestor(
                				  datastore.newKeyFactory().setKind(USER).newKey(username)))
								  .build();

		QueryResults<Entity> forumResult = datastore.run(forumQuery);

		List<ForumInfo> forums = new LinkedList<>();

		forumResult.forEachRemaining(f -> {
			forums.add(new ForumInfo(username, f.getKey().getName(), f.getString(TOPIC), f.getString(CRT_DATE)));
		});

		return forums;
    }

    private List<MessageInfo> getMessageQueries(String forum){
        Query<Entity> msgQuery = Query.newEntityQueryBuilder().setKind(MESSAGE)
								  .setFilter(PropertyFilter.hasAncestor(
                				  datastore.newKeyFactory().setKind(FORUM).newKey(forum)))
								  .build();

		QueryResults<Entity> messages = datastore.run(msgQuery);

		List<MessageInfo> forumMsg = new LinkedList<>();

		messages.forEachRemaining(msg -> {
			forumMsg.add(new MessageInfo(msg.getString(OWNER), msg.getString(MESSAGE), msg.getString(CRT_DATE), msg.getLong(ORDER)));
		});

        //Collections.sort(forumMsg, new SortByOrder());

		return forumMsg;
    }

    public void deleteUserForums(String username, Transaction tn){
        Query<Entity> forumQuery = Query.newEntityQueryBuilder().setKind(FORUM)
								  .setFilter(PropertyFilter.hasAncestor(
                				  datastore.newKeyFactory().setKind(USER).newKey(username)))
								  .build();

		QueryResults<Entity> forumResult = datastore.run(forumQuery);

        while(forumResult.hasNext()){
            tn.delete(forumResult.next().getKey());
        }
    }
    
}