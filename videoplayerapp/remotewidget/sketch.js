var controlTypes = ["Joystick", "Cursor", "Keyboard"];

var controlButtonHeight = 100;

var pdRemoteWidget;
var backgroundColor;
var x, y;

var currentWidgetType;

var textWidgetTypeLastCaracters = "_";

var canvas;

/*
 * Cursor
 */
var cursorXMin;
var cursorYMin;
var cursorXMax;
var cursorYMax;
var cursorImage;

/*
 * Joystick
 */
var joystickMainCircleDiameter;
var joystickSmallCircleDiameter;
var joystickHandleDiameter;
var joystickHandleX;
var joystickHandleY;
var joystickAButtonX, joystickAButtonY;
var joystickBButtonX, joystickBButtonY;
var joystickCButtonX, joystickCButtonY;
var joystickMoving;
var joystickImage;

/**
 * Keyboard
 */
var keyboardImage;
var keyboardInput;


var controlButtonWidth;

function setup() {
    //loadImage()
    backgroundColor = color(255, 0, 0);
    println(backgroundColor);
    currentWidgetType = 'Joystick';

    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.canvas.setAttribute("tabIndex", '0');
    canvas.canvas.setAttribute("contenteditable", 'true');
    controlButtonWidth = width / controlTypes.length;

    joystickImage = loadImage("images/joystick.jpg");
    cursorImage = loadImage("images/cursor.png");
    keyboardImage = loadImage("images/keyboard.png");

    pdRemoteWidget = new PDRemoteWidget(getUrlVars()["serverAddress"], getUrlVars()["applicationId"]);

    pdRemoteWidget.onRemoteWidgetApplicationReady = function(data) {
        console.log("Application ready: " + JSON.stringify(data));
    }

    pdRemoteWidget.onRemoteWidgetApplicationDisconnected = function(data) {
        console.log("Application disconnected: " + JSON.stringify(data));
    }

    pdRemoteWidget.onRemoteWidgetError = function(data) {
        console.log("Error: " + JSON.stringify(data));

    }
    pdRemoteWidget.onRemoteWidgetFeedback = function(data) {
        console.log("Feedback: " + JSON.stringify(data));
        if (data.type == "Color") {
            backgroundColor = color(data.value[0], data.value[1], data.value[2]);
            console.log(backgroundColor);
        } else if (data.type == "Vibration") {
            window.navigator.vibrate(data.value);
        }
    }
    initJoystick();
    initCursor();
    initKeyboard();
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}


function draw() {
    background(backgroundColor);

    /*
        draw the control type selection buttons at the top
    */
    
    for (var i = 0; i < controlTypes.length; i++) {
        stroke(0);
        strokeWeight(1);
        fill(255);
        if (controlTypes[i] == currentWidgetType) {
            strokeWeight(3);
            fill(255, 200, 200);
        }
        rect(i * controlButtonWidth, 0, controlButtonWidth, controlButtonHeight);
        if (controlTypes[i] == "Joystick") {
            if (joystickImage !== undefined) {
                scale = joystickImage.width / joystickImage.height;
                image(joystickImage, (controlButtonWidth - scale * controlButtonHeight) / 2, 0, scale * controlButtonHeight, controlButtonHeight);
            }
        }
        if (controlTypes[i] == "Cursor") {
            if (cursorImage !== undefined) {
                scale = cursorImage.width / cursorImage.height;
                image(cursorImage, i*controlButtonWidth+(controlButtonWidth - scale * controlButtonHeight) / 2, 0, scale * controlButtonHeight, controlButtonHeight);
            }
        }
                if (controlTypes[i] == "Keyboard") {
            if (keyboardImage !== undefined) {
                scale = keyboardImage.width / keyboardImage.height;
                if ( scale*controlButtonHeight > controlButtonWidth ) {
                    image(keyboardImage, i*controlButtonWidth, (controlButtonHeight-controlButtonHeight/scale)/2, controlButtonWidth, controlButtonHeight/scale);
                } else {
                    image(keyboardImage, i*controlButtonWidth+(controlButtonWidth - scale * controlButtonHeight) / 2, 0, scale * controlButtonHeight, controlButtonHeight);
                }
            }
        }
        strokeWeight(1);
        //text(controlTypes[i], i * controlButtonWidth, controlButtonHeight / 2);

    }

    //console.log(backgroundColor);
    if (currentWidgetType == 'Keyboard') {

        fill(255);
        stroke(0);
        textSize(24);
        text(textWidgetTypeLastCaracters, width / 2 - textWidth(textWidgetTypeLastCaracters), height / 2);
        //println(width/2-textWidth(textWidgetTypeLastCaracters));

    } else if (currentWidgetType == 'Cursor') {

        noFill();
        rect(cursorXMin, cursorYMin, cursorXMax - cursorXMin, cursorYMax - cursorYMin);

    } else if (currentWidgetType == 'Joystick') {

        drawJoystick();

    }

    //feedback for last touch
    stroke(0);
    strokeWeight(1);
    fill(255, 255, 255, 100);
    ellipse(x, y, 60, 60);
    line(x - 30, y, x + 30, y);
    line(x, y - 30, x, y + 30);

    for (var i = 0; i < touches.length; i++) {
        stroke(0);
        strokeWeight(1);
        fill(255, 255, 255, 100);
        ellipse(touches[i].x, touches[i].y, 60, 60);
    }

    //text(currentWidgetType, width / 2, height / 2);

}

