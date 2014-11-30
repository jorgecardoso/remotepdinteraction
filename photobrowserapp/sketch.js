var PADDLE_WIDTH = 100;
var PADDLE_HEIGHT = 25;

var ballX, ballY;
var speedX, speeedY;

var pdRemoteWidget;

var usersOrder;
var myUsers = {};

var bottomPaddleX;


var lastKeyTyped;

var imagem;

function setup() {
    createCanvas(600, 600);
    pdRemoteWidget = new PDRemoteWidget('http://localhost:8080', "Photo Browser", "/remotewidget/index.html", "http://jorgecardoso.eu/temp/photobrowserapp/icon.jpg");
    pdRemoteWidget.onRemoteWidgetNewUser = onRemoteWidgetNewUser;

    pdRemoteWidget.onRemoteWidgetUserDisconnected = onRemoteWidgetUserDisconnected;
    pdRemoteWidget.onRemoteWidgetUserEvent = onRemoteWidgetUserEvent;
    pdRemoteWidget.onRemoteWidgetServerSettings = onRemoteWidgetServerSettings;

    mymouseX = 0;
    mymouseY = 0;

    ballX = width / 2;
    ballY = height / 2;
    speedX = 2;
    speedY = 2;

    usersOrder = Array();

    bottomPaddleX = width / 2;
    
}

