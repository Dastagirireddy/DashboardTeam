var db = require('../config/database-schema.js');

// Registration module
exports.register = function(req, res){

	var data = {};
	//console.log(req.body);
	username = req.body.username;
	email = req.body.email;
	password = req.body.password;
	web = req.body.web;
	phone = req.body.phone;

	var User = new db.userModel();
	User.username = username;
	User.password = password;
	User.email = email;
	User.web = web;
	User.phone = phone;

	User.save(function(error, success){

		if(success){
			console.log(success);
			var UserSocketRoom = new db.userSocketRoomModel();
			UserSocketRoom.roomName = success._id;
			UserSocketRoom.save(function(e, s){

				// var Browser = new db.browserModel();
				// Browser.roomName = success._id;
				// Browser.save(function(e1, s1){

				// 	data.status = 200;
				// 	res.json(data);
				// });
				data.status = 200;
				res.json(data);
			});
		}
		else{
			//console.log(error);
			data.status = 401;
			res.json(data);
		}
	});
};

// Login module
exports.login = function(req, res){

	var data = {};
	//console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;

	db.userModel.findOne({email: email, password: password}, function(error, success){
		if(success){
			//console.log(success);
			success.password = undefined;
			req.session_state.user = success;
			res.cookie('regId', success._id);
			data.status = 200;
			data.user = success;
			res.json(data);
		}
		else{
			data.status = 403;
			res.json(data);
		}
	});
};

// Exporting logout module
exports.logout = function(req, res){

	var data = {};
	if(typeof req.session_state.user === 'object'){
		req.session_state.reset();
		res.clearCookie('regId');
		data.status = 200;
	}
	else{
		data.status = 403;
	}
	res.json(data);
};

//Exporting getUserDetails module
exports.getUserDetails = function(req, res){

	//console.log("I received request from getUserDetails");
	//console.log(req.headers);
	var data = {};
	data.host = req.headers.host;
	if(typeof req.session_state.user === 'object'){

		db.userModel.findOne({_id: req.session_state.user._id}, function(error, success){

			if(typeof success === 'object'){

				data.status = 200;
				data.overview = success._id;
				res.json(data);
			}
			else{
				res.json(data)
			}
		});
	}
	else{

		data.status = 403;
	}
};