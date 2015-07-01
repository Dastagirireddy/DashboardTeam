angular.module('dashboardApp')
	.controller('DashboardController', ['$scope', '$window', '$location', 'LogoutFactory', function($scope, $window, $location, LogoutFactory){

		console.log("I am in DashboardController");
		$scope.username = $window.localStorage.username;

		$scope.logoutConfirmValue = false;

		$scope.logoutConfirm = function(){
			$scope.logoutConfirmValue = true;
		};

		$scope.logoutCancel = function(){
			$scope.logoutConfirmValue = false;
		};

		// Logout Action
		$scope.logout = function(){

			LogoutFactory.logout().then(function(data){
				if(data.status == 200){
					
					$window.localStorage.removeItem('token');
					$window.localStorage.removeItem('username');
					$location.path('index');
				}
				else{
					console.log("Logout failed, please try again");
				}
			}, function(error){
				console.log("Error occured");
			});
		};
	}]);