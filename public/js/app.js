var app = angular.module('ciAnalyticsApp', ['ui.router', 'ngCookies', 'socket-io', 'sharedApp', 'homeApp', 'dashboardApp', 'overviewApp', 'analyticsApp','visitorlistApp'])
	.config(function($stateProvider, $urlRouterProvider){

		$stateProvider
			.state('index', {
                url: '/index',
				templateUrl: 'modules/index/views/ci-analytics-index.html',
				title: 'CI Analytics - Index page'
			})
			.state('dashboard', {
				url: '/dashboard',
				templateUrl: 'modules/dashboard/views/dashboard-template.html',
                access: { requiredAuthentication: true }
			})
            .state('dashboard.overview', {
                url: '/overview',
                templateUrl: 'modules/overview/views/dashboard-overview.html',
                access: { requiredAuthentication: true }
            })
			.state('dashboard.analytics', {
				url: '/analytics',
				templateUrl: 'modules/analytics/views/analytics.html',
				title: 'CI Analytics - Analytics page',
                access: { requiredAuthentication: true }
			})
            .state('dashboard.visitorlist', {
                url: '/visitorlist',
                templateUrl: 'modules/visitorlist/views/visitorlist.html',
                title: 'CI Analytics - Analytics page',
                access: { requiredAuthentication: true }
            })            
			.state('dashboard.profile', {
				url: '/profile',
				templateUrl: 'modules/profile/views/profile.html',
				title: 'CI Analytics - profile page',
                access: { requiredAuthentication: true }			
			})
            .state('dashboard.help', {
                url: '/help',
                templateUrl: 'modules/help/views/help.html',
                title: 'CI Analytics - help page',
                access: { requiredAuthentication: true }            
            })

        $urlRouterProvider.otherwise('/index');
	});

// Adding extra headers info for every request
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

/*
 * On url changes we are verifying user is authenticated or not 
 * If user is authenticated we will send the request to the server 
 * Else we will redirect the user to the login page in this scenario it is INDEX page
 */
app.run(function($rootScope, $location, $window, $state, $timeout, AuthenticationService) {

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, nextRoute, currentRoute) {

        if($location.path() !== 'index'){

            $rootScope.overlayDeactive = true;
        }

        try{

            // Calling isLogin method on every url path changes
            $rootScope.isLogin();
        }
        catch(e){

            console.log("Error ocurred in Abort");
        }

        if(nextRoute != null){

        	//console.log("I am not authenticated nextRoute");
        	if(nextRoute.access!=null){

        		//console.log("I am not authenticated nextRoute.access");
        		if(!AuthenticationService.isAuthenticated){

        			//console.log("I am not authenticated isAuthenticated");
        			if(!$window.localStorage.token){

        				console.log("I am not authenticated token");
        				//$window.location.href = '#/index';
                        //$location.path('index');
                        $location.path(' ');
        			}
        			else{

        				$rootScope.username = $window.localStorage.username;
        			}
        		}
        	}
        }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
                
        $timeout(function(){
            
            $rootScope.overlayDeactive = false;
        }, 2000);             
    });

	// Setting highlited menu based on page url
	$rootScope.isSidebarActive = function(location){

		var loc = $window.location.href;
		if(loc.indexOf(location) > -1){
			return true;
		}
		else{
			return false;
		}
	};

	// Setting title of the page here
	// if(toState.title){

	// 	$rootScope.pageTitle = toState.title;
	// }    

	// Checking whether the user logged in or not on every request
    $rootScope.isLogin = function(){

        console.log($window.location.href);
        // Verifying that token is available in the localStorage or not If not we will redirect to INDEX page
        if($window.localStorage.username!==undefined && $window.localStorage.token!==undefined){

            /* 
            * If the user is authenticated but he/she tries open the index page 
            * Then user can't access the index page unless and untill if the user is logged out. 
            */
            if($window.location.href.indexOf('index') > -1){

                console.log("I am in safe mode");
                $location.path('dashboard');
                //$window.location.href = '#/home';
            }  
            else if($location.path() === '/dashboard'){

                console.log("I am in dashboard,......................");
                $location.path('/dashboard/overview');
                //$window.location.href = '#/dashboard/overview';
            }
            // else if($location.path() === '/dashboard' || $location.path() === '/dashboard/'){

            //     $location.path('dashboard.overview');
            // }
            console.log($window.localStorage.username);
        }
        else{

        	console.log("User is not logged in");
            // $window.location.href = '#/index';
            /*
            * User logged in but, somebody deleted token from the localStorage
            * Then again we will redirect the user to the INDEX page
            * Ex:- analayticsdashboard.com/#/home/overview (Deleted localStorage)
            * then user will automatically redirect to analyticsdashboard.com/#/index
            */
            $location.path('index');
        }
    };
});	

app.factory('AuthenticationService', function() {

    /*
    * On every request actually we are verifying boolean variable isAuthenticated, 
    * If the value is true, user is logged in 
    * Else user logged out
    */
    var auth = {
        isAuthenticated: false
    }
    return auth;
});

/*
* This places a crucial role in this interceptors concept
* It contains 4 methods for request and response
* Request: Will add extra information to the request headers, while sending the request to the server
* Response: Will check server responded with STATUS code 200, i.e, 'OK'
* If any error occurs while request/response it will simply reject the corresponding request/response
*/
app.factory('TokenInterceptor', ['$q', '$window', '$location', 'AuthenticationService', function ($q, $window, $location, AuthenticationService) {

    return {
        request: function (config) {

            config.headers = config.headers || {};
            /*
            * Here adding Authorization property to the request headers.
            * Based on this property we can verify in the server side code, Whether the token is available in the 
            * localStorage, If not then we will delete the USER session storage in the server.
            */
            if ($window.localStorage.token) {
                config.headers.Authorization = $window.localStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {

            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {

            if (response != null && response.status == 200 && $window.localStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {

            if (rejection != null && rejection.status === 401 && ($window.localStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.localStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("index");
            }

            return $q.reject(rejection);
        }
    };
}]);
	