angular.module('overviewApp')
	.controller('OverviewController', ['$scope', '$cookieStore', '$window', '$location', 'UserDetailsFactory', function($scope, $cookieStore, $window, $location, UserDetailsFactory){
		console.log("I am in OverviewController");
		$scope.overview = {};
		UserDetailsFactory.getUserDetails().then(function(data){

			if(data.status == 200){

				$scope.overview.webId = data.overview;
				$scope.overview.host = data.host;
			}
			else if(data.status == 403){

				$window.localStorage.removeItem('token');
				$window.localStorage.removeItem('username');
				$location.path('index');
			}
			else{
				console.log("Requesting got exception raised");
			}
		}, function(error){

			console.log("Requesting got exception raised");
		});
	}]);