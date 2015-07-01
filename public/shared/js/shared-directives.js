angular.module('sharedApp')
	.directive('dashboardHeader', function(){

		return {
			restrict: 'AEC',
			replace: 'true',
			templateUrl: '../shared/views/dashboard-header-template.html'
		}
	})
	.directive('dashboardSidebar', function(){

		return {
			restrict: 'AEC',
			replace: true,
			templateUrl: '../shared/views/dashboard-sidenavbar-template.html'
		}
	})
	.directive('dashboardBreadcumb', function(){

		return {
			restrict: 'AEC',
			replace: true,
			scope: {},
			link: function($scope, elem, attrs){
				$scope.breadcumb = attrs.breadcumb;
			},
			templateUrl: '../shared/views/dashboard-breadcumb.html'
		}
	})
	.directive('dashboardTitle', function(){

		return {
			restrict: 'AEC',
			replace: true,
			link: function($scope, elem, attrs){
				$scope.myTitle = attrs.mytitle;
			},
			templateUrl: '../shared/views/dashboard-title.html'
		}
	})
	.directive('dashboardFooter', function(){

		return {
			restrict: 'AEC',
			replace: 'true',
			templateUrl: '../shared/views/dashboard-footer.html'
		}
	})
	.directive('dangerAlert', function(){

		return {
			restrict: 'AEC',
			replace: true,
			link: function($scope, elem, attrs){
				$scope.alertMessage = attrs.message;
				$scope.classes = attrs.classes;
			},
			templateUrl: '../shared/views/custom-alerts.html'
		}
	})
	.directive('toggleMenuDirective', function(){

		return {
			restrict: 'AEC',
			link: function($scope, elem, attrs){

				angular.element(elem).on('click', function(e){

					//alert("Toggle Clicked,...");
					var sidebar = $('#sideToggle');
					angular.element(sidebar).toggleClass('sidebarShow');
					var bodyContent = $('#bodyContent');
					angular.element(bodyContent).toggleClass('bodyContent');
					var footer = $('#footer');
					angular.element(footer).toggleClass('footerContent');

				});
			}
		}
	})
	.directive('mobileMenuDirective', function(){

		return {
			restrict: 'AEC',
			link: function($scope, elem, attrs){

				var counter = 0;
				angular.element(elem).on('click', function(e){

					counter++;					
					if(counter % 2 == 1){

						//alert("Toggle Clicked,...");
						var sidebar = $('#sideToggle');
						angular.element(sidebar).css('left', '0');
						var bodyContent = $('#bodyContent');
						angular.element(bodyContent).css('margin-left', '194px');
						var footer = $('#footer');
						angular.element(footer).css('margin-left', '194px');	
						var siteBrand = $('#siteBrand');
						angular.element(siteBrand).css('left', '0');
						var fixedTopMenu = $('#fixedTopMenu');
						angular.element(fixedTopMenu).css('left', 0);
					}
					else{

						//alert("Toggle Clicked,...");
						var sidebar = $('#sideToggle');
						angular.element(sidebar).css('left', '-194px');
						var bodyContent = $('#bodyContent');
						angular.element(bodyContent).css('margin-left', '0px');
						var footer = $('#footer');
						angular.element(footer).css('margin-left', '0px');		
						var siteBrand = $('#siteBrand');
						angular.element(siteBrand).css('left', '-194px');			
						var fixedTopMenu = $('#fixedTopMenu');
						angular.element(fixedTopMenu).css('left', '-194px');													
					}
				});
			}
		}
	});	