var ejs = require('ejs');
var fs = require('fs');

exports.dashboardVersion = function(req, res){

	console.log("I got website request,...");
	console.log(req.params.id);
	var domain = req.headers.referer;
	console.log(req.cookies);
	if(typeof req.cookies === undefined){

		var socketId = Math.floor(Math.random() * 1000000);
		res.cookie('socket_state', socketId);
	}
	//res.write("Helloo everyone");;
	//Loading chatbox
	fs.readFile('doc/chatBox.html', 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  //console.log(data);
	  var myData = {};
	  myData.webId = req.params.id;

	  var template = ejs.render(data, myData);	  
	  res.send(template);
	});
};