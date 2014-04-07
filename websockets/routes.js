// This file is required by app.js. It sets up event listeners
// for the two main URL endpoints of the application - /create and /chat/:id
// and listens for socket.io messages.

// Use the gravatar module, to turn email addresses into avatar images:

var gravatar = require('gravatar');

// Export a function, so that we can pass 
// the app and io instances from the app.js file:

module.exports = function(app,io){

	app.get('/', function(req, res){

		// Render views/home.html
		res.render('index');
	});

	app.get('/panel/:key', function (req, res) {
	    var key = req.params.key;
	    console.log(key);
	    res.render('mobile.html', {key:key});
	});

	app.get('/action/:key/:y/:action', function (req, res) {
    var key = req.params.key;
    var y = req.params.y;
    var action = req.params.action;
    sockets[key].emit('scrollTo', {y:y, action:action});
    res.send('OK');
	});

	var sockets = {};
	io.sockets.on('connection', function (socket) {
	    socket.on('setKey', function (key) {
	        sockets[key] = socket;
	    });
	});
};
