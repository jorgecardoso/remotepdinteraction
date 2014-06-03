window.Swipeable = Class.create({
	
	initialize: function (el) {	
		
		// allow id or DOM object
		this.el = $(el); 
		
		this.minLength = 70; // allow options object to be passed
			
		this.startX = null;
		this.startY = null;
		this.curX = null;
		this.curY = null;

		this.el.observe("touchstart", this.onTouchStart.bind(this)); 
		this.el.observe("touchmove", this.onTouchMove.bind(this)); 
		this.el.observe("touchend", this.onTouchEnd.bind(this));
		this.el.observe("touchcancel", this.onTouchCancel.bind(this));
	},
	
	onTouchStart: function (event) {
		
		// stop swipe from propogating and scrolling the whole screen (for example)
		event.stop(); 
		
		// only allow single-touch gestures
		if (event.touches.length == 1) {
			this.startX = event.touches[0].pageX;
			this.startY = event.touches[0].pageY;
		}
	},
	
	onTouchMove: function (event) {
		
		event.stop();
		
		if (event.touches.length == 1) {
			this.curX = event.touches[0].pageX;
			this.curY = event.touches[0].pageY;
		} else {
			this.onTouchCancel(event);
		}
	},
	
	onTouchEnd: function (event) {
		
		var swipeLength;
		
		event.stop();
		
		swipeLength = Math.sqrt(Math.pow(this.curX - this.startX, 2) + Math.pow(this.curY - this.startY, 2));
		
		if (swipeLength >= this.minLength ) {
			this.el.fire("swipe:" + this.getDirection(this.getAngle()));
		}	
		
		this.resetCoords()
	},
	
	onTouchCancel: function (event) {
		this.resetCoords();
	},
	
	getAngle: function () {
		
		var x, y, r, angle;
		
		x = this.startX - this.curX;
		y = this.curY - this.startY;

		r = Math.atan2(y, x); 
		
		//convert radians to degrees
		angle = Math.round(r * 180 / Math.PI); 
		
		if (angle < 0) { 
			angle = 360 - Math.abs(angle); 
		}
		return angle;
	},
	
	getDirection: function (angle) {
		
		var direction;
		
		if (angle <= 45 && angle >= 0) {
			direction = "left";
		} else if (angle <= 360 && angle >= 315) {
			direction = "left";
		} else if (angle >= 135 && angle <= 225) {
			direction = "right";
		} else if (angle > 45 && angle < 135) {
			direction = "down";
		} else {
			direction = "up";
		}
		
		return direction;
	},
	
	resetCoords: function () {
		this.startX = null;
		this.startY = null;
		this.curX = null;
		this.curY = null;
	}
});

