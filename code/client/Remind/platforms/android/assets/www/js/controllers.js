'use strict';

/* Controllers */

var remindCtrls = angular.module('remind.controllers',['remind.services']);

//8 - 136//		128 lignes : 4 fonctions
remindCtrls.controller('RegistrationCtrl', ['$scope', 'Membre', '$location', function($scope, Membre, $location) {

	// On initialise les variables du $scope
	$scope.isAlreadyAMembre = true;
	$scope.existError = false;
	
	// Cette variable va nous permettre d'afficher ou non le contenu des différentes vues 
	window.localStorage.setItem("connected", false);
	
	//Le bouton createAnAcount permet d'afficher un troisième champs pour confirmer le mot de passe 
	//et d'afficher les boutons valider et annuler
	$scope.createAnAcount = function() {

		$scope.isAlreadyAMembre = false;
		$scope.existError = false;
	};

	//Permet d'ajouter un membre (après une série de tests)
	$scope.addAMembre = function() {

		$scope.existError = false;

		//Test 1 : le remplissage des champs

		if($scope.userMail==null || $scope.userPass==null || $scope.userPass2==null){
			$scope.existError = true;
			$scope.error = "Veuillez remplir tous les champs";
		}
		else{

			//Test 2 : le format du mail

			var reg = new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i');
			
			if(!reg.test($scope.userMail)){

				$scope.existError = true;
				$scope.error = "Ce mail n'est pas valide";
			}

			else {

			//Test 3 : Les mots de passe identiques	
				if($scope.userPass != $scope.userPass2){

					$scope.existError = true;
					$scope.error = "Les mots de passe doivent être identiques !";			
				}

				else{

					var membre = new Membre();
					membre.mail = $scope.userMail;
					membre.pass = calcMD5($scope.userPass);

					Membre.checkit(membre,
						function(callbackdata){

			//Test 4 : L'unicité du mail dans la base de données  
							if(callbackdata.exist){

								$scope.existError = true;
								$scope.error = "Ce pseudo est déjà utilisé !";
							}

							else{

								var creationDate = new Date();
								var dateString = creationDate.toLocaleDateString();
								
								membre.creationDate = dateString;
								
								Membre.post(membre, function(){
									$location.path('/todos/'+ $scope.userMail).search({state: 'encours'}).replace();
									window.localStorage.setItem("connected", true);
			
								});
							}
					});
			
				}
			}	
		}
	};

	//Permet de vérifier le mail et le mot de passe saisis
	$scope.checkingMembre = function(){

		$scope.existError = true;

		//Test 1 : le remplissage des champs
		if($scope.userMail==null || $scope.userPass==null){
			$scope.error = "Veuillez remplir tous les champs";
		}
		else{
			var membre = new Membre();
			membre.mail = $scope.userMail;
			membre.pass = calcMD5($scope.userPass);
		
			Membre.checkit(membre,
				function(callbackdata){
					
					//Test 2 : L'existence du pseudo dans la base de données
					if(!callbackdata.exist)
						$scope.error = "Le membre n'existe pas !";

					//Test 3 : La correspondance des mots de passe
					else if(!callbackdata.checked)
						$scope.error = "Mot de passe incorrect !";

					else if (callbackdata.exist && callbackdata.checked){
						$scope.existError = false;
						$location.path('/todos/'+ $scope.userMail).search({state: 'encours'}).replace();
						window.localStorage.setItem("connected", true);
					}	

				});
		}		
	};

	//Permet de supprimer le troisième champs et de revenir à une vue de connexion
	$scope.cancel = function(){

		$scope.isAlreadyAMembre = !$scope.isAlreadyAMembre;
		$scope.existError = false;
		$scope.error = "";
	};
}
]);


