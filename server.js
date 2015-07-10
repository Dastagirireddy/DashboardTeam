// Loading npm modules
var express = require('express'),
	bodyParser = require('body-parser'),
	clientSessions = require('client-sessions'),
	http = require('http'),
	io = require('socket.io'),
	cookie = require('cookie'),
	fs = require('fs'),
	useragent = require('express-useragent'),
	db = require('./api/config/database-schema.js');

// Creating app
var app = express();

// Creating server for socketio
http = http.Server(app);
io = io(http);

// Routes setup
var routes = {};
routes.account = require('./api/routes/account.js');
routes.service = require('./api/services/socket-services.js');
routes.clients = require('./api/routes/client-details.js');
routes.dashboard = require('./api/services/dashboard-io.js');
routes.dVersion = require('./api/routes/dashboard-version.js');

// App level configurations
app.set('port', process.env.PORT || 3000); // Setting port
app.use(express.static(__dirname + '/public')); // Loading static like html, css, images, js etc,.
app.use(bodyParser.json()); // Collection JSON data from form, Ajax request,etc,..
app.use(clientSessions({
	secret: 'myserver'  // Client sessions will create session for every login user
}));
app.set('view engine', 'ejs');

// Creating app running port
http.listen(app.get('port'), function(){
	console.log("Hurry Your app is running on PORT "+app.get('port'));
});

// Routes and API calls defining here
app.post('/register', routes.account.register);

app.post('/login', routes.account.login);

app.get('/logout', routes.account.logout);

// On every route change check whether the is exists or not
app.get('/isLoggedIn', routes.account.isLoggedIn);

// collecting User details for Overview page
app.get('/getUserDetails', routes.account.getUserDetails);

// Setting cross origin allow requests
// app.all('/', function(req, res) {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//  });
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Getting connected clients details
app.get('/getClientDetails/:id', routes.clients.getClientDetails);
app.get('/getBrowserDetails/:id', routes.clients.getBrowserDetails);
app.get('/getPlatformDetails/:id', routes.clients.getPlatformDetails);
app.get('/getLocationDetails/:id', routes.clients.getLocationDetails);

// collecting sockets clients data
app.get('/getSocketClientsData/:id', routes.clients.getSocketClientsData);

// Dashboard request for registered clients
app.get('/v/:id', routes.dVersion.dashboardVersion);

// Collecting live visitors list
app.get('/getLiveVisitorList/:id', routes.clients.getLiveVisitorList);

// Socket connection establishing here
io.sockets.on('connection', function(client){

	routes.dashboard.dashboardIO(io, client, db, routes);
});
