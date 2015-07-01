angular.module('dashboardApp')
	.factory('LogoutFactory', function($http){
		var factory = {};
		factory.logout = function(){
			return $http.get('/logout').then(function(response){
				if(typeof response.data === 'object'){
					return response.data;
				}
				else{
					return $q.reject(response.data);
				}
			}, function(response){
				return $q.reject(response.data);
			});
		};
		return factory;
	});