//140 - 292//	152 lignes : 8 fonctions
remindCtrls.controller('TodosListCtrl', ['$scope', '$routeParams', 'Todos', '$location', function ($scope, $routeParams, Todos, $location) {

	//On vérifie la valeur de la variable locale, si elle est fausse, il n'y a pas de connexion, on retourne à la page d'authentification
	if(window.localStorage.getItem("connected")=="false")	
		$location.path('/#').replace();

	//On initialise les variables du $scope
	$scope.state = $routeParams.state;
	$scope.user = $routeParams.userId;
	$scope.nums = [];

	$scope.addATask=true;

	$scope.category = "";
	$("#filter-all").attr("class", "btn btn-primary");

	$("#tabEnCours").attr("class", "tab-item active");
				
	$scope.orderProp = "title";	
	$("#sortByTitle").attr("disabled", true);

	//Permer de filtrer les todos selon l'état choisi (En cours, Effectué, Tous)
	switch($routeParams.state) {
		case "finish":
			$scope.nums = Todos.getWithMail({user: $scope.user, state: "Effectué", category: $scope.category});
			$scope.addATask=false;
			$("#tabFinish").attr("class", "tab-item active");
			$("#tabEnCours").attr("class", "tab-item");
			$("#tabAll").attr("class", "tab-item");
			break;
		case "all":
			$scope.nums = Todos.getWithMail({user: $scope.user, category: $scope.category});
			$scope.addATask=false;
			$("#tabAll").attr("class", "tab-item active");			
			$("#tabFinish").attr("class", "tab-item");
			$("#tabEnCours").attr("class", "tab-item");
			break;
		default:
			$scope.nums = Todos.getWithMail({user: $scope.user, state: "En cours", category: $scope.category});
			$("#tabEnCours").attr("class", "tab-item active");
			$("#tabFinish").attr("class", "tab-item");
			$("#tabAll").attr("class", "tab-item");
			break;
	}

	//Permet de faire le tri par titre ou deadline
	$scope.sort = function(orderProp){

		switch($scope.orderProp){

			case "title" :
				$scope.orderProp = "deadline";

				$("#sortByTitle").attr("disabled", false);
				$("#sortByDeadline").attr("disabled", true);

				$("#sortByDeadline").attr("class", "btn btn-primary");
				$("#sortByTitle").attr("class", "btn");
				
				break;

			case "deadline" :
				$scope.orderProp = "title";
				
				$("#sortByDeadline").attr("disabled", false);
				$("#sortByTitle").attr("disabled", true);

				$("#sortByTitle").attr("class", "btn btn-primary");
				$("#sortByDeadline").attr("class", "btn");

				break;
		}
	};

	//Permet de "valider" une tâche (le passer de l'état "En cours" à l'état "Effectué")
	$scope.check = function(todo, index, $scope){

		//On récupère toutes les checkbox
		var inputs = document.getElementsByName('checkbox');
		//On affiche l'icone de check sur le bouton vide
		inputs[index].className = "pull-left checking-btn icon icon-check";
		//L'état passe de "En cours" à "Effectué"
		todo.state = "Effectué";

		//On édite le todo sur la base de données et on supprime le todo effectué de cette liste
		Todos.update({todoId: todo.id}, todo, function(toto){
			if($routeParams.state == "encours")
				$scope.nums.splice(getIndexOf($scope.nums, todo.id), 1);
			else
				$scope.nums[getIndexOf($scope.nums, todo.id)] = todo;

		});
	};

	//Permet de se déconnecter, la variable locale reprend la valeur false
	$scope.logout = function(){
		window.localStorage.setItem("connected", false);
		$location.path('/#').replace();
	};

	//Permet de filtrer afin d'afficher TOUS les todos
	$scope.filterAll = function(){

		$scope.category ="";
		$("#filter-work").attr("class", "btn");
		$("#filter-fun").attr("class", "btn");
		$("#filter-other").attr("class", "btn");
		$("#filter-all").attr("class", "btn btn-primary");
	};

	//Permet de filtrer afin d'afficher les todos de TRAVAIL
	$scope.filterWork = function(){

		$("#filter-work").attr("class", "btn btn-primary");
		$("#filter-fun").attr("class", "btn");
		$("#filter-other").attr("class", "btn");
		$("#filter-all").attr("class", "btn");
		$scope.category ="Travail";
	};

	//Permet de filtrer afin d'afficher les todos de LOISIR
	$scope.filterFun = function(){

		$("#filter-work").attr("class", "btn");
		$("#filter-fun").attr("class", "btn btn-primary");
		$("#filter-other").attr("class", "btn");
		$("#filter-all").attr("class", "btn");
		$scope.category ="Loisir";
	};

	//Permet de filtrer afin d'afficher les todos de AUTRE
	$scope.filterOther = function(){

		$("#filter-work").attr("class", "btn");
		$("#filter-fun").attr("class", "btn");
		$("#filter-other").attr("class", "btn btn-primary");
		$("#filter-all").attr("class", "btn");
		$scope.category ="Autre";
	};

	//Fonction utiliser pour retrouver l'index d'un todo dans la liste (il change de place lors des différents tris, filtres)
	function getIndexOf(arr, val) {
      var l = arr.length,
        k = 0;
      for (k = 0; k < l; k++) {
        if (arr[k].id == val) {
          return k;
        }
      }
      return false;
    };
}
]);


