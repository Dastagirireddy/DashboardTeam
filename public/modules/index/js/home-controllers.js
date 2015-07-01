angular.module('homeApp')
	.controller('AboutController', ['$scope', '$anchorScroll', '$location', function($scope, $anchorScroll, $location){

		console.log("I am in AboutController");
		$scope.gotoBottom = function(){

			// set the location.hash to the id of
			// the element you wish to scroll to.
			$location.hash('bottom');

			// call $anchorScroll()
			$anchorScroll();			
		};
	}])
	.controller('LoginController', function($scope, $rootScope, $window, $location, $cookieStore, AccountFactory){
		console.log("I am in LoginController");
		// Declaring scope object properties here
		$scope.user = {
			email: '',
			password: ''
		};

		$scope.isAlertDanger = false;

		// User click login function
		$scope.login = function(){
			console.log($scope.user);
			AccountFactory.login($scope.user).then(function(data){
				console.log(data);	
				if(data.status == 200){
					$window.localStorage.token = data.user._id;
					$window.localStorage.username = data.user.username;
					$location.path('dashboard');
				}
				else{
					$scope.user = '';
					$scope.isAlertDanger = true;
				}
			}, function(error){
				console.log(error);
			});
		};

		$scope.closeDangerAlert = function(){

			$scope.isAlertDanger = !$scope.isAlertDanger;
		};
	})
	.controller('RegisterController', ['$scope', '$window', '$location', 'AccountFactory', function($scope, $window, $location, AccountFactory){

		// Declaring scope object properties here 
		$scope.user = {
			email: '',
			username: '',
			password: '',
			web: '',
			phone: ''
		};

		$scope.alert = {
			isAlertDanger: false,
			isAlertSuccess: false
		};

		// User click signup function
		$scope.signup = function(){
			console.log($scope.user);
			AccountFactory.register($scope.user).then(function(data){
				console.log(data);
				if(data.status == 200){
					$scope.user = '';
					$scope.alert.isAlertSuccess = true;
				}
				else{
					$scope.alert.isAlertDanger = true;
				}
			}, function(error){
				console.log(error);
			});
		};

		$scope.closeDangerAlert = function(){
			$scope.isAlertDanger = false;
			$scope.isAlertSuccess = false;			
		};

	}]);