function initKeyboard() {
    keyboardInput = getElement("keyboardInputElement");
   // keyboardInput.elt.onkeydown=p5.prototype.onkeydown;
   //keyboardInput.elt.addEventListener("keypress", function(event) {
       
   //});
    keyboardInput = createInput(100);
    keyboardInput.elt.style.position="absolute";
    keyboardInput.elt.style.left = 10+"px";
    keyboardInput.elt.style.top = (controlButtonWidth+10)+"px";
    keyboardInput.elt.style.width = (width-20)+"px";
}

function initCursor() {
    cursorXMin = 5;
    cursorYMin = controlButtonHeight + 5;
    cursorXMax = width - 5;
    cursorYMax = height - 5;

}

function initJoystick() {
    joystickMainCircleDiameter = min(width, height) / 3;
    joystickSmallCircleDiameter = joystickMainCircleDiameter / 3;
    joystickHandleDiameter = joystickSmallCircleDiameter;
    joystickHandleX = 2 * width / 3;
    joystickHandleY = 2 * height / 3;
    joystickMoving = false;
    joystickAButtonX = width / 4;
    joystickAButtonY = 2 * height / 3 - 100;
    joystickBButtonX = width / 4;
    joystickBButtonY = 2 * height / 3;
    joystickCButtonX = width / 4;
    joystickCButtonY = 2 * height / 3 + 100;
}

function drawJoystick() {
    noFill();
    stroke(0);


    ellipse(2 * width / 3, 2 * height / 3, joystickMainCircleDiameter, joystickMainCircleDiameter);

    //up
    ellipse(2 * width / 3, 2 * height / 3 - joystickMainCircleDiameter / 2, joystickSmallCircleDiameter, joystickSmallCircleDiameter);

    //right
    ellipse(2 * width / 3 + joystickMainCircleDiameter / 2, 2 * height / 3, joystickSmallCircleDiameter, joystickSmallCircleDiameter);

    //down
    ellipse(2 * width / 3, 2 * height / 3 + joystickMainCircleDiameter / 2, joystickSmallCircleDiameter, joystickSmallCircleDiameter);

    //left
    ellipse(2 * width / 3 - joystickMainCircleDiameter / 2, 2 * height / 3, joystickSmallCircleDiameter, joystickSmallCircleDiameter);


    //joystick handle
    if (joystickMoving) {
        fill(255, 200, 200);
    } else {
        noFill();
    }
    ellipse(joystickHandleX, joystickHandleY, joystickHandleDiameter, joystickHandleDiameter);

    // A B C buttons
    noFill();
    ellipse(joystickAButtonX, joystickAButtonY, 50, 50);
    text("A", joystickAButtonX, joystickAButtonY);

    ellipse(joystickBButtonX, joystickBButtonY, 50, 50);
    text("B", joystickBButtonX, joystickBButtonY);

    ellipse(joystickCButtonX, joystickCButtonY, 50, 50);
    text("C", joystickCButtonX, joystickCButtonY);
}

