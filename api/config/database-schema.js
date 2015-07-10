var mongoose = require('mongoose');
// var mongodbURL = 'mongodb://10.241.204.9:27017/CIAnalytics';
var mongodbURL = 'mongodb://localhost/CIAnalytics';
var mongodbOptions = {};

// MongoDB connection
mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {

    if(err){ 

        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    }else{

        console.log('Connection successful to: ' + mongodbURL);
    }
});	

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var User = new Schema({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	web: { type: String, required: true },
	phone: { type: String, required: true }
});

var UserSocketRoom = new Schema({
	roomName: { type: ObjectId, required: true, unique: true },
	people: { type: Array }
});

var ClientInfo = new Schema({
	roomName: { type: ObjectId, required: true },
	socketId: { type: String, required: true },
	pages: { type: Array },
	status: { type: Boolean },
	created_at: { type: Date, default: Date.now }
});

// Complete browser details
var Browser = new Schema({
	roomName: { type: ObjectId, required: true },
	socketId: { type: ObjectId, required: true },	
	name: { type: String },
	version: { type: String },
	time: { type: Date, default: Date.now }
});

// Complete Platform details
var Platform = new Schema({
	roomName: { type: ObjectId, required: true },
	socketId: { type: ObjectId, required: true },	
	name: { type: String },
	os: { type: String },
	isMobile: { type: Boolean },
	isDesktop: { type: Boolean },
	time: { type: Date, default: Date.now }
});

// Compelte Location details
var Location = new Schema({
	roomName: { type: ObjectId, required: true },
	socketId: { type: ObjectId, required: true },	
	city: { type: String },
	state: { type: String },
	country: { type: String },
	time: { type: Date, default: Date.now }
});

// Chat messages
var Chat = new Schema({
	roomName: { type: ObjectId, required: true },
	socketId: { type: String, required: true },
	messages: { type: Array },
	time: { type: Date, default: Date.now }
});

// creating models
var userModel = mongoose.model('User', User),
	userSocketRoomModel = mongoose.model('UserSocketRoom', UserSocketRoom),
	clientInfoModel = mongoose.model('ClientInfo', ClientInfo),
	browserModel = mongoose.model('Browser', Browser),
	locationModel = mongoose.model('Location', Location),
	platformModel = mongoose.model('Platform', Platform),
	chatModel = mongoose.model('Chat', Chat);

// Exporting models here 
exports.userModel = userModel;
exports.userSocketRoomModel = userSocketRoomModel;	
exports.clientInfoModel = clientInfoModel;
exports.browserModel = browserModel;
exports.locationModel = locationModel;
exports.platformModel = platformModel;
exports.chatModel = chatModel;