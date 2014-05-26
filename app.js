// This is the main file of our chat app. It initializes a new 
// express.js instance, requires the config and routes files
// and listens on a port. Start the application by running
// 'node app.js' in your terminal


var express = require('express'),
	app = express();

// This is needed if the app is run on heroku:

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



	/*app.get('/panel', function (req, res) {
	    var key = req.params.key;
	    console.log(key);
	    res.render('mobile.html', {key:key});
	});

	app.get('/create', function(req,res){

		// Generate unique id for the room
		var id = Math.round((Math.random() * 1000000));

		// Redirect to the random room
		res.redirect('/chat/'+id);
	});

	app.get('/chat/:id', function(req,res){

		// Render the chant.html view
		res.render('chat');
	});*/

	var FULL_ROOM = 2;
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
				game.in(data.id).emit('START', {});
				
		})

		socket.on('SET_NAME', function(data){
			num_players =game.clients(data.id).length;

			socket.join(data.id);

			data.name="player"+(num_players);

			_players.push(data.name);

			game.in(data.id).emit('NAME',{ names: data.name });
			console.log("My name: "+ data.name);

		})

		socket.on('CLIENT_READY', function(data){

			console.log('CLIENT_READY' + data.cmd);
			socket.join(data.id);
			num_players =game.clients(data.id).length;
			console.log(_players); 
			if(num_players==FULL_ROOM+1 && game_masters[data.id]!=undefined)
				
				game.in(data.id).emit('START',{ players: _players });
				console.log("Numero " + num_players);

		})

    	socket.on('DIRECTION', function(data){
    		console.log(data);

    		io.sockets.socket(game_masters[data.id]).emit("asd",data.cmd);
    	});

    	socket.on('TEXT', function(x){console.log("Copyright by MARIA: "+x)});
		
		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room

		/*socket.on('load',function(data){

			if(game.clients(data).length === 0 ) {

				socket.emit('peopleinGame', {number: 0});
			}
			else if(game.clients(data).length === 1) {

				socket.emit('peopleinGame', {
					number: 1,
					user: game.clients(data)[0].username,
					avatar: game.clients(data)[0].avatar,
					id: data
				});
			}
			else if(game.clients(data).length >= 2) {

				game.emit('tooMany', {boolean: true});
			}
		});

		// When the client emits 'login', save his name and avatar,
		// and add them to the room
		socket.on('login', function(data) {

			// Only two people per room are allowed
			if(chat.clients(data.id).length < 2){

				// Use the socket object to store data. Each client gets
				// their own unique socket object

				socket.username = data.user;
				socket.room = data.id;
				socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});

				// Tell the person what he should use for an avatar
				socket.emit('img', socket.avatar);


				// Add the client to the room
				socket.join(data.id);

				if(chat.clients(data.id).length == 2) {

					var usernames = [],
						avatars = [];

					usernames.push(chat.clients(data.id)[0].username);
					usernames.push(chat.clients(data.id)[1].username);

					avatars.push(chat.clients(data.id)[0].avatar);
					avatars.push(chat.clients(data.id)[1].avatar);

					// Send the startChat event to all the people in the
					// room, along with a list of people that are in it.

					chat.in(data.id).emit('startChat', {
						boolean: true,
						id: data.id,
						users: usernames,
						avatars: avatars
					});
				}

			}
			else {
				socket.emit('tooMany', {boolean: true});
			}
		});

		// Somebody left the chat
		socket.on('disconnect', function() {

			// Notify the other person in the chat room
			// that his partner has left

			socket.broadcast.to(this.room).emit('leave', {
				boolean: true,
				room: this.room,
				user: this.username,
				avatar: this.avatar
			});

			// leave the room
			socket.leave(socket.room);
		});


		// Handle the sending of messages
		socket.on('msg', function(data){

			// When the server receives a message, it sends it to the other person in the room.
			socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		});*/
	});