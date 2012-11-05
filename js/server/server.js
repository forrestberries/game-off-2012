/* this is the file thats on the server running socket.io.
* putting it here for version control and because ST2
* is a way better IDE than vim. */
var io = require('socket.io'),
    express = require('express'),
    app = express.createServer(),
    games = [];
 
app
	.configure(function () {
  
	})
	.listen();

app.get( '/', function( req, res ) {
	var sio = io.listen(app);
	 
	sio.sockets.on('connection', function( socket ) {
	  //
	  socket.on( 'join game', function( data, callback ){
	  	var game = {};
	  	game.id = data.game.id;
	  	game.location = data.game.location;
	  	console.log( 'creating room ' + data.game.id );
	  	socket.join( data.game.id );
	  });
	});
});

app.get( '/games', function( req, res ) {
	
});
 
