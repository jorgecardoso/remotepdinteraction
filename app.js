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

app.get('/', function(req, res){

		// Render views/pagina/index.html --página inicial
		res.render('index');
		console.log('render');
	});

app.get('/panel', function (req, res) {
	    var key = req.params.key;
	    //console.log(key);
	    res.render('joystick.html', {key:key});
});


	var FULL_ROOM = 1;
	var game_masters = {};
	var num_players;
	var _players = [];

	// Initialize a new socket.io applicaion, named 'game'
	var game = io.sockets.on('connection', function(socket) {

    

		socket.on('SERVER_READY', function(data){
			console.log('SERVER_READY');
			socket.join(data.id);
			game_masters[data.id] = socket.id; 
			
			
			
			if(game.clients(data.id).length==FULL_ROOM+1)
				game.in(data.id).emit('NEW_PLAYER', {});
				
		})

		socket.on('SET_NAME', function(data){
			num_players = game.clients(data.id).length;
			console.log("PLAYERS: " + num_players);
			data.name= num_players;

			_players.push(data.name);

			socket.emit('NAME',{ names: data.name });
			console.log("My name: "+ data.name);

		})

		socket.on('CLIENT_READY', function(data){

			console.log('CLIENT_READY' + data.cmd);
			socket.join(data.id);
			num_players =game.clients(data.id).length;
			console.log(_players); 
			//if(num_players==FULL_ROOM+1 && game_masters[data.id]!=undefined)
				
				game.in(data.id).emit('NEW_PLAYER',{ player: data.name});
				console.log("Numero " + num_players);

		})

    	socket.on('DIRECTION', function(data){
    		console.log(data);

    		io.sockets.socket(game_masters[data.id]).emit("asd",data);
    	});

    	socket.on('TEXT', function(x){console.log("Copyright by MARIA: "+x)});

    	socket.on('SWIPE', function(data){
    		io.sockets.socket(game_masters[data.id]).emit("asd",data);
    	});
	});