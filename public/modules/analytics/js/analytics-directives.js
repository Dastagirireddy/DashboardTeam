var app = angular.module('analyticsApp');

// app.directive('analyticsGrid', function(socket, LiveVisitorService){
// 	return{
// 			restrict: 'AEC',
// 			replace: true,
// 			scope: {
// 				// live:'='
// 			},
// 			transclude: true,
// 			link: function($scope, element, attributes){

// 				$scope.gcolor = attributes.gcolor;
// 				$scope.gicon = attributes.gicon;
// 				$scope.text = attributes.text;
// 				$scope.live = '';
// 				socket.on('clients', function(data){

// 					console.log("I received data from the clietns database ");
// 					console.log(data);
// 					$scope.live = LiveVisitorService.getLiveVisitors(data.live);
// 					console.log($scope.live);
// 					console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<");
// 				});

// 			},
// 			templateUrl:'../modules/analytics/views/analytics-grids.html'
// 		}

// });
app.directive('lineGraphDirective', function(){

	return{
			restrict: 'AEC',
			replace: true,
			link: function(scope, element, attributes){

			},
			templateUrl:'../modules/analytics/views/linegraph.html'
		}
});
app.directive('tablePanelDirective', function(){

	return{
			restrict: 'AEC',
			replace: true,
            // scope:{
            // 	browsers: '&browsers'
            // },
			link: function(scope, element, attributes){
			
			},
			templateUrl:'../modules/analytics/views/analytics-table-panel.html'
		}
});
app.directive('loadingOverlayDirective', function(){
	return{
			restrict: 'AEC',
			replace: true,
            
			link: function(scope, element, attributes){

				
			},
			templateUrl:'../modules/analytics/views/overlay.html'
		}

});
app.directive('pieChartDirective', function(){
	return{
			restrict: 'AEC',
			replace: true,
			link: function(scope, element, attributes){
				
			},
			templateUrl:'../modules/analytics/views/piechart.html'
		}
});


