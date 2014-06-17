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

app.get('/user', function (req, res) {
	    var key = req.params.key;
	    //console.log(key);
	    res.render('widget.html', {key:key});
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
				game.in(data.id).emit('NEW_USER', {});
				
		})

		socket.on('SET_NAME', function(data){
			num_players = game.clients(data.id).length;
			console.log("PLAYERS: " + num_players);	

			socket.on('TEXT', function(x){
				console.log('O MEU NOME:' + x.cmd);
				//data.name = x.cmd;
				_players.push(x.cmd);
				console.log(_players);
				socket.emit('NAME',{ names: x.cmd });
				console.log("My name: "+ x.cmd);
			})
			

		})

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

    		io.sockets.socket(game_masters[data.id]).emit("asd",data);
    	});

    	socket.on('TEXT', function(x){
    		io.sockets.socket(game_masters[x.id]).emit("lol",x);	
    	});

    	socket.on('SWIPE', function(data){
    		io.sockets.socket(game_masters[data.id]).emit("asd",data);
    	});
	});