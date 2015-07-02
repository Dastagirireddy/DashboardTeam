// socket map
var socketMap = {};
var cookie = require('cookie'),
	useragent = require('express-useragent'),
	ejs = require('ejs');

var fs = require('fs');

var socketMap = {};
var cookie = require('cookie'),
	useragent = require('express-useragent');

exports.dashboardIO = function(io, client, db, routes){

	try{

		var cookies,
			roomName,
			socketId;

		try{

			cookies = cookie.parse(client.handshake.headers.cookie);
		}catch(ex){
			//console.log("Parsing cookies raised an exception,..");
		}

		if(typeof cookies === 'object') {

			if(client.handshake.query.hasOwnProperty('webId')) {

				//console.log("I am in Anonymous User Id block,....");
				roomName = client.handshake.query["webId"];

				if(cookies.hasOwnProperty("socket_state")) {

					client.room = roomName;
					client.join(roomName);

					//console.log("I have socket_state property,...");
					socketId = cookies["socket_state"];
					if(socketMap.hasOwnProperty(socketId)){

						client.socketId = socketId;
						console.log("I am a socketMap users Array,....");
						socketMap[socketId]["users"].push(client.id);
						socketMap[socketId]["counter"] += 1;
					}
					else{

						//console.log("I am not a socketMap users Array,...");
						socketMap[socketId] = {};
						client.socketId = socketId;
						socketMap[socketId]["users"] = [];
						socketMap[socketId]["counter"] = 1;
						socketMap[socketId]["users"].push(client.id);
					}
				}
				else{

					socketId = Math.floor(Math.random() * 1000000);
					client.room = roomName;
					client.join(roomName);
					client.socketId = socketId;
					//console.log("I don't have socket_state property,...");
					if(!socketMap.hasOwnProperty(socketId)) {

						//console.log("I don't have socketMap,...");
						socketMap[socketId]	= {};
						socketMap[socketId]["users"] = [];
						socketMap[socketId].users.push(client.id);
						socketMap[socketId]["counter"] = 1;
					}
					client.emit('socketId', socketId);
				}

				if(socketMap.hasOwnProperty(socketId)) {

					var source = client.handshake.headers["user-agent"];
					var ua = useragent.parse(source);
					console.log("I am submitting client metrics to the database server,.....");
					//console.log(socketMap[socketId]["counter"]);
					if(socketMap[socketId]["users"].indexOf(client.id) > -1 && socketMap[socketId]["counter"] == 1) {

						var clientInfo = routes.service.getClientDetails(ua, roomName, socketId, client);
						//console.log("<<<<<<<<<<<<-------------------- Engine starts here ------------------>>>>>>>>");
						var ClientInfo = new db.clientInfoModel();
						ClientInfo.roomName = clientInfo.roomName;
						ClientInfo.socketId = clientInfo.socketId;
						ClientInfo.pages.push(clientInfo.page);
						ClientInfo.status = clientInfo.status;
						ClientInfo.created_at = clientInfo.created_At;

						ClientInfo.save(function(e1, s1){

							if(s1) {

								// Retrieve today's complete data from the Database
								routes.service.clientSocketData(roomName, io, client);

								// Retrieve today's complete visitor list from the database
								routes.service.getLiveVisitorList(roomName, io, client);
								//console.log(s1);
								if(socketMap[socketId]["counter"] == 1) {

									var Browser = new db.browserModel();
									Browser.roomName = clientInfo.roomName;
									Browser.socketId = s1._id;
									Browser.name = clientInfo.browser.name;
									Browser.version = clientInfo.browser.version;
									Browser.time = s1.created_at;
									Browser.save(function(e2, s2){

										if(s2){

											//console.log(s2);
											var Location = new db.locationModel();
											Location.roomName = clientInfo.roomName;
											Location.socketId = s1._id;
											Location.city = clientInfo.location.city;
											Location.state = clientInfo.location.state;
											Location.country = clientInfo.location.country;
											Location.time = s2.time;
											Location.save(function(e3, s3){

												if(s3){

													//console.log(s3);
													var Platform = new db.platformModel();
													Platform.roomName = clientInfo.roomName;
													Platform.socketId = s1._id;
													Platform.name = clientInfo.platform.name;
													Platform.os = clientInfo.platform.os;
													Platform.isMobile = clientInfo.platform.isMobile;
													Platform.isDesktop = clientInfo.platform.isDesktop;
													Platform.save(function(e4, s4){

														if(s4){

															console.log("Final entry in the databse of clientInfo details");
															//console.log(s4);

															// Retrieve today's complete data from the Database
															routes.service.clientSocketData(roomName, io, client);

															// Retrieve today's complete visitor list from the database
															routes.service.getLiveVisitorList(roomName, io, client);
														}
													});
												}
											});
										}
									});
								}
								else {

									// Retrieve today's complete data from the Database
									routes.service.clientSocketData(roomName, io, client);

									// Retrieve today's complete visitor list from the database
									routes.service.getLiveVisitorList(roomName, io, client);
								}
							}
							else{
								console.log(e1);
							}
						});
					}

					/*
					* Storing connected clients to the particulr registered website userId
					* online users people list
					* If already exists leave it as it is.
					*/
					if(typeof roomName !== undefined){

						db.userSocketRoomModel.findOne({roomName: roomName}, function(error, success){

							if(success){

								if(success.people.indexOf(socketId) <= -1){

									success.people.push(socketId);
									success.save(function(e, s){

										if(s){
											console.log("Adding to the online list successfully completed,..");
										}
										else{
											console.log(e);
										}
									});
								}
							}
							else{

								console.log(error);
							}
						});
					}
				}
			}
			else {

				console.log("I am calling Parser RegId method for getting registered user id ");
				if(cookies.hasOwnProperty("regId")){

					socketId = routes.service.parseRegId(cookies["regId"]);
					roomName = socketId;
					if(socketMap.hasOwnProperty(socketId)){

						if(Array.isArray(socketMap[socketId]["users"])){

							socketMap[socketId].users.push(client.id);
							socketMap[socketId]["counter"] += 1;
						}
						else{

							socketMap[socketId].users = [];
							socketMap[socketId].users.push(client.id);
							socketMap[socketId]["counter"] = 1;
						}
					}
					else{

						socketMap[socketId] = {};
						socketMap[socketId]["users"] = [];
						socketMap[socketId].users.push(client.id);
						socketMap[socketId]["counter"] = 1;
					}
					client.room = socketId;
					client.join(client.room);
				}
				else {
					console.log("Ur not an authorized person to access,..");
				}
			}
		}
		else{

			console.log("No cookies found,...");
		}
		//console.log("socketMap Users ------------------------>>");
		//console.log(socketMap);

		// Admin Messaging system (admin -> client)
		client.on('adminMsg', function(data){
			
			console.log(data);
			console.log("Admin sent message to the client");
			var user = data.socketId;

			routes.service.saveChatMessages(client.room, client.room, user, data.message, function(status){

				// if(status == true){

					db.chatModel.findOne({roomName: client.room, socketId: user}, function(e2, s2){
						
						//console.log(s2);
						client.emit('messages', s2.messages);
						if(socketMap.hasOwnProperty(user)){

							var arr = socketMap[user].users;
							//console.log("&&&&&");
							//console.log(arr);
							for(var i=0;i<arr.length;i++){

								//io.sockets.to(arr[i]).emit('pingAdmin', s2.message);
								console.log("Admin is emitting message to client");
								io.sockets.to(arr[i]).emit('messages', s2.messages);
							}
							//io.sockets.to(client.room).emit('messages', s2.messages);
						}				
					});	
				//}			
			});

		});

		// Client messaging system (client -> admin)
		client.on('clientMsg', function(data){
			
			//console.log(data);
			var admin = client.room;
			console.log("Client sent message to the Admin");
			//console.log("------------------------------------");
			routes.service.saveChatMessages(client.room, socketId, client.socketId, data, function(status){

				//if(status == true){

					db.chatModel.findOne({roomName: client.room, socketId: client.socketId}, function(e2, s2){

						client.emit('messages', s2.messages);

						if(socketMap.hasOwnProperty(admin)){

							var arr = socketMap[admin].users;
							for(var i=0;i<arr.length;i++){

								//console.log(i);
								console.log("Client emitting message to the Admin");
								io.sockets.to(arr[i]).emit('messages', s2.messages);
							}

						}				
					});					
				//}
			});

		});
		// IO disconnection state
		client.on('disconnect', function(){

			if(socketMap.hasOwnProperty(socketId)) {

				if(Array.isArray(socketMap[socketId].users)) {

					var arr = socketMap[socketId].users,
					    pos = arr.indexOf(client.id),
						result = routes.service.popArrayElement(arr, pos);

					socketMap[socketId]["users"] = result;
					socketMap[socketId]["counter"] -= 1;

					if(socketMap[socketId]["counter"] <=0 ) {

						db.userSocketRoomModel.findOne({roomName: client.handshake.query.webId}, function(error, success){

							if(success){

								var client_index = success.people.indexOf(socketId);
								if(client_index > -1){

									var people = routes.service.popArrayElement(success.people, client_index);
									success.people = people;
									success.save(function(e, s){

										if(s) {
											//console.log(s);
											db.clientInfoModel.update({roomName: roomName, socketId: socketId, status: true}, {'$set':{'status': false}}, function(err, succ){

												//console.log(succ);
												if(succ){

													routes.service.clientSocketData(roomName, io, client);

													// Retrieve today's complete visitor list from the database
													routes.service.getLiveVisitorList(roomName, io, client);
												}
												else{
													//console.log("Failed to update the user status,...");
												}
											});
										}
										else{
											//console.log(e);
										}
									});
								}
							}
						});
						delete socketMap[socketId];
					}
				}
				//console.log(client.id + " has been disconnected from the socket server room " + client.room);
 				io.sockets.in(client.room).emit("message", client.id + " has been disconnected from the socket server room " + client.room);
			}
			else {

				console.log("No clients to remove,..");
			}
			//console.log(socketMap);
		});
	}
	catch(exp){
		console.log("Exception occurred,...");
	}
};
