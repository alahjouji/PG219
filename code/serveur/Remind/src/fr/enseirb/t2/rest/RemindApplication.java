package fr.enseirb.t2.rest;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/rest")
public class RemindApplication extends Application {
	@Override
	public Set<Class<?>> getClasses(){
		Set<Class<?>> classes=new HashSet<>();
		classes.add(JSONMembre.class);
		classes.add(JSONTodo.class);
		return classes;
	}
}
