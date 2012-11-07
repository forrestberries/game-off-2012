/* this is the file thats on the server running socket.io.
* putting it here for version control and because ST2
* is a way better IDE than vim. */
var io = require('C:\\Users\\IGEN721\\NODE\\node_modules\\socket.io'),
    express = require('C:\\Users\\IGEN721\\NODE\\node_modules\\express'),
    app = express.createServer(),
    games = [];

fillGamesWithTestData();

app
	.configure(function () {
		//app.enable( 'jsonp callback' );
	})
	.listen( 20080 );

app.get( '/*', function( req, res, next) {

	res.header('Access-Control-Allow-Credentials', 'true');
	if (req.headers.cookie) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Credentials', 'true');
	} else {
		res.header('Access-Control-Allow-Origin', req.headers.origin);
	}
	next();
});

// TODO - The create game/room logic handling
app.get( '/', function( req, res, next ) {
	var sio = io.listen(app);
	sio.sockets.on('connection', function( socket ) {
		console.log( 'on connection: sync.' );
		socket.on( 'join game', function( data, callback ){
			var game = new Game( data );
			console.log( 'creating room ' + game.id );
			socket.join( game.id );
		});
	});
	next();
});

app.get( '/games/location/:location', function( req, res ) {
	console.log( 'request for games near location ' + req.params.location );
	var location = req.params.location.split( ',' ),
			distanceThreshhold = 2,
			respGames = [];

	var responseFinished = function() {
		var response = {};

		response.games = respGames;
		res.json( response );
	},
	calculateCallback = function( i, distance ) {
		var gameObj = {};

		if( distance <= distanceThreshhold ) {
			distance = Math.round( distance * 100 ) / 100; //round to 2 decimal places
			gameObj.miles = distance;
			gameObj.feet = Math.round( ( distance * 5280 ) * 100 ) / 100; //round to 2 decimal places
			gameObj.game = games[i];
			respGames.push( gameObj );
		}
		if( i === ( games.length - 1 ) ) {
			responseFinished();
		}
	};

	for( i = 0; i < games.length; i++ ) {
		/*
		* for more info on this nonsense, see http://en.wikipedia.org/wiki/Haversine_formula
		* Shamelessly stolen from SO
		*/
		( function( game, location, i, callback ) {
			if (typeof(Number.prototype.toRad) === "undefined") {
				Number.prototype.toRad = function() {
					return this * Math.PI / 180;
				};
			}
			var lat = parseFloat( location[0] ),
					lon = parseFloat( location[1] ),
					gameLat = parseFloat( game.location.lat ),
					gameLon = parseFloat( game.location.lon ),
					R = 6371, // Radius of the earth in km
					dLat = ( Math.abs( gameLat - lat ) ).toRad(),
					dLon = ( Math.abs( gameLon - lon ) ).toRad(),
					a = Math.sin( dLat/2 ) * Math.sin( dLat/2 ) +
							Math.cos( lat.toRad() ) * Math.cos( gameLat.toRad() ) *
							Math.sin( dLon/2 ) * Math.sin( dLon/2 ),
					c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1-a ) );
			var dist = R * c * 0.621371; // Distance in miles
			callback( i, dist );
		})( games[i], location, i, calculateCallback );
	}
});

app.get( '/games', function( req, res ) {
	var response = {};
	response.games = [];
	for( i = 0; i < games.length; i++ ) {
		response.games.push( games[i] );
	}
	res.json( response );
});

app.get( '/games/id/:id', function( req, res ) {
	console.log( 'request for game with id ' + req.params.id );
	var id = req.params.id,
			response = {},
			respGames = [];

	for( i = 0; i < games.length; i++ ) {
		var currentGame = games[i];
		if( currentGame.id == id ) {
			respGames.push( currentGame );
			break;
		}
	}
	response.games = respGames;
	res.json( response );
});

function Game( data ) {
	this = data.game;
}

function fillGamesWithTestData() {
	var game1 = {};
	game1.location = {};
	game1.players = 2;
	game1.id = 1;
	game1.location.lat = '41.250545';
	game1.location.lon = '-96.01308';
	games.push( game1 );

	var game2 = {};
	game2.location = {};
	game2.players = 2;
	game2.id = 2;
	game2.location.lat = '41.250540';
	game2.location.lon = '-96.01300';
	games.push( game2 );

	var game3 = {};
	game3.location = {};
	game3.players = 2;
	game3.id = 3;
	game3.location.lat = '41.200000';
	game3.location.lon = '-96.01330';
	games.push( game3 );

	var game4 = {};
	game4.location = {};
	game4.players = 3;
	game4.id = 4;
	game4.location.lat = '41.204999';
	game4.location.lon = '-96.01330';
	games.push( game4 );

	var game5 = {};
	game5.location = {};
	game5.players = 4;
	game5.id = 5;
	game5.location.lat = '41.251000';
	game5.location.lon = '-96.01310';
	games.push( game5 );

	var game6 = {};
	game6.location = {};
	game6.players = 1;
	game6.id = 6;
	game6.location.lat = '41.250530';
	game6.location.lon = '-96.01430';
	games.push( game6 );
}

