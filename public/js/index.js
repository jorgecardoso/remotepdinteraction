var game;



var socket = io.connect('http://localhost:8080');

socket.on('connect', function(){
	console.log('SERVER READY');
	socket.emit('SERVER_READY', {id: "dsfsddfs"});
	game = snakeGame("the-game");
	game.start();
	
});

socket.on('NEW_USER', function(data){
	
	game.setPlayers(data.player);
	console.log("MY NAME: " + data.player);
	alertify.log(data.player + " is ready!", "success", 10000);
	var user = new Element('li', { 'id': data.player});
	$('all_users').appendChild(user);
	user.update(data.player);

});

socket.on('SET_USER', function(data){
	
	$(data.player).update(data.player + ': ' + game.getScores(data.player));
	$(data.player).setStyle({
		backgroundColor: game.getColor(data.player)
	});

});

socket.on('asd', function(data){
	console.log("Jogador: " + data.name + " comando: " + data.cmd);
	
	game.setDirection(data.name, data.cmd);
	
	
});
