var game;



var socket = io.connect('http://172.30.13.112:8080');

socket.on('connect', function(){
	console.log('SERVER READY');
	socket.emit('SERVER_READY', {id: "dsfsddfs"});
	game = snakeGame("the-game");
	game.start();
	
});

socket.on('NEW_PLAYER', function(data){
	
	

	
	game.setPlayers(data.player);
	console.log("MY NAME: " + data.player);

	/*$('code').remove();
	$('game').setStyle({
	  display: 'block'
	});*/
	
});

socket.on('asd', function(data){
	console.log("Jogador: " + data.name + " comando: " + data.cmd);
	console.log(game);
	
	game.setDirection(data.name, data.cmd);
	
});
