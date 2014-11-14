var pdRemoteWidget;
var backgroundColor;
var x, y;

var currentWidgetType;

var textWidgetTypeLastCaracters ="_";

function setup() {
    //loadImage()
    backgroundColor = color(255, 0, 0);
    println(backgroundColor);
    currentWidgetType = "TEXT";
    
    createCanvas(window.innerWidth, window.innerHeight);
    
    pdRemoteWidget = new PDRemoteWidget(getUrlVars()["serverAddress"], getUrlVars()["applicationId"]);

	pdRemoteWidget.onRemoteWidgetApplicationReady = function (data) {
		console.log("Application ready: " + JSON.stringify(data));
	}

	pdRemoteWidget.onRemoteWidgetApplicationDisconnected = function (data) {
		console.log("Application disconnected: " + JSON.stringify(data));
	}

	pdRemoteWidget.onRemoteWidgetError = function (data) {
		console.log("Error: " + JSON.stringify(data));
		
	}
	pdRemoteWidget.onRemoteWidgetFeedback = function (data) {
		console.log("Feedback: " + JSON.stringify(data));
		if ( data.type == "Color") {
		    backgroundColor = color(data.value[0], data.value[1], data.value[2]);
		    console.log(backgroundColor);
		} else if (data.type == "Vibration") {
		    window.navigator.vibrate(data.value);
		}
	}
}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


function draw() {
    background(backgroundColor);
    //console.log(backgroundColor);
    if ( currentWidgetType == 'TEXT' ) {
        fill(255);
        stroke(255);
        textSize(24);
        text(textWidgetTypeLastCaracters, width/2-textWidth(textWidgetTypeLastCaracters), height/2);
        //println(width/2-textWidth(textWidgetTypeLastCaracters));
        
    }
    
    //feedback for last touch
    stroke(0);
    fill(255, 255, 255, 100);
    ellipse(x, y, 60, 60);
    line(x-30, y, x+30, y);
    line(x, y-30, x, y+30);
    
}

function touchStarted() {
    pdRemoteWidget.sendUserEvent({type: 'Touch', event: 'TouchStarted', value: {x: touchX*1.0/width, y: touchY*1.0/height, touches: touches}});
    x = touchX;
    y = touchY;
}
function touchMoved() {
    pdRemoteWidget.sendUserEvent({type: 'Touch', event: 'TouchMoved', value:{x: touchX*1.0/width, y:touchY*1.0/height, touches: touches}});
    x = touchX;
    y = touchY;
}
function touchEnded() {
    pdRemoteWidget.sendUserEvent({type: 'Touch', event: 'TouchEnded', value:{x: touchX*1.0/width, y:touchY*1.0/height, touches: touches}});
    x = touchX;
    y = touchY;
}

function mouseMoved() {
    pdRemoteWidget.sendUserEvent({type: 'Mouse', event: 'MouseMoved', value: {x: mouseX*1.0/width, y:mouseY*1.0/height}});
    x = mouseX;
    y = mouseY;
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
