var db = require('../config/database-schema.js');
var days = require('../config/config-services.js');

// Service for setting cookies, Random ID
exports.setRandomSocketId = function(){


};


// Service for parsing regId from dirty data around
exports.parseRegId = function(regId){

	var length = regId.length;
	var userId = regId.substring(regId.indexOf('\"')+1, length-1);
	return userId;
};

exports.getClientDetails = function(useragent, roomName, socketId, client){
	
	//console.log(useragent);
	var ip = client.handshake.address;
	//console.log("I Collecting IP address");
	// console.log(ip);
	// var geo = geoip.lookup(ip);
	// console.log(geo);
	var clientInfo = {},
		browser = {},
		location = {},
		platform = {};

	clientInfo.roomName = roomName;
	clientInfo.socketId = socketId;
	browser.name = useragent.browser;
	browser.version = useragent.version;
	// browser.socketId = socketId;
	clientInfo.browser = browser;

	location.city = '';
	location.state = '';
	location.country = '';	
	// location.socketId = socketId;	
	clientInfo.location = location;

	platform.name = useragent.platform;
	platform.os = useragent.os;
	platform.isMobile = useragent.isMobile;
	platform.isDesktop = useragent.isDesktop;
	// platform.socketId = socketId;
	clientInfo.platform = platform;

	clientInfo.page = client.handshake.headers.origin;

	clientInfo.status = true;

	clientInfo.created_At = new Date();
	//console.log(clientInfo);
	return clientInfo;
}

exports.popArrayElement = function(arr, index){

	arr.splice(index, 1);
	return arr;
};

var browserVerify = function(browser, browserName){

	var browserItem = {};

	for(var i=0;i<browser.length;i++){

		
		var item = browser[i][browserName];
		if(browser[i]["name"] === browserName){

			browserItem.isBrowserAvailable = true;
			browserItem.index = i;
			break;
		}
		else{

			browserItem.isBrowserAvailable = false;
			browserItem.index = -1;
		}
	}
	return browserItem;
};

exports.setBrowserCount = function(useragent, roomName){

	var browserName = useragent.browser;
	db.browserModel.findOne({roomName: roomName}, function(error, success){

		if(success){

			var browser = success["browserCount"];
			var browserItem = browserVerify(browser, browserName);
			if(browserItem.isBrowserAvailable){

				var indexer = success.browserCount[browserItem.index]["myCounter"];
				//console.log(indexer);
				var counter = parseInt(indexer, 10) + 1;
				//console.log("I am browser counter"+counter);
				// browser[browserItem.index]["count"] = counter;
				success.browserCount[browserItem.index]['myCounter'] = counter;
				//console.log(success.browserCount[browserItem.index]['myCounter']);
				db.browserModel.update({'_id': success._id, 'browserCount.name': browserName}, {'$set': {'browserCount.$.myCounter': counter}}, function(e, s){

					if(s){
						//console.log("I am in IF calss");
						//console.log(s);
					}
					else{
						//console.log(e);
					}
				});
			}
			else{
				
				success.browserCount.push({
					name: browserName,
					myCounter: 1
				});
				//success = browser;
				success.save(function(e, s){
					if(s){
						//console.log("I am in Else class");
						//console.log(s);
					}
					else{
						//console.log(e);
					}
				});
			}
		}
	});
};

exports.clientSocketData = function(roomName, io, client){

	// var todayend = new Date();
	// var todaystart = new Date(todayend.getFullYear(), todayend.getMonth(), todayend.getDate());
	var daysago = days.calcDays(7)	;
	db.clientInfoModel.find({roomName: roomName, 'created_at': {'$gt': daysago}}, function(e1, s1){

		//console.log("I am in clientInfoModel client data written by dastagirireddy");

		var cliendData = {};
		if(typeof s1 === 'object'){

			// Adding clients data
			cliendData.clients = s1;
			db.userSocketRoomModel.find({roomName: roomName}, function(e2, s2){

				if(typeof s2 === 'object'){

					cliendData.live = s2;
					io.sockets.in(client.room).emit('clients', cliendData);
				}
				else{

					//console.log(e2);
				}
			});
			//console.log("Collecting data,......");
		}
		else{

			console.log(e1);
		}
	});
};

