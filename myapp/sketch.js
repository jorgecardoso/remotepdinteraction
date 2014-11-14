var pdRemoteWidget;

var lastKeyTyped;
var mymouseX, mymouseY;

function setup() {
    createCanvas(600, 600);
    pdRemoteWidget = new PDRemoteWidget('http://localhost:8080', "myappid", "/remotewidget/index.html");
    pdRemoteWidget.onRemoteWidgetNewUser = onRemoteWidgetNewUser;
    
    pdRemoteWidget.onRemoteWidgetUserDisconnected = onRemoteWidgetUserDisconnected;
    pdRemoteWidget.onRemoteWidgetUserEvent = onRemoteWidgetUserEvent;
    pdRemoteWidget.onRemoteWidgetServerSettings = onRemoteWidgetServerSettings;

    mymouseX = 0;
    mymouseY = 0;
}

function draw() {
    background(255);
    fill(0);
    stroke(0);
    
    text(lastKeyTyped, width/2, height/2);
    
    fill(255, 0, 0);
    stroke(0);
    ellipse(mymouseX, mymouseY, 30, 30);
}

function onRemoteWidgetNewUser(user) {
    console.log("User connected: " + user);
}

function onRemoteWidgetUserDisconnected (user) {
    console.log("User disconnected: " + user);
}

function onRemoteWidgetUserEvent(userEvent) {
    console.log("User event: "+ userEvent.data.type + " " + userEvent.data.event);
    //console.log(userEvent);
    if (userEvent.data.type == "Text" && userEvent.data.event == "KeyTyped") {
        lastKeyTyped = userEvent.data.value.key;
        console.log(lastKeyTyped);
        
    } else if (userEvent.data.type == "Mouse" && userEvent.data.event == "MouseMoved") {
        mymouseX = userEvent.data.value.x*width;
        mymouseY = userEvent.data.value.y*height;
    }
}

function onRemoteWidgetServerSettings(serverSettings) {
    console.log("Server settings: " + serverSettings);
    console.log(serverSettings.serverAddress);
}