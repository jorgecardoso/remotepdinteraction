var serverPublicAddress = process.argv[2] || "localhost";

// Start the application by running 'node app.js' in your terminal

var os = require('os');
var ifaces = os.networkInterfaces();
for (var dev in ifaces) {
  var alias = 0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4' && details.internal==false) {
      console.log(dev+(alias?':'+alias:''),details);
      serverPublicAddress = details.address;
      ++alias;
    }
  });
}




var express = require('express'),
	app = express();

var port = process.env.PORT || 8080;



// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.

var io = require('socket.io').listen(app.listen(port));

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.

require('./config')(app, io);

console.log('Your application is running on http://localhost:' + port);

/*
app.get('/', function(req, res){

		// Render views/pagina/index.html --página inicial
		res.render('index');
		console.log('render');
	});
*/
app.get('/applications', function (req, res) {
	    var key = req.params.key;
	    //console.log(key);
	    res.render('application-list.html', {apps: applications });
});



var applications = {};
var application_ids = {};
var users = {};

	// Initialize a new socket.io applicaion, named 'game'
var game = io.sockets.on('connection', function(socket) {

   	console.log("Socket connected: " + socket.id);
	
	
	// When an application starts, it sends a unique application id to the Node.js server
	socket.on('APP_READY', function(data){
		console.log("APP_READY ");
		console.log("Application connected: " + data.id);
		applications[socket.id] = {};
		application_ids[data.id] = {};
		application_ids[data.id].socketId = socket.id;
		applications[socket.id].applicationId = data.id;
		applications[socket.id].users =  Array();
		// app passes widget url
		applications[socket.id].widgetUrl = data.widgetUrl+"?serverAddress=http://"+serverPublicAddress+":"+port + "&applicationId="+data.id;
		applications[socket.id].iconUrl = data.iconUrl;
		console.log("sending server settings");
		// Notify app of server public address
		io.sockets.socket(socket.id).emit("SERVER_SETTINGS", {serverAddress:"http://"+serverPublicAddress+":"+port, widgetUrl: applications[socket.id].widgetUrl});
			
	})
	
	
	
	// When an user connects, it sends a USER_WIDGET_READY message
	socket.on('USER_WIDGET_READY', function(data){
		console.log("USER_WIDGET_READY: " + socket.id );
		console.log("    Connecting to app: " + data.applicationId);
		
		
		// check if application exists 
		if( application_ids[data.applicationId] !== undefined ) {
			users[socket.id] = {};
			users[socket.id].applicationId = data.applicationId;
			//todo: we don't need an explicit structure to now the users of an app
			// just go through all users and check their appid...
			applications[application_ids[data.applicationId].socketId].users.push(socket.id);
			console.log("Application users: " + applications[application_ids[data.applicationId].socketId].users + "");
			
			// Notify app
			io.sockets.socket(application_ids[data.applicationId].socketId).emit("USER_CONNECTED", {userId:socket.id});
			
			//Notify client
			io.sockets.socket(socket.id).emit("APPLICATION_READY", {applicationId:data.applicationId});
		} else {
			io.sockets.socket(socket.id).emit('ERROR', {message:"Application does not exist."});
			console.log("    Error: Application does not exist.");
		}
		
	})
	
	
	socket.on('USER_EVENT', function(data){
		console.log("USER_EVENT: " + socket.id + " " + JSON.stringify(data));
		
		if ( users[socket.id] !== undefined ) {
			applicationId = users[socket.id].applicationId; 
		} else {
			return;
		}
		
		// check if application exists 
		if ( application_ids[applicationId] !== undefined ) {
			applicationSocketId = application_ids[applicationId].socketId;
			
			// check if app has this user
			if ( applications[applicationSocketId].users.indexOf(socket.id) < 0 ) {
				applications[applicationSocketId].users.push(socket.id);
				// Notify app
				io.sockets.socket(applicationSocketId).emit("USER_CONNECTED", {userId:socket.id});
			
				//Notify client
				io.sockets.socket(socket.id).emit("APPLICATION_READY", {applicationId:applicationId});
				
			}
			
			
			// Notify app
			io.sockets.socket(application_ids[applicationId].socketId).emit("USER_EVENT", {userId: socket.id, data: data});
		} else {
			io.sockets.socket(socket.id).emit('ERROR', {message:"Application does not exist."});
			console.log("    Error: Application does not exist.");
		}
		
	})
	
	socket.on('FEEDBACK', function(data){
		console.log("FEEDBACK: " + socket.id );
		
		// Notify user
		io.sockets.socket(data.userId).emit("FEEDBACK", data);		
		
	})
	
    	socket.on('disconnect', function(){
    		console.log("Socket disconnected: " + socket.id);
    		if ( applications[socket.id] !== undefined ) { // application socket
    			
    			applicationId = applications[socket.id].applicationId;
    			
    			//Notify all users
    			for (var i = 0; i < applications[socket.id].users.length; i++ ) {
    				io.sockets.socket(applications[socket.id].users[i]).emit('APPLICATION_DISCONNECTED', {message:"Application disconnected."});
    			}

				// Delete users of that app    		
				/*
    			var userKeys = Object.keys(users);
    		
    			for (var i = 0; i < userKeys.length; i++ ) {
    				if (users[userKeys[i]].applicationId == applicationId) {
    					delete users[userKeys[i]];
    				}

    			}
    			*/
    			
    			// Delete app
    			delete application_ids[applicationId];
    			delete applications[socket.id];
    		
    		
    		} else if ( users[socket.id] !==  undefined ) { // user socket
    			applicationId = users[socket.id].applicationId
    			
    			// see if app still exists, and if so, remove the user and notify the app
    			if ( application_ids[applicationId] !== undefined ) {
    				applicationSocketId = application_ids[applicationId].socketId;
    				var index = applications[applicationSocketId].users.indexOf(socket.id);
    				if (index > -1) {
 				   		applications[applicationSocketId].users.splice(index, 1);
					}
					console.log("Application users: " + applications[applicationSocketId].users + "");
				
					//Notify app
					io.sockets.socket(applicationSocketId).emit("USER_DISCONNECTED", {userId:socket.id});
				}
    		} else {
    			console.log("Socket not assigned to any application.");

    		}
    		
    	});
	});