package objects;

import org.bson.types.ObjectId;
//un objet Membre a pour attributs: un id, un mail,un mot de passe, une date de création, le nombre de todos depuis sa création et un id MongoDB.
public class Membre {

	String id;
	String mail;
	String pass;
	String creationDate;
	int totalTodos;
	String _id;	
	

	public int getTotalTodos() {
		return totalTodos;
	}

	public void setTotalTodos(int totalTodos) {
		this.totalTodos = totalTodos;
	}

	public Membre() {
		this.id = new ObjectId().toString();
	}

	public String getId() {
		return id;
	}

	public void setId() {		//on prend un id de MongoDB
		this.id = new ObjectId().toString();
	}
	
	public void setId(String id){
		this.id = id;
	}

	public String getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(String creationDate) {
		this.creationDate = creationDate;
	}

	public String getMail() {
		return mail;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	public String getPass() {
		return pass;
	}

	public void setPass(String pass) {
		this.pass = pass;
	}

	public String get_id() {
		return _id;
	}
	
	public void set_id(String _id) {
		this._id = _id;
	}

	
	
}
