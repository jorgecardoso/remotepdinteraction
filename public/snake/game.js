var snakeGame = function(el, players){ 

  var canvas = document.getElementById(el);
  var context = canvas.getContext("2d");
  var game,food;
  var snake = [];

  game = {
    
    score: 0,
    fps: 8,
    over: false,
    message: null,
    
    

    start: function() {
      console.log("start");
      game.over = false;
      game.message = null;
      game.score = 0;
      game.fps = 8;
      for(var i = 0; i < players; i++){
        snake.push(new Snake(i+1, i+2));
        console.log('COBRAid ' + snake[i].id);
      }
      
      //snake.init();
      //snake2.init();
      food.set();
    },
    
    stop: function() {
      game.over = true;
      game.message = 'GAME OVER - PRESS SPACEBAR';
    },
    
    drawBox: function(x, y, size, color) {
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(x - (size / 2), y - (size / 2));
      context.lineTo(x + (size / 2), y - (size / 2));
      context.lineTo(x + (size / 2), y + (size / 2));
      context.lineTo(x - (size / 2), y + (size / 2));
      context.closePath();
      context.fill();
    },
    
    drawScore: function() {
      context.fillStyle = '#999';
      context.font = (canvas.height) + 'px Impact, sans-serif';
      context.textAlign = 'center';
      context.fillText(game.score, canvas.width / 2, canvas.height * 0.9);
    },
    
    drawMessage: function() {
      if (game.message !== null) {
        context.fillStyle = '#00F';
        context.strokeStyle = '#FFF';
        context.font = (canvas.height / 10) + 'px Impact';
        context.textAlign = 'center';
        context.fillText(game.message, canvas.width / 2, canvas.height / 2);
        context.strokeText(game.message, canvas.width / 2, canvas.height / 2);
      }
    },
    
    resetCanvas: function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    
    
  };


var Snake = Class.create({
  
  size: canvas.width / 40,
  x: null,
  y: null,
  color: '#0F0',
  direction: 'L',
  sections: [],
  id: null,
  
  initialize: function(id, num) {
    this.id = id;
    this.sections = [];
    this.direction = 'L';
    this.x = canvas.width / num + this.size / 2;
    this.y = canvas.height / num + this.size / 2;
    for (var i = this.x + (5 * this.size); i >= this.x; i -= this.size) {
      this.sections.push(i + ',' + this.y); 
    }
  },
  
  move: function() {
    switch (this.direction) {
      case 'U':
        this.y -= this.size;
        break;
      case 'D':
        this.y += this.size;
        break;
      case 'L':
        this.x -= this.size;
        break;
      case 'R':
        this.x += this.size;
        break;
    }
    this.checkCollision();
    this.checkGrowth();
    this.sections.push(this.x + ',' + this.y);
  },
  
  draw: function() {
    for (var i = 0; i < this.sections.length; i++) {
      this.drawSection(this.sections[i].split(','));
    }    
  },
  
  drawSection: function(section) {
    game.drawBox(parseInt(section[0]), parseInt(section[1]), this.size, this.color);
  },
  
  checkCollision: function() {
    if (this.isCollision(this.x, this.y) === true) {
      game.stop();
    }
  },
  
  isCollision: function(x, y) {
    if (x < this.size / 2 ||
        x > canvas.width ||
        y < this.size / 2 ||
        y > canvas.height ||
        this.sections.indexOf(x + ',' + y) >= 0) {
      return true;
    }
  },
  
  checkGrowth: function() {
    if (this.x == food.x && this.y == food.y) {
      game.score++;
      if (game.score % 5 == 0 && game.fps < 60) {
        game.fps++;
      }
      food.set();
    } else {
      this.sections.shift();
    }
  }
  
}),


food = {
  
  size: null,
  x: null,
  y: null,
  color: '#0FF',
  
  set: function() {
    /*food.size = snake.size;
    food.x = (Math.ceil(Math.random() * 10) * snake.size * 4) - snake.size / 2;
    food.y = (Math.ceil(Math.random() * 10) * snake.size * 3) - snake.size / 2;*/
  },
  
  draw: function() {
    game.drawBox(food.x, food.y, food.size, food.color);
  }
  
};

inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};


return {
  start: function(){
        game.start();
        var requestAnimationFrame = window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame;

        function loop() {
          if (game.over == false) {
            game.resetCanvas();
            game.drawScore();
            //snake.move();
            food.draw();
            for(var i = 0; i < snake.length; i++){
              console.log("NUM_COBRAS " + snake[i]);
              snake[i].draw();
            };
            //snake2.move();
            food.draw();
            /*if(players > 1){
              console.log("jogadores " + players);
              snake2.draw();
            }*/
            game.drawMessage();
          }
          setTimeout(function() {
            requestAnimationFrame(loop);
          }, 1000 / game.fps);
        }

        requestAnimationFrame(loop);
      },
  setDirection: function(dir){
      if(game.over)
        game.start();
      //else
        //snake.direction=dir;
    },
}


};
/*
var keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_game: [13, 32]
};

function getKey(value){
  for (var key in keys){
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0){
      return key;
    }
  }
  return null;
}

addEventListener("keydown", function (e) {
    var lastKey = getKey(e.keyCode);
    if (['up', 'down', 'left', 'right'].indexOf(lastKey) >= 0
        && lastKey != inverseDirection[snake.direction]) {
      snake.direction = lastKey;
    } else if (['start_game'].indexOf(lastKey) >= 0 && game.over) {
      game.start();
    }
}, false);
*/
