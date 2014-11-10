function PDRemoteWidget (serverAddress, applicationId) {
    this.serverAddress = serverAddress;
    this.applicationId = applicationId;
    this.onRemoteWidgetNewUser = undefined;
    
    /*
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };
    */
    
	var socket = io.connect( this.serverAddress);

	console.log("Connecting application socket. ");
	
	socket.on('connect', function(){
		socket.emit('APP_READY', {id: this.applicationId});

	}.bind(this));
	
	socket.on('SERVER_SETTINGS', function(data){
		console.log("SERVER_SETTINGS");
	
		this.onRemoteWidgetServerSettings(data);
	
	}.bind(this));	
	

	socket.on('USER_CONNECTED', function(data){
		console.log("USER_CONNECTED");
	
		this.onRemoteWidgetNewUser(data);
	
	}.bind(this));

	socket.on('USER_DISCONNECTED', function(data){
		console.log("USER_DISCONNECTED");
	
		this.onRemoteWidgetUserDisconnected(data);
	

	}.bind(this));




	socket.on('USER_EVENT', function(data){
	
		console.log('USER_EVENT');
		this.onRemoteWidgetUserEvent(data);

	}.bind(this));

}