//296 - 395//	99 lignes : 4 fonctions 
remindCtrls.controller('ProfilCtrl', ['$scope', '$routeParams', 'Membre', 'Todos', '$location', function ($scope, $routeParams, Membre, Todos, $location) {

	//Test sur la variable locale
	if(window.localStorage.getItem("connected")=="false")	
		$location.path('/#').replace();

	//On initialise les variables du $scope
	$scope.user = $routeParams.userId;
	$scope.editingPass = false;
	$scope.alert = false;
	$scope.totalTodos = 0;
	$scope.todoFinish = 0;
	$scope.todoEnCours = 0;

	//On récupère le membre afin d'afficher son nombre de todo et sa date d'inscription
	Membre.get({membreId: $scope.user}, function(callbackdata){

		$scope.userSubmission = callbackdata.creationDate;
		$scope.totalTodos=callbackdata.totalTodos;
	});

	//On récupère son nombre de todos en cours 
	Todos.getWithMail({state : "En cours", user : $scope.user}, 
		function(callbackdata){
			$scope.todoEnCours = callbackdata.length;
	});

	//On récupère son nombre de todos effectués
	Todos.getWithMail({state : "Effectué", user : $scope.user}, 
		function(callbackdata){
			$scope.todoFinish = callbackdata.length;
	});

	//Permet d'afficher les champs nécessaires à l'édition du mot de passe
	$scope.editPass = function(){
		$scope.editingPass = true;
		clearPass();
	};

	//Permet de supprimer ces champs
	$scope.cancel = function(){
		$scope.editingPass = false;
		clearPass();
		$scope.alert = false;
	};

	//Permet d'éditer le mot de passe du membre (après une série de tests)
	$scope.sendNewPass = function(){

		Membre.get({membreId: $scope.user}, function(callbackdata){

			//Test 1 : Le remplissage des champs
			if($scope.mdp1=="" || $scope.mdp2=="" || $scope.mdp3==""){
				$scope.alertType = "danger";
				$scope.alertMsg = "Veuillez remplir tous les champs";
				$scope.alert = true;
			}
			//Test 2 : Le mot de passe saisi est incorrect
			else if(calcMD5($scope.mdp1) != callbackdata.pass){
				$scope.alertType = "danger";
				$scope.alertMsg = "Le mot de passe saisi est incorrect !";
				$scope.alert = true;
			}

			//Test 3 : Les nouveaux mots de passe sont différents
			else if($scope.mdp2 != $scope.mdp3){
				$scope.alertType = "danger";
				$scope.alertMsg = "Les mots de passe sont différents !";
				$scope.alert = true;
			}

			//Enregistrement du nouveau mot de passe
			else{
				callbackdata.pass = calcMD5($scope.mdp3);

				Membre.update({membreId: callbackdata.mail}, callbackdata, 
					function(callback){
				
						clearPass();
						$scope.editingPass = false;

						$scope.alertType = "success";
						$scope.alertMsg = "Le mot de passe a été modifié !";
						$scope.alert = true;
					}, 
					function(){
						console.log("Erreur");
				});
			}
		});
	};

	//Permet d'effacer les variables de mots de passe du $scope 
	function clearPass(){
		$scope.mdp1="";
		$scope.mdp2="";
		$scope.mdp3="";
	};
}
]);


