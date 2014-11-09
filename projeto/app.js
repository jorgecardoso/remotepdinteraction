// Start the application by running 'node app.js' in your terminal


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

app.get('/user', function (req, res) {
	    var key = req.params.key;
	    //console.log(key);
	    res.render('widget.html', {key:key});
});
*/


var applications = {};
var users = {};

	// Initialize a new socket.io applicaion, named 'game'
var game = io.sockets.on('connection', function(socket) {

   	console.log("Socket connected: " + socket.id);
	
	
	// When an application starts, it sends a unique application id to the Node.js server
	socket.on('APP_READY', function(data){
		console.log("Application connected: " + data.id);
		applications[socket.id] = {};
		applications[data.id] = {};
		applications[data.id].socketId = socket.id;
		applications[socket.id].applicationId = data.id;
		applications[socket.id].users =  Array();
	})
	
	
	
	// When an user connects, it sends a USER_WIDGET_READY message
	socket.on('USER_WIDGET_READY', function(data){
		console.log("USER_WIDGET_READY: " + socket.id );
		console.log("    Connecting to app: " + data.applicationId);
		
		
		// check if application exists 
		if( applications[data.applicationId] !== undefined ) {
			users[socket.id] = {};
			users[socket.id].applicationId = data.applicationId;
			applications[applications[data.applicationId].socketId].users.push(socket.id);
			console.log("Application users: " + applications[applications[data.applicationId].socketId].users + "");
			
			// Notify app
			io.sockets.socket(applications[data.applicationId].socketId).emit("USER_CONNECTED", {userId:socket.id});
		} else {
			io.sockets.socket(socket.id).emit('ERROR', {message:"Application does not exist."});
			console.log("    Error: Application does not exist.");
		}
		
	})
	
	
	socket.on('USER_EVENT', function(data){
		console.log("USER_EVENT: " + socket.id );
		
		applicationId = users[socket.id].applicationId;
		
		// check if application exists 
		if ( applications[applicationId] !== undefined ) {
			applicationSocketId = applications[applicationId].socketId;
			
			
			// Notify app
			io.sockets.socket(applications[applicationId].socketId).emit("USER_EVENT", data);
		} else {
			io.sockets.socket(socket.id).emit('ERROR', {message:"Application does not exist."});
			console.log("    Error: Application does not exist.");
		}
		
	})
	
		/*

		socket.on('CLIENT_READY', function(data){

			console.log('CLIENT_READY' + data.name);
			socket.join(data.id);
			num_players = game.clients(data.id).length;
			console.log("NUM: " + _players); 
			//if(num_players==FULL_ROOM+1 && game_masters[data.id]!=undefined)
				
				game.in(data.id).emit('NEW_USER',{ player: data.name});
				game.in(data.id).emit('SET_USER',{ player: data.name});
				console.log("Numero " + num_players);

		})

    	socket.on('DIRECTION', function(data){
    		console.log("esquerda: " + data.cmd);

    		io.sockets.socket(game_masters[data.id]).emit("asd", data);
    	});

    	socket.on('TEXT', function(x){
    		io.sockets.socket(game_masters[x.id]).emit("lol",x);	
    	});

    	socket.on('SWIPE', function(data){
    		io.sockets.socket(game_masters[data.id]).emit("asd",data);
    	});
    	*/
    	socket.on('disconnect', function(){
    		console.log("Socket disconnected: " + socket.id);
    		if ( applications[socket.id] !== undefined ) { // application socket
    			
    			applicationId = applications[socket.id].applicationId;
    			
    			//Notify all users
    			for (var i = 0; i < applications[socket.id].users.length; i++ ) {
    				io.sockets.socket(applications[socket.id].users[i]).emit('APPLICATION_DISCONNECTED', {message:"Application disconnected."});
    			}

				// Delete users of that app    		
    			var userKeys = Object.keys(users);
    		
    			for (var i = 0; i < userKeys.length; i++ ) {
    				if (users[userKeys[i]].applicationId == applicationId) {
    					delete users[userKeys[i]];
    				}

    			}
    			
    			// Delete app
    			delete applications[applicationId];
    			delete applications[socket.id];
    		
    		
    		} else if ( users[socket.id] !==  undefined ) { // user socket
    			applicationId = users[socket.id].applicationId
    			applicationSocketId = applications[applicationId].socketId;
    			var index = applications[applicationSocketId].users.indexOf(socket.id);
    			if (index > -1) {
 				   applications[applicationSocketId].users.splice(index, 1);
				}
				console.log("Application users: " + applications[applicationSocketId].users + "");
				
				//Notify app
				io.sockets.socket(applicationSocketId).emit("USER_DISCONNECTED", {userId:socket.id});
    		} else {
    			console.log("Socket not assigned to any application.");

    		}
    		
    	});
	});