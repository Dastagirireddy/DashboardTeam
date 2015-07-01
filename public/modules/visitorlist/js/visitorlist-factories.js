angular.module('visitorlistApp')
 	.factory('VisitorListFactory', ['$http', '$q', function($http, $q){

     var factory = {};
     factory.getVisitorList = function(id){

        return $http.get('/getLiveVisitorList/'+id).then(function(response){

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
