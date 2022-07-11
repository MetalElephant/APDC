package pt.unl.fct.di.adc.avindividual.resources;

import java.util.Random;
import java.util.logging.Logger;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import pt.unl.fct.di.adc.avindividual.util.Roles;

import com.google.appengine.repackaged.org.apache.commons.codec.digest.DigestUtils;
import com.google.cloud.Timestamp;
import com.google.cloud.datastore.*;

@Path("/startup")
@Produces(MediaType.APPLICATION_JSON + ";charset=utf-8")
public class StartupResource {

	private static final Logger LOG = Logger.getLogger(StatisticsResource.class.getName());

	private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    //Create a stats entity with the key being the number of users/parcels in total
    //Add 1 to the count when a user/parcel is created and minus 1 when removed

    private static final Random r = new Random();

	//Keys
	private static final String USER = "Utilizador";
    private static final String PARCEL = "Parcela";
    private static final String FORUM = "Fórum";
    private static final String MESSAGE = "Mensagem";
    private static final String STAT = "Estatística";
    private static final String VALUE = "Valor";
    private static final String SECRET = "Segredo";

    private static final int SECRET_LENGTH = 64;

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

    private static final String SU_USERNAME = "SU";
    private static final String SU_NAME = "SU";
    private static final String SU_PASSWORD = "Admin123!";
    private static final String SU_EMAIL = "app.land.it@gmail.com";
    private static final String SU_DISTRICT = "Lisboa";
    private static final String SU_COUNTY = "Lisboa";
    private static final String SU_AUTARCHY = "Odivelas";
	private static final int SU_POINTS = 100000;

    private static final String UNDEFINED = "Não Definido";

	public StartupResource() {}

	@POST
	@Path("/superuser")
	public Response createSuperUser() {
		LOG.info("Attempt to create super user.");

        Transaction tn = datastore.newTransaction();

        Key userKey = datastore.newKeyFactory().setKind(USER).newKey(SU_USERNAME);

        try {
            Entity SU = tn.get(userKey);

            if (SU != null){
                return Response.status(Status.CONFLICT).entity("Super User already exists.").build();
            }

            SU = Entity.newBuilder(userKey)
                    .set(NAME, SU_NAME)
                    .set(PASSWORD, DigestUtils.sha512Hex(SU_PASSWORD))
                    .set(EMAIL, SU_EMAIL)
                    .set(ROLE, Roles.SUPERUSER.getRole())
                    .set(DISTRICT, SU_DISTRICT)
                    .set(COUNTY, SU_COUNTY)
                    .set(AUTARCHY, SU_AUTARCHY)
                    .set(STREET, UNDEFINED)
                    .set(MPHONE, UNDEFINED)
                    .set(HPHONE, UNDEFINED)
                    .set(NIF, UNDEFINED)
                    .set(PHOTO, UNDEFINED)
                    .set(POINTS, SU_POINTS)
                    .set(NPARCELSCRT, 0)
                    .set(NPARCELSCO, 0)
					.set(NFORUMS, 0)
					.set(NMSGS, 0)
                    .set(CTIME, Timestamp.now())
                    .build();
            
            tn.add(SU);
            tn.commit();

            return Response.ok("Super User created.").build();
        }finally{
            if (tn.isActive())
            tn.rollback();
        }
	}

    @POST
    @Path("/statistics")
    public Response createStatistics(){
        LOG.info("Attempt to create statistics.");

        Transaction tn = datastore.newTransaction();

        Key userStatsKey = datastore.newKeyFactory().setKind(STAT).newKey(USER);
        Key parcelStatsKey = datastore.newKeyFactory().setKind(STAT).newKey(PARCEL);
        Key forumStatsKey = datastore.newKeyFactory().setKind(STAT).newKey(FORUM);
        Key messageKey = datastore.newKeyFactory().setKind(STAT).newKey(MESSAGE);

        try {
            Entity uStats = tn.get(userStatsKey);

            if (uStats != null){
                return Response.status(Status.CONFLICT).entity("Statistics already exist.").build();
            }

            uStats = Entity.newBuilder(userStatsKey)
                    .set(VALUE, 0L)
                    .build();

            Entity pStats = Entity.newBuilder(parcelStatsKey)
                    .set(VALUE, 0L)
                    .build();

            Entity fStats = Entity.newBuilder(forumStatsKey)
                    .set(VALUE, 0L)
                    .build();

            Entity mStats = Entity.newBuilder(messageKey)
                    .set(VALUE, 0L)
                    .build();
            
            tn.add(uStats, pStats, fStats, mStats);
            tn.commit();

            return Response.ok("Statistics created.").build();
        }finally{
            if (tn.isActive())
                tn.rollback();
        }
    }

    @POST
    @Path("/secrets")
    public Response createSecrets() {
        LOG.info("Attempt to create secrets");

        Transaction tn = datastore.newTransaction();

        Key suSecretKey = datastore.newKeyFactory().setKind(SECRET).newKey(Roles.SUPERUSER.getRole());
        Key moderatorSecretKey = datastore.newKeyFactory().setKind(SECRET).newKey(Roles.MODERADOR.getRole());
        Key representativeSecretKey = datastore.newKeyFactory().setKind(SECRET).newKey(Roles.REPRESENTANTE.getRole());
        Key merchantSecretKey = datastore.newKeyFactory().setKind(SECRET).newKey(Roles.COMERCIANTE.getRole());
        Key ownerSecretKey = datastore.newKeyFactory().setKind(SECRET).newKey(Roles.PROPRIETARIO.getRole());

        try {
            Entity suSecret = tn.get(suSecretKey);

            if (suSecret != null){
                return Response.status(Status.CONFLICT).entity("Secrets already exist.").build();
            }

            suSecret = Entity.newBuilder(suSecretKey)
                    .set(SECRET, generateSecret(SECRET_LENGTH))
                    .build();

            Entity moderatorSecret = Entity.newBuilder(moderatorSecretKey)
                    .set(SECRET, generateSecret(SECRET_LENGTH))
                    .build();

            Entity representativeSecret = Entity.newBuilder(representativeSecretKey)
                    .set(SECRET, generateSecret(SECRET_LENGTH))
                    .build();

            Entity merchantSecret = Entity.newBuilder(merchantSecretKey)
                    .set(SECRET, generateSecret(SECRET_LENGTH))
                    .build();

            Entity ownerSecret = Entity.newBuilder(ownerSecretKey)
                    .set(SECRET, generateSecret(SECRET_LENGTH))
                    .build();
            
            tn.add(suSecret, moderatorSecret, representativeSecret, merchantSecret, ownerSecret);
            tn.commit();

            return Response.ok("Secrets created.").build();
        } finally {
            if (tn.isActive())
                tn.rollback();
        }
    }

    private static String generateSecret(int length) {
		String capitalCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
		String specialCharacters = "!@#$";
		String numbers = "1234567890";
		String combinedChars = capitalCaseLetters + lowerCaseLetters + specialCharacters + numbers;
		char[] secret = new char[length];
  
		secret[0] = lowerCaseLetters.charAt(r.nextInt(lowerCaseLetters.length()));
		secret[1] = capitalCaseLetters.charAt(r.nextInt(capitalCaseLetters.length()));
		secret[2] = specialCharacters.charAt(r.nextInt(specialCharacters.length()));
		secret[3] = numbers.charAt(r.nextInt(numbers.length()));
	 
		for(int i = 4; i< length ; i++) {
		   secret[i] = combinedChars.charAt(r.nextInt(combinedChars.length()));
		}

		return String.valueOf(secret);
	}
}