function touchStarted() {
    /*
     check if control type button selection
    */
    var controlButtonWidth = width / controlTypes.length;
    var buttonSelection = false;
    for (var i = 0; i < controlTypes.length; i++) {
        if (touchY < controlButtonHeight && touchX > i * controlButtonWidth && touchX < (i + 1) * controlButtonWidth) {
            currentWidgetType = controlTypes[i];
            buttonSelection = true;
            if (currentWidgetType == 'Keyboard') {
                //canvas.canvas.setAttribute("contenteditable", 'true');
                //canvas.canvas.blur();
                //canvas.canvas.focus();
               
                
            } else {
                //canvas.canvas.setAttribute("contenteditable", 'false');
                //canvas.canvas.blur();
            }
            break;
        }
    }
    if (!buttonSelection) {
        if (currentWidgetType == 'Joystick') {
            for (var i = 0; i < touches.length; i++) {
                if (dist(touches[i].x, touches[i].y, joystickHandleX, joystickHandleY) < joystickMainCircleDiameter / 2) {
                    joystickMoving = true;

                    joystickHandleX = constrain(touches[i].x, 2 * width / 3 - joystickMainCircleDiameter / 2, 2 * width / 3 + joystickMainCircleDiameter / 2);
                    joystickHandleY = constrain(touches[i].y, 2 * height / 3 - joystickMainCircleDiameter / 2, 2 * height / 3 + joystickMainCircleDiameter / 2);

                    joystickX = map(joystickHandleX, 2 * width / 3 - joystickMainCircleDiameter / 2, 2 * width / 3 + joystickMainCircleDiameter / 2, -1, 1);
                    joystickY = map(joystickHandleY, 2 * height / 3 - joystickMainCircleDiameter / 2, 2 * height / 3 + joystickMainCircleDiameter / 2, -1, 1);

                    pdRemoteWidget.sendUserEvent({
                        type: 'Joystick',
                        event: 'Moved',
                        value: {
                            axisX: joystickX,
                            axisY: joystickY
                        }
                    });


                }
                if (dist(touches[i].x, touches[i].y, joystickAButtonX, joystickAButtonY) < 50) {
                    pdRemoteWidget.sendUserEvent({
                        type: 'Joystick',
                        event: 'ButtonA',
                        value: {
                            pressed: true
                        }
                    });
                }
            }



        } else if (currentWidgetType == 'Cursor') {
            xt = constrain(touchX, cursorXMin, cursorXMax);
            xt = map(xt, cursorXMin, cursorXMax, 0, 1);
            yt = constrain(touchY, cursorYMin, cursorYMax);
            yt = map(yt, cursorYMin, cursorYMax, 0, 1);

            pdRemoteWidget.sendUserEvent({
                type: 'Cursor',
                event: 'Started',
                value: {
                    x: xt,
                    y: yt,
                    touches: normalizeTouches(touches)
                }
            });
            x = touchX;
            y = touchY;
        } else if (currentWidgetType == 'Keyboard') {


        }
    }
}

function touchMoved() {
    if (currentWidgetType == 'Cursor') {
        xt = constrain(touchX, cursorXMin, cursorXMax);
        xt = map(xt, cursorXMin, cursorXMax, 0, 1);
        yt = constrain(touchY, cursorYMin, cursorYMax);
        yt = map(yt, cursorYMin, cursorYMax, 0, 1);

        pdRemoteWidget.sendUserEvent({
            type: 'Cursor',
            event: 'Moved',
            value: {
                x: xt,
                y: yt,
                touches: normalizeTouches(touches)
            }
        });
        x = touchX;
        y = touchY;
    } else if (currentWidgetType == 'Joystick') {

        joystickMoving = false;
        for (var i = 0; i < touches.length; i++) {
            if (dist(touches[i].x, touches[i].y, joystickHandleX, joystickHandleY) < joystickHandleDiameter / 2) {
                joystickMoving = true;

                joystickHandleX = constrain(touches[i].x, 2 * width / 3 - joystickMainCircleDiameter / 2, 2 * width / 3 + joystickMainCircleDiameter / 2);
                joystickHandleY = constrain(touches[i].y, 2 * height / 3 - joystickMainCircleDiameter / 2, 2 * height / 3 + joystickMainCircleDiameter / 2);

                joystickX = map(joystickHandleX, 2 * width / 3 - joystickMainCircleDiameter / 2, 2 * width / 3 + joystickMainCircleDiameter / 2, -1, 1);
                joystickY = map(joystickHandleY, 2 * height / 3 - joystickMainCircleDiameter / 2, 2 * height / 3 + joystickMainCircleDiameter / 2, -1, 1);

                pdRemoteWidget.sendUserEvent({
                    type: 'Joystick',
                    event: 'Moved',
                    value: {
                        axisX: joystickX,
                        axisY: joystickY
                    }
                });

                break;
            }
        }

    }
}

function touchEnded() {
    if (currentWidgetType == 'Joystick') {
        if (touches.length < 1) {
            initJoystick();
        }
    } else if (currentWidgetType == 'Cursor') {


        xt = constrain(touchX, cursorXMin, cursorXMax);
        xt = map(xt, cursorXMin, cursorXMax, 0, 1);
        yt = constrain(touchY, cursorYMin, cursorYMax);
        yt = map(yt, cursorYMin, cursorYMax, 0, 1);
        pdRemoteWidget.sendUserEvent({
            type: 'Cursor',
            event: 'Ended',
            value: {
                x: xt,
                y: yt,
                touches: normalizeTouches(touches)
            }
        });

        x = touchX;
        y = touchY;
    }


}


