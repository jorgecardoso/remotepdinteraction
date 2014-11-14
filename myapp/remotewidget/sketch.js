var pdRemoteWidget;

var x, y;

var currentWidgetType;

var textWidgetTypeLastCaracters ="_";

function setup() {
    //loadImage()
    currentWidgetType = "TEXT";
    
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

    if ( currentWidgetType == 'TEXT' ) {
        fill(255);
        stroke(255);
        textSize(24);
        text(textWidgetTypeLastCaracters, width/2-textWidth(textWidgetTypeLastCaracters), height/2);
        //println(width/2-textWidth(textWidgetTypeLastCaracters));
        
    }
}

function touchStarted() {
    //pdRemoteWidget.sendUserEvent('Touch', {event: 'TouchStarted', x: touchX*1.0/width, y: touchY*1.0/height, touches: touches});
}
function touchMoved() {
    //pdRemoteWidget.sendUserEvent('Touch', {event: 'TouchMoved', x: touchX*1.0/width, y:touchY*1.0/height, touches: touches});
}
function touchEnded() {
    //pdRemoteWidget.sendUserEvent('Touch', {event: 'TouchEnded', x: touchX*1.0/width, y:touchY*1.0/height, touches: touches});
}

function mouseMoved() {
    pdRemoteWidget.sendUserEvent({type: 'Mouse', event: 'MouseMoved', value: {x: mouseX*1.0/width, y:mouseY*1.0/height}});
}

function keyTyped() {
    if (currentWidgetType == 'TEXT') {
        println(key);
        textWidgetTypeLastCaracters = textWidgetTypeLastCaracters + key;
        if ( textWidgetTypeLastCaracters.length > 20 ) {
            textWidgetTypeLastCaracters = textWidgetTypeLastCaracters.substr(1);
        }
        pdRemoteWidget.sendUserEvent({type:'Text', event: 'KeyTyped', value:{key: key}});
    }
}
