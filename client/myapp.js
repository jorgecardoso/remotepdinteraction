var pdRemoteWidget = new PDRemoteWidget('http://localhost:8080', "myappid", "/remotewidget/index.html");

pdRemoteWidget.onRemoteWidgetNewUser = function (user) {
	console.log("User connected: " + user);
}

pdRemoteWidget.onRemoteWidgetUserDisconnected = function (user) {
	console.log("User disconnected: " + user);
}

pdRemoteWidget.onRemoteWidgetUserEvent = function (userEvent) {
	console.log("User event: ");
	console.log( userEvent);
}

pdRemoteWidget.onRemoteWidgetServerSettings = function (serverSettings) {
	console.log("Server settings: " + serverSettings);
	console.log(serverSettings.serverAddress);
}