
/**
  * @module Widget
  */
;(function(window, document) {

	var socket,
	/**	
	  * @property DEFAULT_PORT
	  * @type String
 	  */
	DEFAULT_PORT=8080,
	
	/** 
	  * @property LEFT 
	  * @type String
	  */
	LEFT = "L",

	/**
	  * @property RIGHT
	  * @type String
 	  */
	RIGHT = "R",

	/**
	  * @property UP
	  * @type String
 	  */
	UP = "U",

	/**
	  * @property DOWN
	  * @type String
 	  */
	DOWN = "D",

	/**
	  * @property DIRECTION
	  * @type String
 	  */
	DIRECTION = "DIRECTION",

	/**
	  * @property TEXT
	  * @type String
 	  */
	TEXT = "TEXT",

	/**
	  * @property SWIPE
	  * @type String
 	  */
	SWIPE = "SWIPE",

	/**
	  * @property NAME
	  * @type String
 	  */
	NAME = "SET_NAME",

	/**
	  * @property READY
	  * @type String
 	  */
	READY = "CLIENT_READY",

	/**
	  * @property your_name
	  * @type String
 	  */
	your_name = null;
	//widgetbar,
	//DEFAULT_OPTIONS = {
		//widgetbar : true
	//};	

	/*function extend(a, b){
	    for(var key in b)
	        if(b.hasOwnProperty(key))
	            a[key] = b[key];
	    return a;
	}*/

	/** 
	  * @method start
	  * @param url {String} html element
	  */
	function start(url){
		//var port = url.match(/:(\d+)/);
		//url += port ? "" : DEFAULT_PORT;
		console.log(options)
		//console.log(DEFAULT_OPTIONS)

		//Object.extend(DEFAULT_OPTIONS, options);
		console.log(options)
		//widgetbar = options.widgetbar;
		socket = io.connect(url);
		
	
	}

	/** Method to change the name 
	  * @method ready
	  */
	function ready(){

		socket.emit(NAME, {});
		socket.on('NAME', function(data){
			your_name = data.names;
			console.log("MUDAR: " + your_name);

			socket.emit('CLIENT_READY',{ id: "dsfsddfs", name: data.names});
		});

		
	} 

	/** Method to draw 
	  * @method drawBar
	  * @param elem {String} html element
	  */
	function drawBar(elem){
		var ul = new Element('ul', {'id': 'my_widgets'});
		$(elem).appendChild(ul);
	}

	/** 
      * @class Widget
      * @constructor
 	  */
	var Widget = Class.create({
		/**
	      * @property url
	      * @type String
	      */
		url: null,
		
		socket: null,
		
		/**
		  * @property id
		  * @type String
		  */
		id: null,
		

		/** 
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
		  * @method initialize
		  * @param elem {String} widget element
		  * @param id {String} widget id
		  */
		initialize: function (elem, id){
			

			//connect to server
				
			//socket = socket;

			this.id=id;
			
			this.handleResponse();
		},

		/** 
		  * @method sendToServer
		  */
		sendToServer: function(key, obj){
			var payload = {};
			payload.id=this.id;
			payload.cmd=obj;
			payload.name=your_name;
			//this.your_name = payload.cmd;
			socket.emit(key,payload);
			console.log("emit "+key+" "+ payload.cmd);
		},

		/** Send to the server the direction of joystick
		  * @method sendDirection
		  * @param dir {String} joystick direction
		  */
		sendDirection: function(dir){
			this.sendToServer(DIRECTION,dir);
		},

		/** Used to send to the server the text wroten in the text box 
		  * @method sendText
		  * @param str {String} input text
		  */
		sendText: function(str){
			this.sendToServer(TEXT,str);
		},

		/** Used to send to the server the 
		  * @method sendSwipe
		  * @param dir {String} swipe direction
		  */
		sendSwipe: function(dir){
			this.sendToServer(SWIPE,dir);	
		},

		/** Responsible for draw the widget
		  * @method draw
		  * @param elem {String} html element
		  */
		draw: function(elem) {},

		/**
		  * @method handleInput
		  */
		handleInput: function() {},

		/** Allow to add a widget
		  * @method addWidget
		  * @param elem {String} html element
		  */
		addWidget: function(elem){

		}
	})

	
	/** Allows users to create a joystick widget
      * @class Joystick
      * @constructor
      * @extends Widget
 	  */
	var Joystick = Class.create(Widget, {
		
		/** Responsible to show the widget
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
		  * @method handleInput
		  */
    	handleInput: function() {
    		var that = this;

    		$('up_key').on('click',function(){
    			that.sendDirection(UP);
    		});

    		$('right_key').on('click',function(){
    			that.sendDirection(RIGHT);
    		});

    		$('down_key').on('click',function(){
    			that.sendDirection(DOWN);
    		});

    		$('left_key').on('click',function(){
    			that.sendDirection(LEFT);
    		});

    	},

    	/** Allow to add a widget
		  * @method addWidget
		  * @param elem {String} html element
		  */
    	addWidget: function(elem){

    		var that = this;
			var li = new Element('li');
    		$$(elem)[0].appendChild(li);
    		var a = new Element('a', {'id': 'joystick', 'class': 'icon'});
    		li.appendChild(a);
    		

    		$('joystick').on('click',function(){
    			if (your_name==null){
    				alert("Please define your name!");
    			}
    			else {
    				$('widget').update('');
    				that.draw('#widget'); 
    			}
    		})
    		
    	}

	})
	
	/** Allows users to create a joystick widget
      * @class inputText
      * @constructor
      * @extends Widget
 	  */
	var inputText = Class.create(Widget, {

		/**
		  * @method draw
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
		  * @method addWidget
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

	
	/** Allows users to create a joystick widget
      * @class Swipe
      * @constructor
      * @extends Widget
 	  */
	var Swipe = Class.create(Widget, {

		/**
		  * @method draw
		  */
		draw: function(elem){
			var div = new Element('div', {'id': 'swipe'});
			$$(elem)[0].appendChild(div);

			this.handleInput();
		},

		/**
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
		  * @method addWidget
		  */
		addWidget: function(elem){

			var that = this;

    		var li = new Element('li');
    		$$(elem)[0].appendChild(li);
    		var a = new Element('a', {'id': 'swipe_button', 'class': 'icon'});
    		li.appendChild(a);

    		$("swipe_button").on('click', function(){
    			if (your_name==null){
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
					Joystick: Joystick,
					inputText: inputText,
					Swipe: Swipe,
					ready: ready};

}(window,document));