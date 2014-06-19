
/**
  * @module Widget
  */
;(function(window, document) {

	var socket,
	
	/**	
	  * Define the used port
	  *
	  * @property DEFAULT_PORT
	  * @type String
	  * @defaul 8080
	  *
 	  */
	DEFAULT_PORT=8080,
	

	/**
	  * 
	  * @property DIRECTION
	  * @type String
	  * @default "DIRECTION"
	  *
 	  */
	DIRECTION = "DIRECTION",

	/**
	  * @property TEXT
	  * @type String
	  * @default "TEXT"
 	  */
	TEXT = "TEXT",

	/**
	  * @property SWIPE
	  * @type String
	  * @default "SWIPE"
 	  */
	SWIPE = "SWIPE",

	/**
	  * @property NAME
	  * @type String
	  * @default "SET_NAME"
 	  */
	SET_NAME = "SET_NAME",

	/**
	  * @property READY
	  * @type String
	  * @default "CLIENT_READY"
 	  */
	READY = "CLIENT_READY",

	/**
	  * Define the user's name  
	  * @property user_name
	  * @type String
 	  */
	user_name = null,

	
	DEFAULT_OPTIONS = {
		widgetbar : true,
		
		/**
		  * @property LEFT
		  * @type String
		  * @default "L"
	 	  */
		LEFT : "L",

		/**
		  * @property RIGHT
		  * @type String
		  * @default R
	 	  */
		RIGHT : "R",

		/**
		  * @property UP
		  * @type String
	 	  * @default U
	 	  */
		UP : "U",

		/**
		  * @property DOWN
		  * @type String
		  * @default D
	 	  */
		DOWN : "D"
	};	

	/** 
	  * 
	  * @method start
	  * @param url {String} html element
	  */
	function start(url, options){
	
		DEFAULT_OPTIONS = Object.extend(DEFAULT_OPTIONS, options);
		socket = io.connect(url);
		
	}

	/** Method to define the user's name and 
	  * @method ready
	  */
	function ready(){

		socket.emit(SET_NAME, {});
		socket.on('NAME', function(data){

			user_name = data.names;

			socket.emit('CLIENT_READY',{ id: "dsfsddfs", name: data.names});

		});

		
	} 

	/** 
	  * Draw the bar with the widget icons in a html element
	  *
	  * @method drawBar
	  * @param elem {String} html element
	  */
	function drawBar(elem){
		var ul = new Element('ul', {'id': 'my_widgets'});
		$(elem).appendChild(ul);
	}

	/** 
	  * Method to change de default options
	  *
	  * @method drawBar
	  * @param elem {String} html element
	  */
	function setOptions(options){

		DEFAULT_OPTIONS = Object.extend(DEFAULT_OPTIONS, options);

	}

	/** 
	  * Abstract class to construct a widget
	  * 
      * @class Widget
      * @constructor
 	  */
	var Widget = Class.create({
		
		/**
		  * @property socket
		  * @type 
		  */
		socket: null,
		
		/**
		  * @property id
		  * @type String
		  */
		id: null,
		

		/** 
		  * Method 
		  * @method handleResponse
		  */
		handleResponse: function(){

			
			socket.on('connect', function(data){
				//socket.emit('i am client', {data: 'foo!'});
				console.log("estou aqui");
				//onReceiveText(data);
			});

			socket.on('START', function(data){
				//socket.emit('i am client', {data: 'foo!'});
				//alert("START " + data.players);
				//onReceiveText(data);
			});

			
		},

		/** 
		  * Method that initialize a widget
		  * 
		  * @method initialize
		  * @param elem {String} widget element
		  * @param id {String} widget id
		  */
		initialize: function (elem, id){

			this.id=id;
			
			this.handleResponse();
		},

		/** 
		  * Send to the server the widget's controls
		  * @method sendToServer
		  * @param key {String} 
		  * @param obj {}  
		  */
		sendToServer: function(key, obj){
			var payload = {};
			payload.id=this.id;
			payload.cmd=obj;
			payload.name=user_name;
			//this.user_name = payload.cmd;
			socket.emit(key,payload);
			console.log("emit "+key+" "+ payload.cmd);
		},

		/** 
		  * Send to the server the direction
		  * @method sendDirection
		  * @param dir {String} widget direction
		  */
		sendDirection: function(dir){
			this.sendToServer(DIRECTION,dir);
		},

		/** 
		  * Used to send to the server the text wroten in the text box 
		  * @method sendText
		  * @param str {String} input text
		  */
		sendText: function(str){
			this.sendToServer(TEXT,str);
		},

		/** 
		  * Used to send to the server the swipe's direction
		  * @method sendSwipe
		  * @param dir {String} swipe direction
		  */
		sendSwipe: function(dir){
			this.sendToServer(SWIPE, dir);	
		},

		/** 
		  * Responsible for draw the widget
		  * @method draw
		  * @param elem {String} html element
		  */
		draw: function(elem) {},

		/**
		  * 
		  * @method handleInput
		  */
		handleInput: function() {},

		/** 
		  * Allow to add a widget icon 
		  * @method addWidget
		  * @param elem {String} html element
		  */
		addWidget: function(elem){

		},

		setOptions: function(options){

		}
	})

	
	/** 
	  * Class to create a joystick widget
	  *
      * @class Joystick
      * @constructor
      * @extends Widget
 	  */
	var Joystick = Class.create(Widget, {
		
		/** 
		  * Responsible to show the widget
		  * @method draw
		  * @param elem {String} html element
		  */
		draw: function(elem){

		var imgArray = new Array();

		imgArray[0] = new Image();
		imgArray[0].src = 'images/left_key.png';

		imgArray[1] = new Image();
		imgArray[1].src = 'images/down_key.png';

		imgArray[2] = new Image();
		imgArray[2].src = 'images/right_key.png';

		imgArray[3] = new Image();
		imgArray[3].src = 'images/up_key.png';

		var divTop = new Element('div', { 'id': 'toTop'});
		$$(elem)[0].appendChild(divTop);
        var img = new Element('img', {'id': 'up_key'});
        img.src = imgArray[3].src;

        divTop.appendChild(img);
        
		
        var divDown = new Element('div', { 'id': 'toDown'});
        $$(elem)[0].appendChild(divDown);
		var ids = ["left_key", "down_key", "right_key"];

    		for(var i = 0; i<imgArray.length-1; i++){

                var img = new Element('img', {'id': ids[i]});
                img.src = imgArray[i].src;
               	divDown.appendChild(img);
				
             }
        this.handleInput();
    	},

    	/** 
    	  * Define the events for joystick buttons 
    	  *
		  * @method handleInput
		  */
    	handleInput: function() {
    		var that = this;

    		$('up_key').on('click',function(){
    			that.sendDirection(DEFAULT_OPTIONS.UP);
    		});

    		$('right_key').on('click',function(){
    			that.sendDirection(DEFAULT_OPTIONS.RIGHT);
    		});

    		$('down_key').on('click',function(){
    			that.sendDirection(DEFAULT_OPTIONS.DOWN);
    		});

    		$('left_key').on('click',function(){
    			that.sendDirection(DEFAULT_OPTIONS.LEFT);
    		});


    	},

    	/** 
    	  * Allow to add a widget in a html element
		  * @method addWidget
		  * @param elem {String} html element
		  */
    	addWidget: function(elem, options){
    		
    		DEFAULT_OPTIONS = Object.extend(DEFAULT_OPTIONS, options);

    		var that = this;
			var li = new Element('li');
    		$$(elem)[0].appendChild(li);
    		var a = new Element('a', {'id': 'joystick', 'class': 'icon'});
    		li.appendChild(a);
    		

    		$('joystick').on('click',function(){
    			if (user_name==null){
    				alert("Please define your name!");
    			}
    			else {
    				$('widget').update('');
    				that.draw('#widget'); 
    			}
    		})
	    		
	    } 

	})
	
	/** 
	  * Class to create a input text widget
	  *
      * @class inputText
      * @constructor
      * @extends Widget
 	  */
	var inputText = Class.create(Widget, {

		/** 
		  * Responsible to show the widget
		  * @method draw
		  * @param elem {String} html element
		  */
		draw: function(elem){
			var div = new Element('div', {'id': 'utext'});
			$$(elem)[0].appendChild(div);
			var text = new Element('form', {'id': 'someText'});
			div.appendChild(text);
			var input = new Element('input', {'type': 'text', name: 'texto', value: ''});
			text.appendChild(input);
			var newDiv = new Element('div', {'id': 'textin'});
			$$(elem)[0].appendChild(newDiv);
			var button = new Element('input', {'type': 'submit', 'id': 'button', value: 'Submit'});
			newDiv.appendChild(button);

			this.handleInput();
		},

		/** 
    	  * Define the events for input text widget
    	  *
		  * @method handleInput
		  */
		handleInput: function() {

			var that = this;

			var form = $('someText');

			var input = form['texto'];

			$('button').on('click', function(){
				that.sendText($(input).getValue());
			});
		},

		/** 
    	  * Allows user to add a widget in a html element
		  * @method addWidget
		  * @param elem {String} html element
		  */
		addWidget: function(elem){

			var that = this;

    		var li = new Element('li');
    		$$(elem)[0].appendChild(li);
    		var a = new Element('a', {'id': 'text_input', 'class': 'icon'});
    		li.appendChild(a);

    		$("text_input").on('click', function(){
    			$('widget').update('');
    			that.draw('#widget');
    		});
  
    	}

	});

	
	/** 
	  * Class to create a Swipe widget
	  *
      * @class Swipe
      * @constructor
      * @extends Widget
 	  */
	var Swipe = Class.create(Widget, {

		/** 
		  * Responsible to show the widget
		  * @method draw
		  * @param elem {String} html element
		  */
		draw: function(elem){
			var div = new Element('div', {'id': 'swipe'});
			$$(elem)[0].appendChild(div);

			this.handleInput();
		},

		/** 
    	  * Define the events for swipe widget 
    	  *
		  * @method handleInput
		  */
		handleInput: function() {
			var that = this;
			console.log("SWIPE");
			
				var swipeMe = $('swipe');
				new Swipeable(swipeMe);
				
				swipeMe.observe("swipe:up", function () {
					that.sendSwipe(UP);
				;});
				swipeMe.observe("swipe:down", function () {
					that.sendSwipe(DOWN);
				});
				swipeMe.observe("swipe:left", function () {
					that.sendSwipe(LEFT);
				});
				swipeMe.observe("swipe:right", function () {
					that.sendSwipe(RIGHT);
				});

		},

		/** 
    	  * Allows user to add a widget in a html element
		  * @method addWidget
		  * @param elem {String} html element
		  */
		addWidget: function(elem){

			var that = this;

    		var li = new Element('li');
    		$$(elem)[0].appendChild(li);
    		var a = new Element('a', {'id': 'swipe_button', 'class': 'icon'});
    		li.appendChild(a);

    		$("swipe_button").on('click', function(){
    			if (user_name==null){
    				alert("Please define your name!");
    			}
    			else {
    				$('widget').update('');
    				that.draw('#widget'); 
    			}
    		});
    	}

	});


	window.Widget = {start: start,
					drawBar: drawBar,
					setOptions: setOptions,
					Joystick: Joystick,
					inputText: inputText,
					Swipe: Swipe,
					ready: ready};

}(window,document));