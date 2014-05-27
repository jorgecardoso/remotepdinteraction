var game;

var socket = io.connect('http://172.30.1.241:8080');

	socket.on('connect', function(){
		console.log('SERVER READY');
		socket.emit('SERVER_READY', {id: "dsfsddfs"});
	});

	socket.on('START', function(data){
		console.log(data);
		$('code').remove();
		$('game').setStyle({
		  display: 'block'
		});
		game = snakeGame("the-game", data.players);
		game.start();
	});

	socket.on('asd', function(data){
		console.log("Jogador: " + data.name + " comando: " + data.cmd);
		//game.setPlayer(data.name);
		game.setDirection(data.name, data.cmd);
		
	});
