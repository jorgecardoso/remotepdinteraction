var pdRemoteWidget;

var x, y;

function setup() {
    createCanvas(displayWidth, displayHeight);
    
    pdRemoteWidget = new PDRemoteWidget('http://localhost:8080', "myappid");

	pdRemoteWidget.onRemoteWidgetApplicationReady = function (data) {
		console.log("Application ready: " + data);
	}

	pdRemoteWidget.onRemoteWidgetApplicationDisconnected = function (data) {
		console.log("Application disconnected: " + data);
	}

	pdRemoteWidget.onRemoteWidgetError = function (data) {
		console.log("Error: " + data);
	}
}

function draw() {
    background(0);
    fill(255, 0, 0)
    ellipse(x, y, 20, 20);
}

function touchStarted() {
    //pdRemoteWidget.sendUserEvent('Touch', {Event: 'TouchStarted', x: touchX*1.0/width, y: touchY*1.0/height, touches: touches});
}
function touchMoved() {
    //pdRemoteWidget.sendUserEvent('Touch', {Event: 'TouchMoved', x: touchX*1.0/width, y:touchY*1.0/height, touches: touches});
}
function touchEnded() {
    //pdRemoteWidget.sendUserEvent('Touch', {Event: 'TouchEnded', x: touchX*1.0/width, y:touchY*1.0/height, touches: touches});
}

function mouseMoved() {
    //pdRemoteWidget.sendUserEvent('Mouse', {Event: 'MouseMoved', x: mouseX*1.0/width, y:mouseY*1.0/height});
}

function keyTyped() {
    //println(key);
  pdRemoteWidget.sendUserEvent('Key', {Event: 'KeyTyped', key: key});
}
