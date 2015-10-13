package fr.enseirb.t2.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import mongodb.MembreManager;
import objects.Checking;
import objects.Membre;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

//servlet de gestion des membres
@Path("/membre")
public class JSONMembre {

	//dans le cas d'un ajout d'un membre on fait un post sur l'url "/membre"		
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public BasicDBObject addMembre(Membre membre)
	{
		MembreManager mm = new MembreManager();		//on crée un nouveau MembreManager(connexion à la base de donnée)
		membre.setId();								//on donne un id à ce membre
		return mm.addAMembre(membre);				//on l'ajoute à la table

	}

	//dans le cas d'une récupération d'un membre par son id on fait un get sur l'url "/membre/{membreId}"
	@GET
	@Path("/{membreId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public DBObject getAMembre(@PathParam("membreId") String mail){

		MembreManager mm = new MembreManager();
		return mm.getAMembre(mail);
	}

	//dans le cas d'une édition du mot de passe d'un membre on fait un put sur l'url "/membre/{membreId}"
	@PUT
	@Path("/{membreId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Membre editAMembre(@PathParam("membreId") String id, Membre membre){	

		MembreManager mm = new MembreManager();
		mm.editAMembre(id, membre);	

		return membre;
	}
	
	//dans le cas d'une vérification d'un membre on fait un post sur l'url "/membre/checking"	
	@POST
	@Path("/checking")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Checking checkingMembre(Membre membre)
	{

		MembreManager mm = new MembreManager();
		return mm.checkingAMembre(membre);
		
	}
	
}
