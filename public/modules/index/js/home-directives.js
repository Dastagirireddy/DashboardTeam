angular.module('homeApp')
	.directive('loginModal', function(){
		return {
			restrict: 'A',
			link: function($scope, elem, attrs){
				angular.element(elem).on('click', function(){
					var id = document.getElementById('loginModal');
					angular.element(id).toggleClass('modal-display');
				});
			}
		}
	})
	.directive('accountTab', function(){
		return {
			restrict: 'A',
			link: function($scope, elem, attrs){
				var loginToggle = document.getElementById('login-toggle');
				var signupToggle = document.getElementById('signup-toggle');
				var login = document.getElementById('login');
				var signup = document.getElementById('signup');

				angular.element(login).addClass('modal-display');
				angular.element(loginToggle).addClass('active');

				angular.element(elem).on('click', function(){

					if('login-toggle' === elem.attr('id')){
						angular.element(signup).removeClass('modal-display');
						angular.element(login).addClass('modal-display');
						angular.element(signupToggle).removeClass('active');
						angular.element(loginToggle).addClass('active');
					}
					else{
						angular.element(signup).addClass('modal-display');
						angular.element(login).removeClass('modal-display');
						angular.element(signupToggle).addClass('active');
						angular.element(loginToggle).removeClass('active');						
					}
				})
			}
		}
	})
	.directive('inputDirective', function(){
		return {

			restrict: 'AEC',
			replace: true,
			scope: {
				model: '=model',
			},
			link: function(scope, element, attributes){
					scope.inputs = {};
					scope.inputs.label = attributes.label;
					scope.inputs.id = attributes.id;
					scope.inputs.placeholder = attributes.placeholder;
					scope.inputs.type = attributes.type;					
			},									
			template:'<div class="form-group">'+
                    '<label for="{{inputs.id}}">{{inputs.label}}</label>'+ 
                    '<input class="form-control cts-input " id="{{inputs.id}}" type="{{inputs.type}}" name="{{inputs.id}}" placeholder="{{inputs.placeholder}}" data-mymodel={{inputs.model}}  data-ng-model="model" required />'+
                  	'</div>'
		};
	})	
	.directive('banner',function(){
		return{
			restrict: 'AEC',
			replace: true,
			link: function(scope, element, attributes){
			},
			templateUrl:'../modules/index/views/banner.html'
		}
	})
	.directive('indexHeader',function(){
		return{
			restrict: 'AEC',
			replace: true,
			link: function(scope, element, attributes){
			},
			templateUrl:'../modules/index/views/mainheader.html'
		}
	});