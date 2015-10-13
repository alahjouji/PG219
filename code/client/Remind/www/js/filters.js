angular.module('remindFilters', []).filter('state', function() {
  return function(input) {
    if(input == "En cours")
    	return "pull-left checking-btn";
    else
    	return "pull-left checking-btn icon icon-check";
  };
});
