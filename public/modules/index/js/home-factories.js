angular.module('homeApp')
	.factory('AccountFactory', ['$http', '$q', function($http, $q){
		var factory = {};
		factory.register = function(user){

			return $http.post('/register', user).then(function(response){
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
		factory.login = function(user){

			return $http.post('/login', user).then(function(response){
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
	}]);