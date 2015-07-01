angular.module('analyticsApp')
	.service('AnalyticsService', function(){

		this.changeProgressBar = function(y){

			var bgcolors = {
				success: 'progress-bar-success',
				warning: 'progress-bar-warning',
				danger: 'progress-bar-danger',
				info: 'progress-bar-info'
			};

			if(y > 80){

				return bgcolors.success;
			}
			else if(y < 80 && y > 60){

				return bgcolors.info;
			}
			else if( y < 60 && y > 40){

				return bgcolors.warning;
			}
			else{

				return bgcolors.danger;
			}
		};
	})
	.service('DateFormatService',function(){

		this.formatDate = function(date){

			var date = new Date(date);
			var str=date.getFullYear()+'-'+ date.getMonth() +'-'+ date.getDate();
			return str;
		}
	})
	.service('PageviewsService', function(){

		this.getPageViewSum = function(arr){

			var result = 0;
			for(var i = 0 ;i<arr.length; i++){

				result += arr[i];
			}
			return result;
		};
	})
	.service('UsersCountService', function(){

		this.getUserCount = function(data){

			var	len = data.length,
				oldUsers = {},
				newUsers = {};

			for(var i=0;i<len;i++){

				var id = data[i]["socketId"];
				
				if(!(oldUsers.hasOwnProperty(id) || newUsers.hasOwnProperty(id))){

					newUsers[id] = 1;
				}
				else if(newUsers.hasOwnProperty(id) && !oldUsers.hasOwnProperty(id)){

					oldUsers[id] = newUsers[id] + 1;
					delete newUsers[id];
				}
				else if(!newUsers.hasOwnProperty(id) && oldUsers.hasOwnProperty(id)){

					oldUsers[id] += 1;
				}
			}
			var users = {};
		    users.newcount = Object.keys(newUsers).length;
			users.oldcount = Object.keys(oldUsers).length;	
			return users;		
		}
	})
	.service('LiveVisitorService', function(){

		this.getLiveVisitors = function(live){

			var count = live[0]["people"].length;
			console.log(count);
			return count;
		};
	})
	.service('ProfitAndLossService', function(){

		this.getPercentageCalc = function(oldValue, newValue){

			var factor = newValue - oldValue;
			var pagePerc = {};
			if(oldValue == 0){

				oldValue = newValue;
			}
			else {

				oldValue = newValue = 1;
				factor = 1;
			}
			if(factor >= 0){

				var perc = (factor/oldValue) * 100;
				pagePerc.icon = 'up';
				pagePerc.perc = Math.floor(perc);
				pagePerc.performance = 'higher';
			}
			else{

				var perc = (Math.abs(factor) / oldValue) * 100;
				pagePerc.icon = 'down';
				pagePerc.perc = Math.floor(perc);
				pagePerc.performance = 'lower';
			}
			return pagePerc;
		};
	});
