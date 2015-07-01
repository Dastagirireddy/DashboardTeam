var db = require('../config/database-schema.js');
var days = require('../config/config-services.js');

var fs = require('fs');
// var calcDays = function(daycount){

// 	var oneday = 1000 * 60 * 60 * 24;
// 	var daysago = Date.now() - daycount * oneday;
// 	return daysago;
// };

// Exporting Clients Details
exports.getClientDetails = function(req, res){

	//console.log("I am in getClientDetails");
	var roomName = req.params.id;
	var data = {};
	if(req.session_state.user._id === roomName){

		//var roomName = req.params.id;

		db.clientInfoModel.find({roomName: roomName, 'created_at': { '$gt': days.calcDays(10) }}, function(error, success){
			//console.log("I am in clientInfoModel....");
			//console.log(success);
			data.status = 200;
			data.clients = success;
			fs.writeFile('clients.json', JSON.stringify(success), function(er){
				if(er){
					//console.log("Data written failure,...");
				}
			});
			res.json(data);
		});
	}
	else{
		data.status = 403;
		res.json(data);
	}
};

// Exporting client browser details
exports.getBrowserDetails = function(req, res){

	//console.log("I am in getBrowserDetails");
	var roomName = req.params.id;
	var data = {};
	if(req.session_state.user._id === roomName){

		db.browserModel.find({roomName: roomName, 'time': { '$gt': days.calcDays(10) }}, function(error, success){

			if(success){

				data.status = 200;
				data.browsers = success;
				fs.writeFile('data.json', JSON.stringify(success), function(er){
					if(er){
						//console.log("Data written failure,...");
					}
				});
				res.json(data);
			}
			else{
				data.status = 401;
				res.json(data);
			}
		});
	}
	else{
		data.success = 403;
		res.json(data);
	}
};

// Exporting client Operating System details
exports.getPlatformDetails = function(req, res){

	//console.log("I am in getPlatformDetails");
	var roomName = req.params.id;
	var data = {};
	if(req.session_state.user._id === roomName){

		db.platformModel.find({roomName: roomName, 'time': { '$gt': days.calcDays(10) }}, function(error, success){

			if(success){

				data.status = 200;
				data.platforms = success;
				res.json(data);
			}
			else{
				data.status = 401;
				res.json(data);
			}
		});
	}
	else{
		data.success = 403;
		res.json(data);
	}
};

// Exporting client location details
exports.getLocationDetails = function(req, res){

	//console.log("I am in getLocationDetails");
	var roomName = req.params.id;
	var data = {};
	if(req.session_state.user._id === roomName){

		db.locationModel.find({roomName: roomName, 'time': { '$gt': days.calcDays(10) }}, function(error, success){

			if(success){

				data.status = 200;
				data.locations = success;
				res.json(data);
			}
			else{
				data.status = 401;
				res.json(data);
			}
		});
	}
	else{
		data.success = 403;
		res.json(data);
	}
};

exports.getSocketClientsData = function(req, res){

	var daysago = days.calcDays(7);
	var roomName = req.params.id;
	db.clientInfoModel.find({roomName: roomName, 'created_at': {'$gt': daysago}}, function(e1, s1){

		//console.log("I am in clientInfoModel client data written by dastagirireddy");

		var cliendData = {};
		if(typeof s1 === 'object'){

			// Adding clients data
			cliendData.clients = s1;
			db.userSocketRoomModel.find({roomName: roomName}, function(e2, s2){

				if(typeof s2 === 'object'){

					cliendData.live = s2;
					res.json(cliendData);
				}
				else{

					console.log(e2);
				}
			});
			//console.log("Collecting data,......");
		}
		else{

			console.log(e1);
		}
	});
};


exports.getLiveVisitorList = function(req, res){

	var roomName = req.params.id;
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
									//io.sockets.in(client.room).emit('liveList', cliendData);
									res.json(cliendData);
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
