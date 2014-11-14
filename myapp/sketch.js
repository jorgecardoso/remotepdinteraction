var PADDLE_WIDTH = 100;
var PADDLE_HEIGHT = 25;

var ballX, ballY;
var speedX, speeedY;

var pdRemoteWidget;

var usersOrder;
var myUsers = {};

var bottomPaddleX;


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

    text(lastKeyTyped, width / 2, height / 2);

    ballX = ballX + speedX;
    ballY = ballY + speedY;


    fill(255, 0, 0);
    stroke(0);
    ellipse(ballX, ballY, 30, 30);

    rectMode(CENTER);
    if (usersOrder.length > 0) { //bottom
        fill(myUsers[usersOrder[0]].color);
        rect(myUsers[usersOrder[0]].x, height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
        if (ballY > height - PADDLE_HEIGHT) {
            if (ballX > (myUsers[usersOrder[0]].x - PADDLE_WIDTH / 2) && ballX < (myUsers[usersOrder[0]].x + PADDLE_WIDTH / 2)) {
                speedY = -speedY;
                pdRemoteWidget.sendFeedback(usersOrder[0], "Vibration", [200]);
            }
        }
        if (ballY > height) {
            speedY = -speedY;
        }
    } else {
        if (ballY > height) {
            speedY = -speedY;
        }
    }
    if (usersOrder.length > 1) { //left
        fill(myUsers[usersOrder[1]].color);
        rect(PADDLE_HEIGHT, myUsers[usersOrder[1]].y, PADDLE_HEIGHT, PADDLE_WIDTH);
        if (ballX < PADDLE_HEIGHT) {
            if (ballY > (myUsers[usersOrder[1]].y - PADDLE_WIDTH / 2) && ballY < (myUsers[usersOrder[1]].y + PADDLE_WIDTH / 2)) {
                speedX = -speedX;
                pdRemoteWidget.sendFeedback(usersOrder[1], "Vibration", [200]);
            }
        }
        if (ballX < 0) {
            speedX = -speedX;
        }
    } else {
        if (ballX < 0) {
            speedX = -speedX;
        }
    }
    if (usersOrder.length > 2) { //top
        fill(myUsers[usersOrder[2]].color);
        rect(myUsers[usersOrder[2]].x, PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
        if (ballY < PADDLE_HEIGHT) {
            if (ballX > (myUsers[usersOrder[2]].x - PADDLE_WIDTH / 2) && ballY < (myUsers[usersOrder[2]].x + PADDLE_WIDTH / 2)) {
                speedY = -speedY;
                pdRemoteWidget.sendFeedback(usersOrder[2], "Vibration", [200]);
            }
        }
        if (ballY < 0) {
            speedY = -speedY;
        }
    } else {
        if (ballY < 0) {
            speedY = -speedY;
        }
    }
    if (usersOrder.length > 3) { //right
        fill(myUsers[usersOrder[3]].color);
        rect(width - PADDLE_HEIGHT, myUsers[usersOrder[3]].y, PADDLE_HEIGHT, PADDLE_WIDTH);
        if (ballX > width - PADDLE_HEIGHT) {
            if (ballY > (myUsers[usersOrder[3]].y - PADDLE_WIDTH / 2) && ballY < (myUsers[usersOrder[3]].y + PADDLE_WIDTH / 2)) {
                speedX = -speedX;
                pdRemoteWidget.sendFeedback(usersOrder[3], "Vibration", [200]);
            }
        }
        if (ballX > width) {
            speedX = -speedX;
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
    if (userEvent.data.type == "Text" && userEvent.data.event == "KeyTyped") {
        lastKeyTyped = userEvent.data.value.key;
        console.log(lastKeyTyped);

    } else if (userEvent.data.type == "Mouse" && userEvent.data.event == "MouseMoved") {
        myUsers[userEvent.userId].x = userEvent.data.value.x * width;
        myUsers[userEvent.userId].y = userEvent.data.value.y * height;
        //mymouseY = userEvent.data.value.y*height;
    } else if (userEvent.data.type == "Touch") { //&& userEvent.data.event == "TouchMoved") {
        myUsers[userEvent.userId].x = userEvent.data.value.x * width;
        myUsers[userEvent.userId].y = userEvent.data.value.y * height;
        //mymouseY = userEvent.data.value.y*height;
    }
}

function onRemoteWidgetServerSettings(serverSettings) {
    console.log("Server settings: " + serverSettings);
    console.log(serverSettings.serverAddress);
}