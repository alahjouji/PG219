package fr.enseirb.t2.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import mongodb.TodoManager;
import objects.ToDo;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

//servlet de gestion des todos
@Path("/todo")
public class JSONTodo {

	//dans le cas d'un ajout d'un todo on fait un post sur l'url "/todo"
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public BasicDBObject addTodo(ToDo todo)
	{

		TodoManager td2 = new TodoManager();	//on crée un nouveau TodoManager(connexion à la base de donnée)
		todo.setId();							//on donne un id à ce todo
		return td2.addATodo(todo);				//on l'ajoute à la table

	}

	//dans le cas d'une édition d'un todo on fait un put sur l'url "/todo/{id}"
	@PUT
	@Path("/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public ToDo editATodo(@PathParam("id") String id, ToDo todo){	

		TodoManager td2 = new TodoManager();
		td2.editATodo(id, todo);	

		return todo;
	}

	//dans le cas d'une supression d'un todo on fait un delete sur l'url "/todo/{id}"
	@DELETE
	@Path("/{id}")
	@Consumes(MediaType.APPLICATION_JSON)
	public void deleteATodo(@PathParam("id") String id){	

		TodoManager td2 = new TodoManager();
		td2.deleteATodo(id);	

	}

	//dans le cas d'une récupération d'un todo à partir de l'état et la catégorie on fait un get sur l'url "/todo/{user}" avec des QueryParam state et category	
	@GET
	@Path("/{user}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<BasicDBObject> getTodoWithMail(@QueryParam("state") String state,
			@PathParam("user") String mail,
			@QueryParam("category") String category){

		if(category.equals("")){			
			
			if(state.equals(""))
				return new TodoManager().getAllUserTodos(mail);					//si la catégorie=="" et l'état=="" on récupère tous les todos du membre
			else
				return new TodoManager().getUserTodosWithState(state, mail);	//si la catégorie=="" et l'état!="" on récupère les todos du membre selon l'état
		}
		
		else{
			if(state.equals("")){
				//si la catégorie!="" et l'état=="" on récupère les todos du membre selon la catégorie
				return new TodoManager().getTodosWithCategory(mail, category);
			}
			else{
				//si la catégorie!="" et l'état!="" on récupère les todos du membre selon la catégorie et l'état
				return new TodoManager().getUserTodosWithStateAndCategory(state, mail, category);
			}
		}
		
		

	}

	//dans le cas d'une récupération d'un todo à partir du mail et de l'id on fait un get sur l'url "/todo/{user}/{todoId}"		
	@GET
	@Path("/{user}/{todoId}")
	@Produces(MediaType.APPLICATION_JSON)
	public DBObject getTodoWithId(@PathParam("user") String mail,
			@PathParam("todoId") String id){

			return new TodoManager().getTodoWithUserAndId(mail, id);

	}

}
