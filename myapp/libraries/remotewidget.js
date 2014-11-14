function PDRemoteWidget (serverAddress, applicationId, widgetRelativeUrl) {
    this.serverAddress = serverAddress;
    this.applicationId = applicationId;
    this.onRemoteWidgetNewUser = undefined;
    
    /*
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };
    */
    
    this.sendFeedback = function(userId, type, value) {
        socket.emit('FEEDBACK', {userId: userId, type: type, value:value});
    }
    
	var socket = io.connect( this.serverAddress);

	console.log("Connecting application socket. ");
	
	socket.on('connect', function(){
		var url = window.location.href;
		var filename = url.substring(0, url.lastIndexOf('/')) + widgetRelativeUrl;
	

		socket.emit('APP_READY', {id: this.applicationId, widgetUrl:filename});

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
	
		//console.log('USER_EVENT');
		this.onRemoteWidgetUserEvent(data);

	}.bind(this));
	
	

}
