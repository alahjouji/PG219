package mongodb;

import objects.Checking;
import objects.Membre;

import org.bson.types.ObjectId;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

//Cette classe définie les mthodes utilisés pour gérer les Membres.
@JsonIgnoreProperties(ignoreUnknown=true)
public class MembreManager {

	static int PORT = 27017;					//port de connexion de Mongodb
	static String HOSTNAME = "localhost";		//hostname de l'instance de connexion de Mongodb
	static String DATABASE = "projet";			//nom de la base de donnée sur MongoDB
	static String MEMBRE_TABLE = "membre";		//nom de la table utilisée

	// Variables
	MongoClient mongoClient;				 //le mongoclient dont on se sert pour toutes les connexions
	DB database;							 //la base de donnée utilisée
	DBCollection collection;				 //la table utilisée


	// Constructeurs
	public MembreManager() {

		try {
			this.mongoClient = new MongoClient(HOSTNAME, PORT); //nouveau Mongoclient avec le bon port et le bon hostname
		} catch (Exception e) {
			e.printStackTrace();
		}
		this.database = this.mongoClient.getDB(DATABASE);  //récupérer la base de donnée "projet" ou en créer une si elle n'existe pas

	}
	
	//Methodes

	//ajouter un Membre à la table "membre"
	public BasicDBObject addAMembre(Membre membre){

		BasicDBObject document = new BasicDBObject();	//le document à ajouter à la table
		document.put("id", membre.getId());								//ajouter l'id du membre
		document.put("mail", membre.getMail());							//ajouter le mail du membre
		document.put("pass", membre.getPass());							//ajouter le mot de passe du membre			
		document.put("totalTodos", membre.getTotalTodos());				//ajouter le nombre total des todos du membre
		document.put("_id", new ObjectId().toString());					//ajouter l'id MongoDB du membre
		document.put("creationDate", membre.getCreationDate());			//ajouter la date de création du membre

		this.collection = this.database.getCollection(MEMBRE_TABLE);		//récupérer la table "membre" ou en créer une si elle n'existe pas
		this.collection.insert(document);								//insérer le document dans la table

		return document;												//retourner le document ajouté (pour le récupérer lors du post)
	}
	
	//récupérer un membre à partir de son mail
	public DBObject getAMembre(String mail){

		BasicDBObject searchQuery = new BasicDBObject();				//la query à passer à la table
		searchQuery.put("mail", mail);

		this.collection = this.database.getCollection(MEMBRE_TABLE);
		DBObject ans = collection.findOne(searchQuery);

		return ans;				//récupérer le membre correspondant à la query envoyé 
	}
	
	//éditer un membre à partir de son id
	public Membre editAMembre(String id, Membre membre){


		BasicDBObject document = new BasicDBObject();				//le dcument par lequel on va remplacer l'ancien
		document.append("$set", new BasicDBObject()
		.append("pass", membre.getPass())
		.append("totalTodos", membre.getTotalTodos()));


		BasicDBObject searchQuery = new BasicDBObject();			//la query à passer à la table
		searchQuery.put("mail", id);

		this.collection = this.database.getCollection(MEMBRE_TABLE);
		collection.update(searchQuery, document);					//mettre à jour le document correspondant à la query
		
		return membre;												//retourner le membre
		
	}
	
	//vérifier l'existence d'un membre et/ou la validité de son mot de passe	
	public Checking checkingAMembre(Membre membre){
		
		Checking chk = new Checking();				//l'objet checking à retourner
		
		BasicDBObject searchQuery = new BasicDBObject();		//la query à passer à la table
		searchQuery.put("mail", membre.getMail());

		this.collection = this.database.getCollection(MEMBRE_TABLE);
		DBObject ans = collection.findOne(searchQuery);			//le dbobject récupéré
		
		if(ans != null){					//si la query renvoit un membre alors il existe
		
			chk.setExist(true);
		
			if(ans.get("pass").equals(membre.getPass()))	//si le mot de passe du membre remplis correspond au mot de passe du membre récupéré alors checked 
				chk.setChecked(true);
		
		}
		
		return chk;					//retourner l'objet (pour le récupérer lors du post)
		
	}
}
