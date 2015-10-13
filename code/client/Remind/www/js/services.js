'use strict';

/* Services */

var remindServices = angular.module('remind.services', ['ngResource']);

remindServices.factory('Todos', ['$resource',
	function ($resource) {
		return $resource('http://alahjouji.rmorpheus.enseirb.fr/Remind/rest/todo/:todoId', {}, {
			post: {
				method: 'POST'
			},
			getAnId: {
				method: 'GET',
				url: 'http://alahjouji.rmorpheus.enseirb.fr/Remind/rest/todo/:user/:todoId',
				isArray : false
			},
			update: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			},
			getWithMail: {
				method: 'GET',
				url: 'http://alahjouji.rmorpheus.enseirb.fr/Remind/rest/todo/:user?state=:state&category=:category/:todoId',
				isArray:true
			}
		});
	}
]);

remindServices.factory('Membre', ['$resource',
	function ($resource) {
			return $resource('http://alahjouji.rmorpheus.enseirb.fr/Remind/rest/membre/:membreId', {}, {
			post: {
				method: 'POST'
			},
			update: {
				method : 'PUT'
			},
			checkit:{
				method : 'POST',
				url : 'http://alahjouji.rmorpheus.enseirb.fr/Remind/rest/membre/checking'
			},
			get:{
				method : 'GET',
				isArray : false
			}
		});
	}
]);

remindServices.factory("myService", function(){

  return {sharedObject: {data: null } }
});


