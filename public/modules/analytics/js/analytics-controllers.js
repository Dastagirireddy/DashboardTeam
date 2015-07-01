angular.module('analyticsApp')
	.controller('SocketDataController', ['$scope', 'socket', '$window', 'LiveVisitorService', 'UsersCountService', 'DateFormatService', 'ProfitAndLossService', 'ClientDetailsFactory', function($scope, socket, $window, LiveVisitorService, UsersCountService, DateFormatService, ProfitAndLossService, ClientDetailsFactory){

		console.log("I am in SocketDataController");
		var socket = io.connect('http://localhost:3000');
		$scope.live = "0";
		socket.on('message', function(data){
			console.log("I have socket data with me, please display it,...");
			$scope.$apply(function(){

				console.log(data);				
			});
		});
		socket.on('socketId', function(data){
			console.log(data);
		});
		socket.on('clients', function(data){

			console.log("I received data from the clietns database ");
			$scope.$apply(function(){
				socketClientData(data);
			});
			console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<");
		});

		// ID 
		var id = $window.localStorage.token;
		var mySocketData = ClientDetailsFactory.getSocketClientsData(id).then(function(data){

			socketClientData(data);
		}, function(error){
			console.log(error);
		});
		var socketClientData = function(data){

			console.log("I received data from the clietns database ");
			//console.log(data);
			// $scope.$apply(function(){

				// Collecting live visitors
				$scope.live = LiveVisitorService.getLiveVisitors(data.live);
				//console.log($scope.live);

				// Calculating returning and new visitors of today and previous day
				var date = new Date();
				var str1 = parseInt(date.getDate(), 10) - 2;
				var str2 = parseInt(date.getDate(), 10);
				var month1 = parseInt(date.getMonth(), 10) + 1;

				if(month1 < 10){
					month1 = '0' + month1;
				}

				var previousDate = date.getFullYear() +'-'+month1+'-'+str1;
				var todayDate = date.getFullYear() + '-' + month1 + '-' + str2;

				// previous date visitor count
				var clientsPrevious = [];
				// Todays date visitor count
				var clientsToday = [];

				// Pages counter
				var todayPages = 0;
				var previousPages = 0;

				for(var i=0;i<data.clients.length;i++){

					var client = data.clients[i]['created_at'];
					//console.log(client);
					var d1 = new Date(client);
					var d2 = d1.getFullYear() +'-'+month1+'-'+d1.getDate();

					// Previous date store
					if(Date.parse(d2) < Date.parse(todayDate) && Date.parse(d2) > Date.parse(previousDate)) {

						clientsPrevious.push(data.clients[i]);
						var pagecount = data.clients[i]['pages'].length;
						previousPages += pagecount;
					}

					// Todays date store
					if(Date.parse(client) >= Date.parse(todayDate)){

						clientsToday.push(data.clients[i]);
						var pagecount = data.clients[i]['pages'].length;
						todayPages += pagecount;					
					}
				}
				console.log("@@@@@@@@@@@");
				console.log(todayPages);

				// Today and previous date page views counter
				$scope.todayPages = todayPages;
				$scope.previousPages = previousPages;

				console.log(clientsToday);

				// Previous date conter service calling
				var previousVisitorCount = UsersCountService.getUserCount(clientsPrevious);
				$scope.previousVisitorCount = previousVisitorCount;
				console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^");
				console.log(previousVisitorCount);

				// Today date counter service calling
				var visitorCount = UsersCountService.getUserCount(clientsToday);
				console.log(visitorCount);
				$scope.visitorCount = visitorCount;

				// Percentage calculation of Pageviews
				var pagePerc = ProfitAndLossService.getPercentageCalc(previousPages, todayPages);
				$scope.pagePerc = pagePerc;

				// Percentage calculation of Returning visitors
				var returningPerc = ProfitAndLossService.getPercentageCalc($scope.previousVisitorCount.oldcount, $scope.visitorCount.oldcount);
				$scope.returningPerc = returningPerc;

				// Percentage calculation of New Visitors
				var newPerc = ProfitAndLossService.getPercentageCalc($scope.previousVisitorCount.newcount, $scope.visitorCount.newcount);
				$scope.newPerc = newPerc;

				// Percentage calculation of live visitors
				var oldLive = $scope.previousVisitorCount.oldcount + $scope.previousVisitorCount.newcount;
				var livePerc = ProfitAndLossService.getPercentageCalc(oldLive, $scope.live); 
				$scope.livePerc = livePerc;
			// });
		};
		socket.emit('send', "I am regisetered user");
	}])
	.controller('ClientDetailsController', ['$scope', '$window', '$timeout', 'ClientDetailsFactory','DateFormatService', 'PageviewsService', 'UsersCountService', function($scope, $window, $timeout, ClientDetailsFactory,DateFormatService, PageviewsService, UsersCountService){

		//console.log('I am in Analytics controller');
		var id = $window.localStorage.token;
		$scope.isOverlay = false;
		$scope.pageViewsLength = false;

		var getClientsInfo = function(isClicked){

			var newPages = {};
			var oldPages = {};
			var myPages = [];
			ClientDetailsFactory.getClientDetails(id).then(function(data){

				//console.log("I am ClientDetailsController data");
				var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				for(var i=0;i<data.clients.length;i++){

					var id = DateFormatService.formatDate(data.clients[i]['created_at']);
					var pagecount = data.clients[i]['pages'].length;

					if(!oldPages.hasOwnProperty(id)){

						oldPages[id] = pagecount;
					}
					else{

						oldPages[id] += pagecount;
					}
				}

				// Visitors count 
				var visitorCount = UsersCountService.getUserCount(data.clients);
				$scope.visitor = visitorCount;
				//console.log('old pages count');
				//console.log(oldPages);
				/*linegraph*/
				var myPages = [];
				for(var i in oldPages){
					
					myPages.push(oldPages[i]);
				}

				//console.log(myPages);
				$scope.pageviews = PageviewsService.getPageViewSum(myPages);
				//console.log(myPages);
				if(myPages.length > 0){
					$scope.pageViewsLength = true;
				}
				var lineChartData = {
					labels : Object.keys(oldPages),
					datasets : [
						{
							label: "My Second dataset",
							fillColor : "rgba(121,206,167,0.2)",
							strokeColor : "#65cea7",
							pointColor : "#65cea7",
							pointStrokeColor : "#65cea7",
							pointHighlightFill : "#fff",
							pointHighlightStroke : "rgba(151,187,205,1)",
							data : myPages
						}
					]
				};

				var ctx = document.getElementById("canvas").getContext("2d");
				window.myLine = new Chart(ctx).Line(lineChartData, {
					responsive: true
				});
			
				if(isClicked === true){

					$timeout(function(){
						$scope.isOverlay = false;
					}, 2000);
				}				

			}, function(error){
				console.log(error);
			});			
		};
		getClientsInfo();

		$scope.getClientsList = function(){

			$scope.isOverlay = true;
			getClientsInfo(true);
		};				
	}])	
	.controller('VisitorDetailsController', ['$scope', '$window', '$timeout', 'ClientDetailsFactory', 'UsersCountService', function($scope, $window, $timeout, ClientDetailsFactory, UsersCountService){

		//console.log('I am in Analytics controller');
		var id = $window.localStorage.token;
		$scope.isOverlay = false;

		var getVisitorsInfo = function(isClicked){

			ClientDetailsFactory.getClientDetails(id).then(function(data){

				if(isClicked === true){

					$timeout(function(){
						$scope.isOverlay = false;
					}, 2000);
				}	

				var visitorCount = UsersCountService.getUserCount(data.clients);
				$scope.visitor = visitorCount;

				Morris.Donut({
		  		element: 'donut',
		 		
				 data: [
		    			{label: "New Visitors", value: visitorCount.newcount},
			
		    			{label: "Returning Visitors", value: visitorCount.oldcount}
		 		 	],

		 			colors: ['#65CEA7' ,'#FC8675']
				});	

			}, function(error){
				console.log(error);
			});			
		};
		getVisitorsInfo();

		$scope.getVisitorsList = function(){

			$scope.isOverlay = true;
			getVisitorsInfo(true);
		};				
	}])
	.controller('BrowserDetailsController', ['$scope', '$window', '$timeout', 'ClientDetailsFactory', 'AnalyticsService', function($scope, $window, $timeout, ClientDetailsFactory, AnalyticsService){

		var id = $window.localStorage.token;
		$scope.isOverlay = false;
		$scope.browserLength = false;
		var getBrowsers = function(isClicked){
			
			//console.log(isClicked);
			ClientDetailsFactory.getBrowserDetails(id).then(function(data){

				if(data.status == 200){

					if(isClicked === true){

						$timeout(function(){
							$scope.isOverlay = false;
						}, 2000);
					}
					//console.log("I received browsers information from the mongodb database.....");
					//console.log(data.browsers);
					$scope.browsers = data.browsers;
					if($scope.browsers.length != 0){
						$scope.browserLength = true;
					}
					//console.log($scope.browsers);
					/*...................*/
					$scope.browserslist = {};

					var len=$scope.browsers.length;
					for(var i=0;i<len;i++){

						//console.log($scope.browsers[i]["name"]);
						if($scope.browserslist.hasOwnProperty($scope.browsers[i]["name"])){

							$scope.browserslist[$scope.browsers[i]["name"]] += 1;
						}
						else{
							$scope.browserslist[$scope.browsers[i]["name"]] = 1;
						}
						
					};
					
					$scope.pcount={};
					angular.forEach($scope.browserslist, function(value, key) {
						var c=(value/len)*100;
						$scope.pcount[key] = Math.round(c);
					});
					$scope.changeBgPanel = function(y){
						
						return AnalyticsService.changeProgressBar(y);
					};
				}
				else{
					console.log("Some error occurred, please try again");
				}
			}, function(error){
				console.log("Error occurred while requesting,...");
			});			
		};
		getBrowsers();

		$scope.getBrowsersList = function(){

			$scope.isOverlay = true;
			getBrowsers(true);
		};
	}])
	.controller('PlatformDetailsController', ['$scope', '$window', '$timeout', 'ClientDetailsFactory', 'AnalyticsService', function($scope, $window, $timeout, ClientDetailsFactory, AnalyticsService){

		var id = $window.localStorage.token;
		$scope.isOverlay = false;
		$scope.platformLength = false;
		var getPlatforms = function(isClicked){

			ClientDetailsFactory.getPlatformDetails(id).then(function(data){

				if(data.status == 200){
					
					if(isClicked === true){

						$timeout(function(){
							$scope.isOverlay = false;
						}, 2000);
					}				
					//console.log(data.platforms);
					$scope.platforms=data.platforms;
					if($scope.platforms.length != 0){
						
						$scope.platformLength = true;
					}					
					$scope.platformlist = {};

					var len=$scope.platforms.length;
					for(var i=0;i<len;i++){

						//console.log($scope.platforms[i]["name"]);
						if($scope.platformlist.hasOwnProperty($scope.platforms[i]["name"])){

							$scope.platformlist[$scope.platforms[i]["name"]] += 1;
						}
						else{
							$scope.platformlist[$scope.platforms[i]["name"]] = 1;
						}
						
					};
					//console.log($scope.platformlist);
					$scope.pcount={};
					angular.forEach($scope.platformlist, function(value, key) {
						var c=(value/len)*100;
						$scope.pcount[key] = Math.round(c);
					});
					$scope.changeBgPanel = function(y){
						
						return AnalyticsService.changeProgressBar(y);
					};
				}
				else{
					console.log("Some error occurred, please try again");
				}
			}, function(error){
				console.log("Error occurred while requesting,...");
			});
		};
		getPlatforms();
		$scope.getPlatformsList = function(){
			$scope.isOverlay = true;
			getPlatforms(true);
		};
	}])
	.controller('LocationDetailsController', ['$scope', '$window', '$timeout', 'ClientDetailsFactory', 'AnalyticsService', function($scope, $window, $timeout, ClientDetailsFactory, AnalyticsService){

		var id = $window.localStorage.token;
		$scope.isOverlay = false;
		$scope.locationLengths = false;
		var getLocations = function(isClicked){

			ClientDetailsFactory.getLocationDetails(id).then(function(data){

				if(data.status == 200){
					
					if(isClicked === true){

						$timeout(function(){
							$scope.isOverlay = false;
						}, 2000);
					}					
					//console.log(data.locations);
					$scope.locations=data.locations;
					if($scope.locations.length != 0){
						$scope.locationLengths = true;
					}					
					$scope.locationslist={};
					var len=$scope.locations.length;
					for(var i=0;i<len;i++){

						//console.log($scope.locations[i]["name"]);
						if($scope.locationslist.hasOwnProperty($scope.locations[i]["name"])){

							$scope.locationslist[$scope.locations[i]["name"]] += 1;
						}
						else{
							$scope.locationslist[$scope.locations[i]["name"]] = 1;
						}
						
					};
					//console.log($scope.locationslist);
					$scope.pcount = {};
					angular.forEach($scope.locationslist, function(value, key) {
						
						var c = (value/len)*100;
						$scope.pcount[key] = Math.round(c);
					});
					$scope.changeBgPanel = function(y){
						
						return AnalyticsService.changeProgressBar(y);
					};
				}
				else{
					console.log("Some error occurred, please try again");
				}
			}, function(error){
				console.log("Error occurred while requesting,...");
			});
		};
		$scope.getLocationsList = function(){
			$scope.isOverlay = true;
			getLocations(true);
		}
		getLocations();
	}]);