//399 - 432//	33 lignes : 3 fonctions
remindCtrls.controller('DatepickerDemoCtrl', function ($scope, myService) {

	$scope.myVar = myService.sharedObject;
	$scope.myVar.data = $scope.dt;

	$scope.today = function() {
		$scope.dt = new Date();
	};

	$scope.today();

	$scope.toggleMin = function() {
		
		$scope.minDate = $scope.minDate ? null : new Date();
	};

	$scope.toggleMin();

	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		
		$scope.opened = true;
	};

	$scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1,
			showButtonBar: false,
			datepickerAppendToBody: true
	};

	$scope.format = 'dd/MM/yy';	
});


//436 - 792//	356 lignes : 13 fonctions 
remindCtrls.controller('TodoDetailsCtrl', ['$scope', '$routeParams', 'Todos', '$location', 'myService', 'Membre', function ($scope, $routeParams, Todos, $location, myService, Membre) {

	//Vérification de la variable locale
	if(window.localStorage.getItem("connected")=="false")	
		$location.path('/#').replace();

	//Initialisation des variables du $scope
    $scope.todoId = $routeParams.todoId;
	$scope.user = $routeParams.userId;
	$scope.editDeadline = false;

	$scope.myVar = myService.sharedObject;

	$scope.mytime = new Date();
	$scope.hstep = 1;
	$scope.mstep = 1;

	$scope.category = "Autre";
	$scope.alert=false;

	//Test sur le todoId contenu dans l'url de l'application, nous établissons alors s'il s'agit d'une création ou d'une édition
	switch($scope.todoId){
	
		//Dans le cas d'une création
		case "new" :
			
			$scope.editing = true;
			$scope.shortTitle = "Nouvelle tâche";

			$scope.deleteBut = false;
			
			$scope.todoTitle = "Nouvelle tâche";
			$scope.todoDescription = "Aucune déscription";

			$scope.addOrEditTheDeadline = "Ajouter une deadline";
			$scope.deadlineBut = true;
			
			break;

		//Dans le cas d'une consultation/édition
		default :				
	
			$scope.editing = false;
			$scope.deleteBut = true;
			$scope.cancelBut = false;
		
			//Nous récupérons le todo concerné afin d'afficher les informations
			$scope.todo = Todos.getAnId({user: $scope.user, todoId: $scope.todoId}, 
							function(callbackdata){
								console.log("Todo récupéré :", callbackdata);
							
								//Remplissage du $scope
								$scope.todoTitle = callbackdata.title;
								$scope.todoDescription = callbackdata.description;

								$scope.deadlineBut = true;

								//Ajoute la ligne deadline si celle-ci est spécifiée
								if(callbackdata.deadline != null){
									$scope.thereIsADeadline = true;
									$scope.addOrEditTheDeadline = "Modifier la deadline";
								}
								
								else
									$scope.addOrEditTheDeadline = "Ajouter une deadline";

								//Permet de raccourcir le titre ci celui-ci est trop long pour la page
								if(callbackdata.title.length > 30)
									$scope.shortTitle = callbackdata.title.substring(0,27) + "...";
								else
									$scope.shortTitle = callbackdata.title;
							});

			break;
    }
	
	//Permet de passer du mode consultation au mode édition
	$scope.editATodo = function(){

		//Si la tâche est en cours, nous pouvons la modifier
		if($scope.todo.state == "En cours"){
			$scope.editing = true;

			//Récupération et configuration de la catégorie 
			switch($scope.todo.category){
				case "Autre" :
					$("#category-work").attr("class", "btn");
					$("#category-fun").attr("class", "btn");
					$("#category-other").attr("class", "btn btn-primary");
					$scope.category = "Autre";
				break;
				case "Loisir" :
					$("#category-work").attr("class", "btn");
					$("#category-fun").attr("class", "btn btn-primary");
					$("#category-other").attr("class", "btn");
					$scope.category = "Loisir";
				break;
				case "Travail" :
					$("#category-work").attr("class", "btn btn-primary");
					$("#category-fun").attr("class", "btn");
					$("#category-other").attr("class", "btn");
					$scope.category = "Travail";
				break;
			}
		}

		//Sinon nous affichons un message d'erreur
		else{
			$scope.alertType = "info";
			$scope.alertMsg = "Impossible de modifier une tâche effectuée.";
			$scope.alert = true;
		}
	};

	//Permet de supprimer un todo
	$scope.deleteATodo = function(){

		Todos.remove({todoId:$scope.todo.id}, function(){
				
			//Si le todo possède une deadline, on supprime le todo du calendrier natif
			if($scope.todo.deadline != null)
				removeFromNativeCalendar($scope.todo, true);
			
			//On redirige l'utilisateur
			$location.path('/todos/'+ $scope.user).search({state: 'encours'}).replace();
		});
	};

	//Permet de valider la création/modification d'un todo
	$scope.validate = function(){
	
		//Gère la modification du todo
		if($scope.todoId != "new"){
			
			//COnfiguration du todo via le $scope		
			$scope.todo.title = $scope.todoTitle;
			$scope.todo.description = $scope.todoDescription;
			$scope.todo.category = $scope.category;

			//En présence de deadline, on ajoute celle-ci dans le bon format
			if($scope.editDeadline)
				$scope.todo.deadline = deadlineToMilliseconds($scope.mytime);

			//Si le nouveau titre n'est pas null
			if($scope.todoTitle != ""){
				
				//On supprime le todo du calendrier
				removeFromNativeCalendar($scope.todo, false);

				//On sauvegarde les modifications sur le serveur
				Todos.update({todoId: $scope.todo.id}, $scope.todo, function(todo){
					
					$scope.alertType = "success";
					$scope.alertMsg = "Le todo a été modifié.";
					$scope.alert = true;
					$scope.editDeadline = false;
					
					//On ajoute le nouveau todo au calendrier
					addToNativeCalendar(todo, true);

					//On redirige l'utilisateur
					$location.path('/todos/'+ $scope.user).search({state: 'encours'}).replace();
				});
			}

			//Sinon on prévient que le titre est null
			else{
				$scope.alertMsg = "Veuillez saisir un titre.";
				$scope.alertType = "danger";
				$scope.alert = true;
			}
		}

		//Gérer la création d'un todo
		else{

			//On configure un todo via le $scope
			var todo = new Todos();
			todo.title = $scope.todoTitle;
			todo.description = $scope.todoDescription;
			todo.owner = $scope.user;
			todo.state = "En cours";
			todo.deadline= null;
			todo.category = $scope.category;

			//En présence de deadline, on l'ajoute au todo
			if($scope.editDeadline)
				todo.deadline = deadlineToMilliseconds($scope.mytime);
			
			//On enregistre le todo sur le serveur et sur le calendrier
			addATodo(todo);
		}
	};

	//Permet de transformer une date en milliseconde en chaine de caractère
	$scope.millisecondsToString = function(milliseconds){
		
		var date = new Date(parseInt(milliseconds));
		var month = date.getMonth()+1;
		var minute = date.getMinutes();
		var deadline = "";

		if(date.getDate() < 10)
			deadline = deadline + "0";

		deadline = deadline + date.getDate() + "/";

		if (month < 10)
			deadline = deadline + "0";

		deadline = deadline + month + "/" + (date.getFullYear()-2000) + " ";

		if(date.getHours() < 10)
			deadline = deadline + "0";

		deadline = deadline + date.getHours() + "h";
			
		if(date.getMinutes() < 10)
			deadline = deadline + "0";

		deadline = deadline + date.getMinutes();
		
		return deadline;
	};

	//Permet de supprimer un todo du calendrier en autorisant/interdisant les alertes
	function removeFromNativeCalendar(todo, allowAlert){

		var startDate = new Date();
        
  		var endDate = new Date(parseInt(todo.deadline));
  		
		window.plugins.calendar.deleteEvent(todo.title, "", todo.description, startDate, endDate,
		 	function(){
		 		if(allowAlert)
		 			alert(todo.title + ' a été supprimé du calendrier.');
		 	},
		 	function(){
		 		alert('No event deleted');
		});
	};

	//Permet d'ajouter un todo au calendrier en précisant s'il s'agit d'une modification ou d'une création
	function addToNativeCalendar(todo, isAnUpdate){

		var startDate = new Date();

  		var endDate = new Date(parseInt(todo.deadline));
  		
  		window.plugins.calendar.createEvent(todo.title, "", todo.description, startDate, endDate,
            function(){
            	var msg = "";
            	if(isAnUpdate)
            		msg = msg + " a été mis à jour sur le calendrier.";
            	else
            		msg = msg + " a été ajouté au calendrier.";
            	alert(todo.title + msg);
            }, 
            function (error) {
            	alert("Une erreur est survenue lors de l'ajout de la tâche au calendrier.");
        });
	};

	//Permet d'afficher la partie relative au réglage de la deadline
	$scope.editOrCreateDeadline = function(){

		$scope.deadlineBut = false;
		$scope.cancelBut = true;
		$scope.editDeadline = true;
	};

	//Permet d'effacer la partie relative à la deadline
	$scope.cancel = function(){

		$scope.cancelBut = false;
		$scope.editDeadline = false;
		$scope.deadlineBut = true;
	};

	//Permet de poster le todo envoyé en paramètre
	function addATodo(todo) {

		Todos.post(todo, 
			function(callbackdata){

				//Si la deadline existe, on ajoute au calendrier natif
				if(callbackdata.deadline!=null)
					addToNativeCalendar(callbackdata, false);

				//On modifie le membre en incrémentant son nombre de todos total
				Membre.get({membreId : $scope.user}, function(membre){
					
					console.log("Membre", membre);

					if(membre.totalTodos != null){
						membre.totalTodos = membre.totalTodos + 1;
					}

					Membre.update({membreId : $scope.user}, membre);
				
				})

				// On redirige l'utilisateur
				$location.path('/todos/'+ $scope.user).search({state: 'encours'}).replace();
			});
	};

	//Permet de transformer le temps saisi via le timepicker en milliseconds (stockées sur le serveur)
	function deadlineToMilliseconds(mytime){

		if($scope.myVar.data != null){

			var date = $scope.myVar.data;
			
			var da = new Date();
			da.setDate(date.getDate());
			da.setMonth(date.getMonth());
			da.setFullYear(date.getFullYear());
			da.setHours(mytime.getHours());
			da.setMinutes(mytime.getMinutes());
			da.setSeconds(0);
			da.setMilliseconds(0);

			var ms = da.getTime();
			
			return ms;
		}

		else
			return 0;
	};

	//Permet de régler la catégorie sur TRAVAIL
	$scope.work = function(){
		$("#category-work").attr("class", "btn btn-primary");
		$("#category-fun").attr("class", "btn");
		$("#category-other").attr("class", "btn");
		$scope.category = "Travail";
	};

	//Permet de régler la catégorie sur AUTRE
	$scope.other = function(){
		$("#category-work").attr("class", "btn");
		$("#category-fun").attr("class", "btn");
		$("#category-other").attr("class", "btn btn-primary");
		$scope.category = "Autre";
	};

	//Permet de régler la catégorie sur LOISIR
	$scope.fun = function(){
		$("#category-work").attr("class", "btn");
		$("#category-fun").attr("class", "btn btn-primary");
		$("#category-other").attr("class", "btn");
		$scope.category = "Loisir";
	};
}
]);