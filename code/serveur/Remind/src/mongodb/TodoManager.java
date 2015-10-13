package mongodb;

import java.util.ArrayList;
import java.util.List;

import objects.ToDo;

import org.bson.types.ObjectId;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;

//Cette classe définie les mthodes utilisés pour gérer les Todos.
@JsonIgnoreProperties(ignoreUnknown=true)
public class TodoManager {

	static int PORT = 27017;                 //port de connexion de Mongodb
	static String HOSTNAME = "localhost";    //hostname de l'instance de connexion de Mongodb
	static String DATABASE = "projet";		 //nom de la base de donnée sur MongoDB
	static String TODO_TABLE = "todo";		 //nom de la table utilisée

	// Variables
	MongoClient mongoClient;				 //le mongoclient dont on se sert pour toutes les connexions
	DB database;							 //la base de donnée utilisée
	DBCollection collection;				 //la table utilisée


	// Constructeurs
	public TodoManager() {

		try {
			this.mongoClient = new MongoClient(HOSTNAME, PORT); //nouveau Mongoclient avec le bon port et le bon hostname
		} catch (Exception e) {
			e.printStackTrace();
		}
		this.database = this.mongoClient.getDB(DATABASE);  //récupérer la base de donnée "projet" ou en créer une si elle n'existe pas

	}

	// Methodes

	//ajouter un Todo à la table "todo"
	public BasicDBObject addATodo(ToDo todo){

		BasicDBObject document = new BasicDBObject();   //le document à ajouter à la table
		document.put("id", todo.getId());						//ajouter l'id du todo
		document.put("title", todo.getTitle());					//ajouter le titre du todo
		document.put("description", todo.getDescription());		//ajouter la description du todo
		document.put("deadline", todo.getDeadline());			//ajouter la deadline du todo
		document.put("owner", todo.getOwner());					//ajouter le propriétaire du todo
		document.put("state", todo.getState());					//ajouter l'état du todo
		document.put("_id", new ObjectId().toString());			//ajouter l'id MongoDB du todo
		document.put("category", todo.getCategory());			//ajouter la catégorie du todo

		this.collection = this.database.getCollection(TODO_TABLE);		//récupérer la table "todo" ou en créer une si elle n'existe pas
		this.collection.insert(document);								//insérer le document dans la table

		return document;												//retourner le document ajouté (pour le récupérer lors du post)

	}
	
	//récupérer un todo à partir de son id et de son popriétaire
	public DBObject getTodoWithUserAndId(String mail, String id){
	
		BasicDBObject searchQuery = new BasicDBObject();				//la query à passer à la table
		searchQuery.put("id", id);
		searchQuery.put("owner", mail);

		this.collection = this.database.getCollection(TODO_TABLE);		
		DBObject ans = collection.findOne(searchQuery);					
		return ans;			//récupérer le todo correspondant à la query envoyé 
	}

	//éditer un todo à partir de son id
	public ToDo editATodo(String id, ToDo todo){


		BasicDBObject document = new BasicDBObject();					//le dcument par lequel on va remplacer l'ancien
		document.append("$set", new BasicDBObject()
		.append("title", todo.getTitle())
		.append("description", todo.getDescription())
		.append("deadline", todo.getDeadline())
		.append("state", todo.getState())
		.append("owner", todo.getOwner())
		.append("category", todo.getCategory()));


		BasicDBObject searchQuery = new BasicDBObject();				//la query à passer à la table
		searchQuery.put("id", id);

		this.collection = this.database.getCollection(TODO_TABLE);
		collection.update(searchQuery, document);						//mettre à jour le document correspondant à la query

		return todo;													//retourner le todo
	}


	//effacer un todo à parti de son id
	public DBObject deleteATodo(String id){

		BasicDBObject searchQuery = new BasicDBObject();
		searchQuery.put("id", id);

		this.collection = this.database.getCollection(TODO_TABLE);
		DBObject ans = collection.findOne(searchQuery);
		this.collection.remove(ans);								//effacer le document correspondant à la query

		return ans;													//retourner le document effacé (pour le récupérer lors du delete)
	}

	//récupérer tous les todos d'un membre à partir de son mail
	public List<BasicDBObject> getAllUserTodos(String mail){
		
		this.collection = this.database.getCollection(TODO_TABLE);
		List<BasicDBObject> response=new ArrayList<BasicDBObject>();
		BasicDBObject searchQuery = new BasicDBObject();
		searchQuery.put("owner", mail);


		DBCursor cursor = collection.find(searchQuery);			//récupérer le curseur sur la liste des todos correspondant à la query
		
		while(cursor.hasNext()){
			//ajouter les todos à la liste à renvoyer
			
			//on fait un cast d'un DBObject vers un BasicDBObject parcequ'une List<DBObject> entraîne une réponse:
			//[{"partialObject":false},{"partialObject":false}]
			
			response.add((BasicDBObject)cursor.next());	
		}

		return response;										//retourner la liste des todos du membre
	}
	
	//récupérer tous les todos d'un membre selon l'état
	public List<BasicDBObject> getUserTodosWithState(String state, String mail){

		this.collection = this.database.getCollection(TODO_TABLE);
		List<BasicDBObject> response=new ArrayList<BasicDBObject>();

		BasicDBObject searchQuery = new BasicDBObject();
		searchQuery.append("state", state).append("owner", mail);
		
		DBCursor cursor = collection.find(searchQuery);
		
		while(cursor.hasNext())
			response.add((BasicDBObject)cursor.next());

		return response;										//retourner la liste des todos du membre à partir de l'état
	}

	//récupérer tous les todos d'un membre selon la catégorie
	public List<BasicDBObject> getTodosWithCategory(String mail, String category){
		
		this.collection = this.database.getCollection(TODO_TABLE);
		List<BasicDBObject> response=new ArrayList<BasicDBObject>();

		BasicDBObject searchQuery = new BasicDBObject();
		searchQuery.append("owner", mail).append("category", category);
		
		DBCursor cursor = collection.find(searchQuery);
		
		while(cursor.hasNext())
			response.add((BasicDBObject)cursor.next());

		return response;										//retourner la liste des todos du membre à partir de la catégorie
	}
	
	//récupérer tous les todos d'un membre selon l'état et la catégorie
	public List<BasicDBObject> getUserTodosWithStateAndCategory(String state, String mail, String category){

		this.collection = this.database.getCollection(TODO_TABLE);
		List<BasicDBObject> response=new ArrayList<BasicDBObject>();

		BasicDBObject searchQuery = new BasicDBObject();
		searchQuery.append("state", state).append("owner", mail).append("category", category);
		
		DBCursor cursor = collection.find(searchQuery);
		
		while(cursor.hasNext())
			response.add((BasicDBObject)cursor.next());

		return response;										//retourner la liste des todos du membre à partir de la catégorie et de l'état
	}

	
}
