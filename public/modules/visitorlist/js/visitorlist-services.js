angular.module('visitorlistApp')
	.service('VisitorListService', function(){

		this.getParsedLiveVisitor = function(data){

			var myLiveData = [];
			var clientsLength = data.clients.length;
			for(var i=0;i<clientsLength;i++){

				myLiveData.push(data.clients[i]);
				var browserLength = data.browsers.length;
				for(var j=0;j<browserLength;j++){

					if(Date.parse(myLiveData[i]["created_at"]) <= Date.parse(data.browsers[j]["time"]) && myLiveData[i]["roomName"] === data.browsers[j]["roomName"]){

						var browsers = {};
						browsers.name = data.browsers[j]["name"];
						browsers.version = data.browsers[j]["version"];
						myLiveData[i]["browser"] = browsers;

					}
					if(Date.parse(myLiveData[i]["created_at"]) <= Date.parse(data.locations[j]["time"]) && myLiveData[i]["roomName"] === data.locations[j]["roomName"]){

						var locations = {};
						locations.city = data.locations[j]["city"];
						locations.state = data.locations[j]["state"];
						locations.country = data.locations[j]["country"];
						myLiveData[i]["location"] = locations;

					}
					if(Date.parse(myLiveData[i]["created_at"]) <= Date.parse(data.platforms[j]["time"]) && myLiveData[i]["roomName"] === data.platforms[j]["roomName"]){

						var platforms = {};
						platforms.isDesktop = data.platforms[j]["isDesktop"];
						platforms.isMobile = data.platforms[j]["isMobile"];
						platforms.name = data.platforms[j]["name"];
						platforms.os = data.platforms[j]["os"];
						myLiveData[i]["platform"] = platforms;
					}
				}
			}
			return myLiveData;
		};
	});
