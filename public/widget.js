
//Abstract Widget

	var Widget = Class.create({
		url: null,
		socket: null,
		LEFT : "L",
		RIGHT : "R",
		UP : "U",
		DOWN : "D",
		DIRECTION: "DIRECTION",
		TEXT: "TEXT",
		SWIPE: "SWIPE",
		NAME: "SET_NAME",
		READY: "CLIENT_READY",
		_name: null,
		id: null,

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

			socket.on('NAME', function(data){
				name = data.names;
				//alert(this.name);
			});
		},

		
		initialize: function (elem, url, id){
			this.url = url;

			//connect to server
			socket = io.connect(url);
			this.id=id;
			socket.emit('load');
			this.addWidget('#my_widgets')
			this.handleResponse();
			this.setName();
			//this.draw(elem);
			//this.handleInput();

		},

		
		sendToServer: function(key, obj){
			var payload = {};
			payload.id=this.id;
			payload.name=name;
			payload.cmd=obj;
			socket.emit(key,payload);
			console.log("emit "+key+" "+ payload.cmd);
		},

		sendDirection: function(dir){
			this.sendToServer(this.DIRECTION,dir);
		},

		sendText: function(str){
			this.sendToServer(this.TEXT,str);
		},

		setReady: function(){
			this.sendToServer(this.READY, {});
		},

		setName: function(){
			this.sendToServer(this.NAME, {});
		},

		sendSwipe: function(dir){
			/*var res;
			res.dir=dir;
			res.ints=ints;*/
			this.sendToServer(this.SWIPE,dir);	
		},

		draw: function(elem) {},

		handleInput: function() {},

		addWidget: function(){}
	})

	//onReceiveText(txt);

//Joystick

	var Joystick = Class.create(Widget, {
		//draw joystick

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

    	//adicionar os eventos ao botoes
    	handleInput: function() {
    		var that = this;

    		$('up_key').on('click',function(){
    			that.sendDirection(that.UP);
    		});

    		$('right_key').on('click',function(){
    			that.sendDirection(that.RIGHT);
    		});

    		$('down_key').on('click',function(){
    			that.sendDirection(that.DOWN);
    		});

    		$('left_key').on('click',function(){
    			that.sendDirection(that.LEFT);
    		});

    	},

    	addWidget: function(elem){
    		var that = this;

    		var li = new Element('li');
    		$$(elem)[0].appendChild(li);
    		var a = new Element('a', {'id': 'joystick', 'class': 'icon'});
    		li.appendChild(a);

    		$('joystick').on('click',function(){
    			$('widget').update('');
    			that.draw('#widget');
    		})

    		/*var img = new Element('img', {'id': 'arrow_keys'});
    		img.src = 'images/icon_keys.png';
    		a.appendChild(img); 
    		//a.update('Joystick');*/
    	}

	})
	
	var inputText = Class.create(Widget, {

		//draw a input box 

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

		handleInput: function() {

			var that = this;

			var form = $('someText');

			var input = form['texto'];

			$('button').on('click', function(){
				that.sendText($(input).getValue());
				//alert($(input).getValue());
			});
		},

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
    		/*var img = new Element('img', {'id': 'input_text'});
    		img.src = 'images/icon_text.png';
    		a.appendChild(img); 
    		//a.update('Joystick');*/
    	}

	});

	var Swipe = Class.create(Widget, {

		//draw a input box 

		draw: function(elem){
			var div = new Element('div', {'id': 'swipe'});
			$$(elem)[0].appendChild(div);

			this.handleInput();
		},

		handleInput: function() {
			var that = this;
			console.log("SWIPE");
			
				var swipeMe = $('swipe');
				new Swipeable(swipeMe);
				
				swipeMe.observe("swipe:up", function () {
					that.sendSwipe(that.UP);
				;});
				swipeMe.observe("swipe:down", function () {
					that.sendSwipe(that.DOWN);
				});
				swipeMe.observe("swipe:left", function () {
					that.sendSwipe(that.LEFT);
				});
				swipeMe.observe("swipe:right", function () {
					that.sendSwipe(that.RIGHT);
				});

		},

		addWidget: function(elem){

			var that = this;

    		var li = new Element('li');
    		$$(elem)[0].appendChild(li);
    		var a = new Element('a', {'id': 'swipe_button', 'class': 'icon'});
    		li.appendChild(a);

    		$("swipe_button").on('click', function(){
    			$('widget').update('');
    			that.draw('#widget');
    		});
    	}

	});



Event.observe(window, 'load', function() {

	arrows = new Joystick('#widget','http://172.30.10.172:8080',"dsfsddfs");
	
	text = new inputText('#widget', 'http://172.30.10.172:8080',"dsfsddfs");

	swipe = new Swipe('#widget', 'http://172.30.10.172:8080',"dsfsddfs");
	arrows.setReady();
	text.setReady();
	swipe.setReady();
	
});

