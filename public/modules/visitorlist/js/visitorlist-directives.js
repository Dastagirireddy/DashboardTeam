angular.module('visitorlistApp')
	.directive('enterSubmit', function(){
		
		return {
			restrict: 'AEC',
			link: function($scope, elem, attrs){

				angular.element(elem).on('keyup', function(e){

					console.log("I am in Enter to Submit directive");
					var e = e || event;
					console.log($scope.message);
					if(e.keyCode == 13 && $scope.message.length != 0){

						console.log($scope.message);
						$scope.sendMessage($scope.visitorId);
					}
				});
			}
		}
	});