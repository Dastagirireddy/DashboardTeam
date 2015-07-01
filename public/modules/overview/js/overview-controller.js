angular.module('overviewApp')
	.controller('OverviewController', ['$scope', '$cookieStore', 'UserDetailsFactory', function($scope, $cookieStore, UserDetailsFactory){
		console.log("I am in OverviewController");
		$scope.overview = {};
		UserDetailsFactory.getUserDetails().then(function(data){

			if(data.status == 200){

				$scope.overview.webId = data.overview;
				$scope.overview.host = data.host;
			}
			else{
				console.log("Requesting got exception raised");
			}
		}, function(error){

			console.log("Requesting got exception raised");
		});
	}]);