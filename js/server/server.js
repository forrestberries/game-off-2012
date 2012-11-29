/* this is the file thats on the server running socket.io.
* putting it here for version control and because ST2
* is a way better IDE than vim. */
var io = require('C:\\Users\\IGEN721\\NODE\\node_modules\\socket.io'),
    express = require('C:\\Users\\IGEN721\\NODE\\node_modules\\express'),
    app = express.createServer(),
    games = {},
    gamesInProgress = 0,
    fakeGameArray = [];

//fillGamesWithTestData();

app
	.configure(function () {
		//app.enable( 'jsonp callback' );

	})
	.listen( 20080 );

var sio = io.listen(app);
//some room clean up every 1.5 seconds
(function(){
	var rooms = sio.sockets.manager.rooms;
  for( var key in games ) {
		if( games.hasOwnProperty( key ) ) {
			var aRoom = rooms[ '/' + games[key].id];
			if( !aRoom ) {
				delete games[key];
				gamesInProgress--;
			}
		}
	}
  setTimeout(arguments.callee,1500);
})();

function isOlderThan( limit, time ) {
	var now = new Date(),
			difference = (Math.abs(now - time) / 1000); //in seconds
	console.log( ' the difference in seconds is ' + difference );
	if( difference > limit ) {
		return true;
	}
	return false;
}

/*SOCKETS :) */

sio.sockets.on( 'connection', function( socket ) {

	socket.on( 'czar chosen', function( game ) {
		console.log( 'czar chosen for room ' + game.id );
		games[game.id] = game;
		sio.sockets.in( game.id ).emit( 'czar chosen', game );
	});

	socket.on( 'blackcard chosen', function( game, cards ) {
		console.log( 'blackcard chosen for room ' + game.id );
		game.blackCardsInPlay = cards;
		games[game.id] = game;
		sio.sockets.in( game.id ).emit( 'blackcard chosen', games[game.id] );
	});

	socket.on( 'update room', function( game ) {
		console.log( 'update room request received for ' + game.id );
		games[game.id] = game;
		sio.sockets.in( game.id ).emit( 'update room', game );
	});

	socket.on( 'new round', function( game ) {
		console.log( 'new round for ' + game.id );
    for( var i = 0; i < game.players.length; i++ ) {
    	game.players[i].cardsInPlay = [];
    	game.players[i].whitecards = [];
    	game.players[i].isWinner = false;
    	game.players[i].isCzar = false;
    	game.players[i].hasPlayed = false;
    	game.players[i].hasDrawnBlackCard = false;
    	game.players[i].czarSetForCurrentRound = false;
    }
		games[game.id] = game;
		sio.sockets.in( game.id ).emit( 'new round', game );
	});

	socket.on( 'update server listing', function( game ) {
		games[game.id] = game;
	});

	socket.on( 'disconnect', function() {
		console.log( 'client ' + socket.id + ' disconnected' );
	//TODO, right now this is emitting to all rooms, dunno how else to do it.
		sio.sockets.emit( 'player left', socket.id );
	});

	socket.on( 'join game', function( game, callback ) {
		console.log( '++++++++++++GAME+++++++++++' );
		//check if room exists
		if( games[game.id] ) {
			console.log( 'Room already exists' );
			//playerse[0] should be person that just joined.
			game.players[0].socketid = socket.id;
			sio.sockets.in( game.id ).emit( 'new player', game.players[0]);
			socket.join( game.id );
		} else {
			console.log( 'Room does not exists, use my game obj' );
			game.players[0].socketid = socket.id;
			console.log( 'creating room ' + game.id );
			//since its a new game, player[0] should be only player
			socket.join( game.id );
			console.log( 'Rooms available (and its members): ' );
			console.log( sio.sockets.manager.rooms );
			callback( game );
			game.updates = {
				'update room': new Date()
			};
			games[game.id] = game;
			gamesInProgress++;
		}
		socket.set( "gameid", game.id );
	});
});

/* END SOCKETS :( */

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

app.get( '/', function( req, res, next ) {
	next();
});

app.get( '/games/location/:location', function( req, res ) {
	console.log( 'request for games near location ' + req.params.location );
	var location = req.params.location.split( ',' ),
			distanceThreshhold = 2, // miles
			respGames = [];

	var responseFinished = function() {
		var response = {};

		response.games = respGames;
		res.json( response );
	},
	calculateCallback = function( i, distance, validGame ) {
		var gameObj = {};
		if( distance <= distanceThreshhold ) {
			distance = Math.round( distance * 100 ) / 100; //round to 2 decimal places
			validGame.miles = distance;
			validGame.feet = Math.round( ( distance * 5280 ) * 100 ) / 100; //round to 2 decimal places
			//gameObj.game = validGame;
			respGames.push( validGame );
		}
		if( i === gamesInProgress ) {
			responseFinished();
		}
	},
	count = 0;
	for( var key in games ) {
		if( games.hasOwnProperty( key ) ) {
			/*
			* for more info on this nonsense,
			* see http://en.wikipedia.org/wiki/Haversine_formula
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
						gameLat = parseFloat( game.location.latitude ),
						gameLon = parseFloat( game.location.longitude ),
						R = 6371, // Radius of the earth in km
						dLat = ( Math.abs( gameLat - lat ) ).toRad(),
						dLon = ( Math.abs( gameLon - lon ) ).toRad(),
						a = Math.sin( dLat/2 ) * Math.sin( dLat/2 ) +
								Math.cos( lat.toRad() ) * Math.cos( gameLat.toRad() ) *
								Math.sin( dLon/2 ) * Math.sin( dLon/2 ),
						c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1-a ) );
				var dist = R * c * 0.621371; // Distance in miles
				callback( i, dist, game );
			})( games[key], location, ++count, calculateCallback );
		}
	}
	if(count === 0) // no games available nearby
		responseFinished();
});

app.get( '/games', function( req, res ) {
	var response = {};
	response.games = [];
	for( var key in games ) {
		if( games.hasOwnProperty( key ) ) {
			response.games.push( games[key] );
		}
	}

	res.json( response );
});
app.get( '/games/id/:id/players', function( req, res ) {
	var id = req.params.id,
			theGame = games[id];

	res.json( theGame.players );
});

app.post( '/games/id/:id/players', function( req, res ) {
	var id = req.params.id,
			theGame = games[id];


});

app.get( '/games/id/:id', function( req, res ) {
	console.log( 'request for game with id ' + req.params.id );
	var id = req.params.id,
			response = {},
			respGames = [];

	for( var key in games ) {
		if( games.hasOwnProperty( key ) ) {
			var currentGame = games[key];
			if( currentGame.id == id ) {
				respGames.push( currentGame );
				break;
			}
		}
	}
	response.games = respGames;
	res.json( response );
});

