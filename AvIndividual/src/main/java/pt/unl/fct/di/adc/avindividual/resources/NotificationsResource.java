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

import pt.unl.fct.di.adc.avindividual.util.RequestData;
import pt.unl.fct.di.adc.avindividual.util.Info.NotificationInfo;

import com.google.cloud.datastore.*;
import com.google.cloud.datastore.StructuredQuery.PropertyFilter;

@Path("/notification")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class NotificationsResource {

	private static final Logger LOG = Logger.getLogger(NotificationsResource.class.getName());
    private final Gson g = new Gson();
	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

	//Keys
	private static final String NOTIFICATION = "Notificação";
    private static final String USER = "Utilizador";

	//Notification information
	private static final String MESSAGE = "Mensagem";

	public NotificationsResource() {}

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response registerNotification(RequestData data){
        LOG.info("Attempt to create notification.");

        Transaction tn = datastore.newTransaction();

        IncompleteKey notifIncKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.username)).setKind(NOTIFICATION).newKey();
        Key notifKey = datastore.allocateId(notifIncKey);

        try {
            Entity notification = Entity.newBuilder(notifKey)
                                        .set(MESSAGE, data.name)
                                        .build();
            
            tn.add(notification);
            tn.commit();

            return Response.ok("Notification created.").build();
        }finally{
            if (tn.isActive())
            tn.rollback();
        }
    }

    @DELETE
    @Path("/remove")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeNotification(RequestData data){
        LOG.info("Attempt to remove notification.");

        Transaction tn = datastore.newTransaction();

        IncompleteKey notifIncKey = datastore.newKeyFactory().addAncestors(PathElement.of(USER, data.username)).setKind(NOTIFICATION).newKey();
        Key notifKey = datastore.allocateId(notifIncKey);

        try {
            if (tn.get(notifKey) == null){
                LOG.warning("Notification does not exist");
				return Response.status(Status.BAD_REQUEST).entity("Notification does not exist").build();
            }

            tn.delete(notifKey);
            tn.commit();

            return Response.ok("Notification removed.").build();
        }finally{
            if (tn.isActive())
            tn.rollback();
        }
    }

    @POST
    @Path("/list")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response listNotifications(RequestData data){
        LOG.info("Attempt to list parcels of user: " + data.username);

		if(!data.isUsernameValid()){
			return Response.status(Status.BAD_REQUEST).entity("Missing or wrong parameter.").build();
		}

		Key userKey = datastore.newKeyFactory().setKind(USER).newKey(data.username);
		
		Entity user = datastore.get(userKey);

		if (user == null) {				
			LOG.warning("User does not exist");
			return Response.status(Status.BAD_REQUEST).entity("User " + data.username + " does not exist").build();
		}
			
		List<NotificationInfo> parcelList = getQueries(data.username);

		return Response.ok(g.toJson(parcelList)).build();	
    }

    private List<NotificationInfo> getQueries(String username){
        Query<Entity> notificationQuery = Query.newEntityQueryBuilder().setKind(NOTIFICATION)
								  .setFilter(PropertyFilter.hasAncestor(datastore.newKeyFactory().setKind(NOTIFICATION).newKey(username)))
								  .build();

		QueryResults<Entity> notifications = datastore.run(notificationQuery);

		List<NotificationInfo> userNotifs = new LinkedList<>();

		notifications.forEachRemaining(notification -> {
			userNotifs.add(new NotificationInfo(notification.getString(MESSAGE)));
		});

		return userNotifs;
    }
}
