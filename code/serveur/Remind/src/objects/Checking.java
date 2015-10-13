package objects;
//lors de la connexion ou la création d'un compte on fait un post sur le serveur avec un membre ayant le mail et le mot de passe remplis par l'utilisateur.
// On récupère alors un objet Checking qui nous indique si le membre existe ou pas et dans le cas d'existence si le mot de passe est conforme à celui dans 
//la base.
public class Checking {

	boolean checked;
	boolean exist;
	
	public Checking(){
		this.checked = false;
		this.exist = false;
	}
	
	public boolean getChecked(){
		return this.checked;
	}
	
	public void setChecked(boolean check){
		this.checked = check;
	}
	
	public boolean getExist(){
		return this.exist;
	}
	
	public void setExist(boolean exist){
		this.exist = exist;
	}
}
