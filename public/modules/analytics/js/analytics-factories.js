angular.module('analyticsApp')
	.factory('ClientDetailsFactory', ['$http', '$q', function($http, $q){

		var factory = {};
		factory.getClientDetails = function(id){

			return $http.get('/getClientDetails/'+id).then(function(response){
				
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
		factory.getBrowserDetails = function(id){

			return $http.get('/getBrowserDetails/' + id).then(function(response){

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
		factory.getPlatformDetails = function(id){

			return $http.get('/getPlatformDetails/' + id).then(function(response){

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
		factory.getLocationDetails = function(id){

			return $http.get('/getLocationDetails/' + id).then(function(response){

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
		factory.getSocketClientsData = function(id){

			return $http.get('/getSocketClientsData/'+ id).then(function(response){

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