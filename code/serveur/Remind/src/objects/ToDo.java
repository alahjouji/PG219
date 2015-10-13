package objects;

import org.bson.types.ObjectId;
//un objet Todo a pour attributs: un id, un propriétaire, un titre, une description, une deadline (null par défaut), un état (En cours ou Effectué), une 
//catégorie (Travail, Loisir, Autre "l'activité par défaut") et un id MongoDB.
public class ToDo {

	String id;
	String owner;
	String title;
	String description;
	String deadline;
	String state;
	String category;
	String _id;
	
	public ToDo(String title, String content, String owner, String state, String deadline, String category){
		this.title = title;
		this.description = content;
		this.owner = owner;
		this.deadline = deadline;
		this.state=state;
		this.category=category;
	}

	public ToDo() {
		this.id = new ObjectId().toString();
	}

	public String getId() {
		return id;
	}

	public void setId() {	//on prend un id à partir de MongoDB
		this.id = new ObjectId().toString();
	}
	
	public void setId(String id){
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String content) {
		this.description = content;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getDeadline() {
		return deadline;
	}

	public void setDeadline(String deadline) {
		this.deadline = deadline;
	}

	public String get_id() {
		return _id;
	}
	
	public void set_id(String _id) {
		this._id = _id;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	
	
}
