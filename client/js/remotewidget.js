

var socket = io.connect('http://192.168.1.67:8080');
console.log("Connecting application socket. ");
socket.on('connect', function(){
	socket.emit('APP_READY', {id: "dsfsddfs"});

	
});

socket.on('USER_CONNECTED', function(data){
	console.log("User connected: " + data.userId );
	
	//onRemoteWidgetNewUser(data);
	

});

socket.on('USER_DISCONNECTED', function(data){
	console.log("User disconnected: " + data.userId );
	
	//onRemoteWidgetNewUser(data);
	

});

socket.on('NEW_USER', function(data){
	
	onRemoteWidgetNewUser(data);
	

});


socket.on('USER_EVENT', function(data){
	
	console.log(data);
	

});
