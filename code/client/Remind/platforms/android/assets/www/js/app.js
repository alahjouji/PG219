'use strict';

var remindApp = angular.module('remind', [
	'ngRoute',
	'ngTouch',
	'ngCookies',
	'remindFilters',
	'remind.services',
	'remind.controllers',
	'ui.bootstrap'
	
])

remindApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/registration', {
			templateUrl: 'partials/registration.html',
			controller: 'RegistrationCtrl'
		}).
		when('/todos/:userId', {
			templateUrl: 'partials/todos.html',
			controller: 'TodosListCtrl'
		}).
		when('/profil/:userId', {
			templateUrl: 'partials/profil.html',
			controller: 'ProfilCtrl'
		}).
		when('/todos/:userId/:todoId', {
			templateUrl: 'partials/detail.html',
			controller: 'TodoDetailsCtrl'
		}).
		otherwise({
			redirectTo: '/registration'
		});
}]);