exports.getLiveVisitorList = function(roomName, io, client){

	var todayend = new Date();
	var todaystart = new Date(todayend.getFullYear(), todayend.getMonth(), todayend.getDate());
	// var daysago = days.calcDays(7)	;
	db.clientInfoModel.find({roomName: roomName, 'created_at': {'$gt': todaystart}, status: true}, function(e1, s1){

		//console.log("I am in clientInfoModel client data written by dastagirireddy");

		var cliendData = {};
		if(typeof s1 === 'object'){

			// Adding clients data
			cliendData.clients = s1;
			db.browserModel.find({roomName: roomName, time: { '$gt': todaystart }}, function(e2, s2){

				if(typeof s2 === 'object'){

					cliendData.browsers = s2;
					db.locationModel.find({roomName: roomName, time: { '$gt': todaystart }}, function(e3, s3){

						if(typeof s3 === 'object'){

							cliendData.locations = s3;
							db.platformModel.find({ roomName: roomName, time: { '$gt': todaystart } }, function(e4, s4){

								if(typeof s4 === 'object'){

									cliendData.platforms = s4;
									//console.log("I Retrieved all the cliendData,....");
									//console.log(cliendData);
									io.sockets.in(client.room).emit('liveList', cliendData);
								}
							});
						}
					});
				}
				else{

					//console.log(e2);
				}
			});
			//console.log("Collecting data,......");
		}
		else{

			//console.log(e1);
		}
	});	
};

// Save Chat History
exports.saveChatMessages = function(roomName, sender, user, message, callback){

	db.chatModel.findOne({roomName: roomName, socketId: user}, function(err, succ){

		var obj = {};
		obj.name = sender;
		obj.message = message;
		if(!succ){

			console.log(err);
			var Chat = new db.chatModel();
			Chat.roomName = roomName;
			Chat.socketId = user;
			Chat.messages.push(obj);
			Chat.save(function(e, s){

				if(e){
					callback(false);
					//console.log(e);
				}
				else{
					callback(true);
					console.log("successfully saved data into the chat history,..");
				}
			});
		}
		else{

			//console.log(succ);
			succ.messages.push(obj);
			succ.save(function(e1, s1){

				if(e1){
					callback(false);
					console.log(e1);
				}
				else{
					callback(true);
					console.log(s1);
				}
			});
		}
	});	
};

// Collecting complete information for sockets data
// exports.clientTodayData = function(roomName, ){
	
// 	// Retrieve today's complete data from the Database
// 	var todayend = new Date();
// 	var todaystart = new Date(todayend.getFullYear(), todayend.getMonth(), todayend.getDate());

// 	db.clientInfoModel.find({roomName: roomName, 'created_at': {'$gt': todaystart}}, function(e1, s1){

// 		console.log("I am in clientInfoModel client data written by dastagirireddy");

// 		var cliendData = {};
// 		if(typeof s1 === 'object'){

// 			// Adding clients data
// 			cliendData.clients = s1;
// 			db.browserModel.find({roomName: roomName, 'time': {'$gt': todaystart}}, function(e2, s2){

// 				if(typeof s2 === 'object'){

// 					cliendData.browsers = s2;
// 					db.locationModel.find({roomName: roomName, 'time': {'$gt': todaystart}}, function(e3, s3){

// 						if(typeof s3 === 'object'){

// 							cliendData.locations = s3;
// 							db.platformModel.find({roomName: roomName, 'time': {'$gt': todaystart}}, function(e4, s4){

// 								if(typeof s4 === 'object'){

// 									cliendData.platforms = s4;
// 									io.sockets.in(client.room).emit('clients', cliendData);
// 								}
// 								else{
// 									console.log(e4);
// 								}
// 							});
// 						}
// 						else{
// 							console.log(e3);
// 						}
// 					});
// 				}
// 				else{
// 					console.log(e2);
// 				}
// 			});
// 			console.log("Collecting data,......");
// 		}
// 		else{

// 			console.log(e1);
// 		}
// 	});
// };