function mousePressed() {
    /*
     check if control type button selection
    */
    var controlButtonWidth = width / controlTypes.length;
    var buttonSelection = false;
    for (var i = 0; i < controlTypes.length; i++) {
        if (mouseY < controlButtonHeight && mouseX > i * controlButtonWidth && mouseX < (i + 1) * controlButtonWidth) {
            currentWidgetType = controlTypes[i];
            buttonSelection = true;
        }
    }
    if (!buttonSelection) {
        if (currentWidgetType == 'Joystick') {

            if (dist(mouseX, mouseY, joystickHandleX, joystickHandleY) < joystickHandleDiameter / 2) {
                joystickMoving = true;
                joystickHandleX = mouseX;
                joystickHandleY = mouseY;

            }
        } else if (currentWidgetType == 'Cursor') {
            pdRemoteWidget.sendUserEvent({
                type: 'Cursor',
                event: 'Started',
                value: {
                    x: mouseX * 1.0 / width,
                    y: mouseY * 1.0 / height
                }
            });
            x = mouseX;
            y = mouseY;
        }
    }
}

function mouseMoved() {
    x = mouseX;
    y = mouseY;
    if (currentWidgetType == 'Cursor') {
        pdRemoteWidget.sendUserEvent({
            type: 'Cursor',
            event: 'Moved',
            value: {
                x: mouseX * 1.0 / width,
                y: mouseY * 1.0 / height
            }
        });
        x = mouseX;
        y = mouseY;
    }
}

function mouseDragged() {
    x = mouseX;
    y = mouseY;
    if (currentWidgetType == 'Cursor') {
        pdRemoteWidget.sendUserEvent({
            type: 'Cursor',
            event: 'Moved',
            value: {
                x: mouseX * 1.0 / width,
                y: mouseY * 1.0 / height
            }
        });
        x = mouseX;
        y = mouseY;
    } else if (currentWidgetType == 'Joystick') {
        if (joystickMoving) {
            joystickMoving = false;
            if (dist(mouseX, mouseY, joystickHandleX, joystickHandleY) < joystickHandleDiameter / 2) {
                joystickMoving = true;
                joystickHandleX = constrain(mouseX, 2 * width / 3 - joystickMainCircleDiameter / 2, 2 * width / 3 + joystickMainCircleDiameter / 2);
                joystickHandleY = constrain(mouseY, 2 * height / 3 - joystickMainCircleDiameter / 2, 2 * height / 3 + joystickMainCircleDiameter / 2);

                joystickX = map(joystickHandleX, 2 * width / 3 - joystickMainCircleDiameter / 2, 2 * width / 3 + joystickMainCircleDiameter / 2, -1, 1);
                joystickY = map(joystickHandleY, 2 * height / 3 - joystickMainCircleDiameter / 2, 2 * height / 3 + joystickMainCircleDiameter / 2, -1, 1);

                pdRemoteWidget.sendUserEvent({
                    type: 'Joystick',
                    event: 'Moved',
                    value: {
                        axisX: joystickX,
                        axisY: joystickY
                    }
                });
            }
        }
    }
}

function normalizeTouches(touchesUnnormalized) {
    nTouches = Array();
    if (touchesUnnormalized !== undefined) {
        for (var i = 0; i < touchesUnnormalized.length; i++) {
            xt = constrain(touchesUnnormalized[i].x, cursorXMin, cursorXMax);
            yt = constrain(touchesUnnormalized[i].y, cursorYMin, cursorYMax);

            xt = map(xt, cursorXMin, cursorXMax, 0, 1);
            yt = map(yt, cursorYMin, cursorYMax, 0, 1);

            nTouches[i] = {
                x: xt,
                y: yt
            };
        }
        return nTouches;
    }

}

function mouseReleased() {
    initJoystick();
}

function keyPressed() {
    if (currentWidgetType == 'Keyboard') {
        var keyName = "";
        if (keyCode === LEFT_ARROW) {
            keyName = 'LEFT_ARROW';
        } else if (keyCode === RIGHT_ARROW) {
            keyName = 'RIGHT_ARROW';
        } else if (keyCode === BACKSPACE) {
            keyName = 'BACKSPACE';
        }
        pdRemoteWidget.sendUserEvent({
            type: 'Keyboard',
            event: 'KeySpecial',
            value: {
                key: keyName
            }
        });
    }
}

function keyTyped() {
    if (currentWidgetType == 'Keyboard') {
        println(key);
        textWidgetTypeLastCaracters = textWidgetTypeLastCaracters + key;
        if (textWidgetTypeLastCaracters.length > 20) {
            textWidgetTypeLastCaracters = textWidgetTypeLastCaracters.substr(1);
        }
        pdRemoteWidget.sendUserEvent({
            type: 'Keyboard',
            event: 'KeyTyped',
            value: {
                key: key
            }
        });
    }
}