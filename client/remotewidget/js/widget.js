
var socket = io.connect('http://192.168.1.67:8080');

socket.on('connect', function(){
	socket.emit('USER_WIDGET_READY', {applicationId: "dsfsddfs"});
	//game = snakeGame("the-game");
	//game.start();
	
});

socket.on('APPLICATION_DISCONNECTED', function(data){
	console.log(data);
});

socket.on('ERROR', function(data){
	console.log(data);
});


function sendUserEvent(type, value) {
	socket.emit('USER_EVENT', {'type':type, 'value':value});
}