
function PDRemoteWidget (serverAddress, applicationId) {
    this.serverAddress = serverAddress;
    this.applicationId = applicationId;
    //this.onRemoteWidgetNewUser = undefined;
    this.onRemoteWidgetApplicationReady = undefined;
    this.onRemoteWidgetApplicationDisconnected = undefined;
	this.onRemoteWidgetError = undefined;
 
 	var socket = io.connect(this.serverAddress);

	socket.on('connect', function(){
		console.log('connect');
		socket.emit('USER_WIDGET_READY', {applicationId: this.applicationId});
	}.bind(this));


	socket.on('APPLICATION_READY', function(data){
		console.log('APPLICATION_READY');
		this.onRemoteWidgetApplicationReady(data)
		//sendUserEvent("KEYBOARD", "a");
	}.bind(this));


	socket.on('APPLICATION_DISCONNECTED', function(data){
		console.log('APPLICATION_DISCONNECTED');
		this.onRemoteWidgetApplicationDisconnected(data);
	}.bind(this));


	socket.on('ERROR', function(data){
		console.log('ERROR');
		this.onRemoteWidgetError(data);
	}.bind(this));


    this.sendUserEvent = function(type, value) {
		socket.emit('USER_EVENT', {'type':type, 'value':value});
	}

}
