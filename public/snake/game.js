var snakeGame = function(el){ 

  var canvas = document.getElementById(el);
  var context = canvas.getContext("2d");
  var game, player, eat;
  var snakes = [];
  var can_move = [];
  var food = [];
  var players = {};

  game = {
    
    fps: 8,
    over: false,
    message: null,
    
    

    start: function() {
      console.log("start");
      game.over = false;
      game.message = null;
      //game.score = 0;
      game.fps = 8;
      for(var i=0; i<snakes.length; i++){
        snakes[i].init(i+2);
        can_move[i]=false;
      }
      /*snakes = [];
      can_move = [];
      food = [];*/
      
    },
    
    stop: function() {
      game.over = true;
      game.message = 'GAME OVER';
      for(var i=0; i < snakes.length; i++){
        //alert("Game Over");
        console.log("COBRA: " + snakes[i].id + " SCORE: " + snakes[i].score);
      }
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
  color: null, //'#0F0',
  direction: 'L',
  sections: [],
  id: null,
  score: 0,
  
  initialize: function(id, num) {
    this.id = id;
    this.init(num);
    this.getRandomColor();
  },

  init: function(num){

    this.sections = [];
    this.direction = 'L';
    this.score=0;
    this.x = Math.round(canvas.width / num + this.size / 2);
    this.y = Math.round(canvas.height / num + this.size / 2);
    for (var i = this.x + (5 * this.size); i >= this.x; i -= this.size) {
      this.sections.push(i + ',' + this.y); 
    }

  },

  getRandomColor: function() {
    var letters = '0123456789ABCDEF'.split('');
    this.color = '#';
    for (var i = 0; i < 6; i++ ) {
        this.color += letters[Math.floor(Math.random() * 16)];
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
        break;nooo
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
    
  for(var i = 0; i < food.length; i++){
    if (Math.abs(this.x-food[i].x)<=5 && Math.abs(this.y-food[i].y)<=5){ 
      this.score++;
      eat = true;
      if (this.score % 5 == 0 && game.fps < 60) {
        game.fps++;
      }
      food[i].set();
    } else {
      eat = false;
    }
  }
   if(eat==false)
      this.sections.shift();
  }
  
});


var Food = Class.create({

  size: null,
  x: null,
  y: null,
  color: '#0FF',
  snake: null,
  
  initialize: function(snake) {
      this.snake = snake;
  },

  
  
  set: function() {
    this.size = this.snake.size;
    this.x = 0;
    this.y = 0;
    while (this.x<=0 || this.y <=0) {

       this.x = (Math.ceil(Math.random() * 10) * this.snake.size * 4) - this.snake.size / 2;
      this.y = (Math.ceil(Math.random() * 10) * this.snake.size * 3) - this.snake.size / 2;
    }
  },
  
  draw: function() {
    game.drawBox(this.x, this.y, this.size, this.color);
  }
  
});

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
          if (game.over == false ) {
            game.resetCanvas();
            //game.drawScore();
            
            for(var i = 0; i < snakes.length; i++){
              console.log("NUM_COBRAS " + snakes[i]);
              if(can_move[i] == true){
                snakes[i].move();
              }

              food[i].draw();
              snakes[i].draw();
            }

            game.drawMessage();
          }
          setTimeout(function() {
            requestAnimationFrame(loop);
          }, 1000 / game.fps);
        }

        requestAnimationFrame(loop);
      },

  setPlayers: function(name){

    player = name;
    console.log("me: " + player);
    snakes.push(new Snake(snakes.length+1, snakes.length+2));
    players[player] = snakes.length;
    console.log("PLAYERS: " + players[player]);
    can_move.push(false);
    food.push(new Food(snakes[snakes.length-1]));
    food[snakes.length-1].set();

   

  },

  setDirection: function(player, dir){

   if(game.over)
      game.start();
    else {
      snakes[players[player]-1].direction=dir;
      console.log("COBRA: " + snakes[players[player]-1].id);
      can_move[players[player]-1] = true;
    }
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