function draw() {
    background(100);
    fill(0);
    stroke(0);

    //text(lastKeyTyped, width / 2, height / 2);

    if ( imagem !== undefined ) {
        image(imagem, (width-imagem.width)/2, (height-imagem.height)/2);
        
    }
    ballX = ballX + speedX;
    ballY = ballY + speedY;


    fill(255, 0, 0);
    stroke(0);
    ellipse(ballX, ballY, 30, 30);

    rectMode(CENTER);
    if (usersOrder.length > 0) { //bottom
        fill(myUsers[usersOrder[0]].color);
        rect(myUsers[usersOrder[0]].x, height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
        if (myUsers[usersOrder[0]].name !== undefined) {
            text(myUsers[usersOrder[0]].name, myUsers[usersOrder[0]].x - textWidth(myUsers[usersOrder[0]].name) / 2, height - PADDLE_HEIGHT);
        }
        if (ballY > height - PADDLE_HEIGHT) {
            if (ballX > (myUsers[usersOrder[0]].x - PADDLE_WIDTH / 2) && ballX < (myUsers[usersOrder[0]].x + PADDLE_WIDTH / 2)) {
                speedY = -speedY;
                pdRemoteWidget.sendFeedback(usersOrder[0], "Vibration", [200]);
            }
        }
        if (ballY > height) {
            speedY = -speedY;
        }
        if (myUsers[usersOrder[0]].touches !== undefined) {
            for (var i = 0; i < myUsers[usersOrder[0]].touches.length; i++) {
                ellipse(myUsers[usersOrder[0]].touches[i].x * width, myUsers[usersOrder[0]].touches[i].y * height, 20, 20);
            }
        }
    } else {
        if (ballY > height) {
            speedY = -speedY;
        }
    }
    if (usersOrder.length > 1) { //left
        fill(myUsers[usersOrder[1]].color);
        rect(PADDLE_HEIGHT, myUsers[usersOrder[1]].y, PADDLE_HEIGHT, PADDLE_WIDTH);
        if (myUsers[usersOrder[1]].name !== undefined) {
            //pushMatrix();
            translate(PADDLE_HEIGHT, myUsers[usersOrder[1]].y + textWidth(myUsers[usersOrder[1]].name) / 2);
            rotate(-HALF_PI);
            text(myUsers[usersOrder[1]].name, 0, 0);
            rotate(HALF_PI);
            translate(-PADDLE_HEIGHT, -(myUsers[usersOrder[1]].y + textWidth(myUsers[usersOrder[1]].name) / 2));
            //popMatrix();
        }
        if (ballX < PADDLE_HEIGHT) {
            if (ballY > (myUsers[usersOrder[1]].y - PADDLE_WIDTH / 2) && ballY < (myUsers[usersOrder[1]].y + PADDLE_WIDTH / 2)) {
                speedX = -speedX;
                pdRemoteWidget.sendFeedback(usersOrder[1], "Vibration", [200]);
            }
        }
        if (ballX < 0) {
            speedX = -speedX;
        }

        if (myUsers[usersOrder[1]].touches !== undefined) {
            for (var i = 0; i < myUsers[usersOrder[1]].touches.length; i++) {
                ellipse(myUsers[usersOrder[1]].touches[i].x * width, myUsers[usersOrder[1]].touches[i].y * height, 20, 20);
            }
        }

    } else {
        if (ballX < 0) {
            speedX = -speedX;
        }
    }
    if (usersOrder.length > 2) { //top
        fill(myUsers[usersOrder[2]].color);
        rect(myUsers[usersOrder[2]].x, PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
        if (myUsers[usersOrder[2]].name !== undefined) {
            text(myUsers[usersOrder[2]].name, myUsers[usersOrder[2]].x - textWidth(myUsers[usersOrder[2]].name) / 2, PADDLE_HEIGHT);
        }
        if (ballY < PADDLE_HEIGHT) {
            if (ballX > (myUsers[usersOrder[2]].x - PADDLE_WIDTH / 2) && ballY < (myUsers[usersOrder[2]].x + PADDLE_WIDTH / 2)) {
                speedY = -speedY;
                pdRemoteWidget.sendFeedback(usersOrder[2], "Vibration", [200]);
            }
        }
        if (ballY < 0) {
            speedY = -speedY;
        }
        if (myUsers[usersOrder[2]].touches !== undefined) {
            for (var i = 0; i < myUsers[usersOrder[2]].touches.length; i++) {
                ellipse(myUsers[usersOrder[2]].touches[i].x * width, myUsers[usersOrder[2]].touches[i].y * height, 20, 20);
            }
        }
    } else {
        if (ballY < 0) {
            speedY = -speedY;
        }
    }
    if (usersOrder.length > 3) { //right
        fill(myUsers[usersOrder[3]].color);
        rect(width - PADDLE_HEIGHT, myUsers[usersOrder[3]].y, PADDLE_HEIGHT, PADDLE_WIDTH);
        if (myUsers[usersOrder[3]].name !== undefined) {
            //pushMatrix();
            translate(width - PADDLE_HEIGHT, myUsers[usersOrder[3]].y + textWidth(myUsers[usersOrder[3]].name) / 2);
            rotate(-HALF_PI);
            text(myUsers[usersOrder[3]].name, 0, 0);    
            rotate(HALF_PI);
            translate(-(width - PADDLE_HEIGHT), -(myUsers[usersOrder[3]].y + textWidth(myUsers[usersOrder[3]].name) / 2));
            //popMatrix();
        }
        if (ballX > width - PADDLE_HEIGHT) {
            if (ballY > (myUsers[usersOrder[3]].y - PADDLE_WIDTH / 2) && ballY < (myUsers[usersOrder[3]].y + PADDLE_WIDTH / 2)) {
                speedX = -speedX;
                pdRemoteWidget.sendFeedback(usersOrder[3], "Vibration", [200]);
            }
        }
        if (ballX > width) {
            speedX = -speedX;
        }
        if (myUsers[usersOrder[3]].touches !== undefined) {
            for (var i = 0; i < myUsers[usersOrder[3]].touches.length; i++) {
                ellipse(myUsers[usersOrder[3]].touches[i].x * width, myUsers[usersOrder[3]].touches[i].y * height, 20, 20);
            }
        }
    } else {
        if (ballX > width) {
            speedX = -speedX;
        }
    }
}

function onRemoteWidgetNewUser(user) {
    console.log("User connected: " + JSON.stringify(user));

    if (usersOrder.indexOf(user.userId) >= 0) { // user already exists
        return;
    }
    c = color(random(255), random(255), random(255));
    if (usersOrder.length < 4) {
        pdRemoteWidget.sendFeedback(user.userId, "Color", [red(c), green(c), blue(c)]);
    }
    usersOrder.push(user.userId);
    myUsers[user.userId] = {};
    myUsers[user.userId].color = c;


    println(myUsers);
}

function onRemoteWidgetUserDisconnected(user) {
    console.log("User disconnected: " + user);
    index = usersOrder.indexOf(user.userId);

    if (index >= 0) {
        usersOrder.splice(index, 1);
    }


}

function onRemoteWidgetUserEvent(userEvent) {
    /*if (usersOrder.indexOf(userEvent.userId) < 0) {
        onRemoteWidgetNewUser({
            userId: userEvent.userId
        });
    }*/
    //console.log("User event: " + userEvent.userId + " " + userEvent.data.type + " " + userEvent.data.event);
    //console.log(userEvent);
    if (userEvent.data.type == "Keyboard") {
        if (userEvent.data.event == "KeyTyped") {
            //lastKeyTyped = userEvent.data.value.key;
            //console.log(lastKeyTyped);
            if (myUsers[userEvent.userId].name !== undefined) {
                myUsers[userEvent.userId].name += userEvent.data.value.key;
            } else {
                myUsers[userEvent.userId].name = userEvent.data.value.key;
            }
        } else if (userEvent.data.event == "KeySpecial" && userEvent.data.value.key == 'BACKSPACE') {
            if (myUsers[userEvent.userId].name !== undefined && myUsers[userEvent.userId].name.length > 0) {
                myUsers[userEvent.userId].name = myUsers[userEvent.userId].name.substring(0, myUsers[userEvent.userId].name.length - 1);
            }
        }

    } else if (userEvent.data.type == "Cursor") { //&& userEvent.data.event == "Moved") {
        myUsers[userEvent.userId].x = userEvent.data.value.x * width;
        myUsers[userEvent.userId].y = userEvent.data.value.y * height;
        myUsers[userEvent.userId].touches = userEvent.data.value.touches;
        //mymouseY = userEvent.data.value.y*height;
    } else if (userEvent.data.type == "Joystick" && userEvent.data.event == "Moved") {
        myUsers[userEvent.userId].x = (userEvent.data.value.axisX + 1) / 2.0 * width;
        myUsers[userEvent.userId].y = (userEvent.data.value.axisY + 1) / 2.0 * height;
        //mymouseY = userEvent.data.value.y*height;
    } else if (userEvent.data.type == "Joystick" && userEvent.data.event == "ButtonA") {
        if ( userEvent.data.event.pressed ) {
            myUsers[userEvent.userId].round = userEvent.data.event.pressed;
        }
    }
}

function onRemoteWidgetServerSettings(serverSettings) {
    console.log("Server settings: " + serverSettings);
    console.log(serverSettings);
    
    imagem = loadImage("https://chart.googleapis.com/chart?cht=qr&chl=" + encodeURIComponent(serverSettings.widgetUrl) + "&chs=200x200");
}