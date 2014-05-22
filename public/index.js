var game;


var socket = io.connect('http://172.30.28.42:8080');

	socket.on('connect', function(){
		console.log('SERVER READY');
		socket.emit('SERVER_READY', {id: "dsfsddfs"});
	});

	socket.on('START', function(data){
		console.log(data);
		console.log('START GAME ' + data.players);
		$('code').remove();
		$('game').setStyle({
		  display: 'block'
		});
		game = snakeGame("the-game", data.players);
		game.start();
	});

	socket.on('asd', function(data){
		console.log(data);
		game.setDirection(data);
	});
