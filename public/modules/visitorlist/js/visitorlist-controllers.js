angular.module('visitorlistApp')
	.controller('LiveVisitorController', ['$scope', 'socket', '$window', 'VisitorListService', 'VisitorListFactory', function($scope, socket, $window, VisitorListService, VisitorListFactory){

		console.log("I am in LiveVisitorController");
		var socket = io.connect("http://localhost:3000");
		socket.emit('live', "I admin of this page");
		var id = $window.localStorage.token;
		VisitorListFactory.getVisitorList(id).then(function(data){

			var liveVisitor = VisitorListService.getParsedLiveVisitor(data);
			$scope.liveVisitor = liveVisitor;
		}, function(error){

			console.log("Error occurred");
		});

		socket.on('liveList', function(data){

			$scope.$apply(function(){

				$scope.live = data;
				var liveVisitor = VisitorListService.getParsedLiveVisitor($scope.live);
				console.log("Live visitor parsed data,.....");
				console.log(liveVisitor);
				$scope.liveVisitor = liveVisitor;
				console.log($scope.live);
			});
		});

		/* icons position*/
		$scope.browsers = {

			"chrome": {
			"background-position":"-2px -18px"
			},
			"explorer": {
			"background-position":"-66px -18px"
			},
			"mozilla": {
			"background-position":"-18px -20px"
			}
		};
		$scope.operatings = {

			"windows": {

			"background-position":"-1px -18px"

			},
			"android": {

			"background-position":"-69px -18px"

			},
			"apple": {

			"background-position":"-19px -17px"

			}
		};

		$scope.locations = {
			"India": {
			"background-position":"-150px -93px"
			}
		};

		$scope.getBrowser = function(b){

			return $scope.browsers[b];
		};
		$scope.getOs = function(o){

			return $scope.operatings[o];
		};
		$scope.getFlag = function(l){

			return $scope.locations[l];
		};
		$scope.showDetails = function(deatils){

				$scope.visitorPages = deatils.pages;
				$scope.visitorId = deatils.socketId;
		};
		$scope.message = '';
		$scope.sendMessage = function(id){

		 	var obj = {};
			obj.message = $scope.message;
			obj.socketId = id;
			console.log(obj);
			socket.emit('adminMsg', obj);

			$scope.message = '';
		};
		
		socket.on('messages', function(data){
			console.log(data);
			//alert(data);
			$scope.$apply(function(){
				$scope.messages = data;
				//alert($scope.messages);
			});
		});		

		// $scope.$apply(function(){
		// 	socket.on('messages', func);
		// });

	}]);
