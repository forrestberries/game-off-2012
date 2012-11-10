define(['jquery', 'backbone', 'socket.io', 'collections/PlayersCollection', 'models/PlayerModel', 'models/LocationModel', 'models/GameModel'], function($, Backbone, Socket, PlayersCollection, PlayerModel, LocationModel, GameModel){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function( id ) {
      console.log( 'GameView initialize()' );
      var self = this,
          game = new GameModel( { id: id });
      self.socket = {};

      var players = new PlayersCollection();

      self.game = game;

      players.on( 'add remove', function( data ) {
        self.render();
      });
      players.on( 'remove', function( data ) {
        //
      });

      self.game.set( { players: players } );
      self.sync();
    },

    events: {

    },

    playerCollectionChange: function( data ) {
      console.info( 'Player Collection has been changed' );
      console.log( data );
    },

    render: function() {
      console.group( 'render()' );
      console.log( 'this is' );
      console.log( this );
      console.groupEnd();
      var game = this.game;
      this.template = _.template( $("#game-view").html(), { id: this.id, players: game.get( "players" ) } );
      this.$el.html(this.template);
      return this;
    },

    joinOrCreateGame: function() {
      console.log( 'GameView.joinOrCreateGame()' );
      var self = this;

      self.socket.emit( 'join game', self.game, function( data ) {
        //so this is only called if you're the first person
        //to join a game
        console.group( 'client updating game (response from server)', 'join game' );
        /*self.game.get( 'players' ).each(function(model) { model.destroy(); } );*/
        var newPlayers = data.players,
            newPlayersCollection = new PlayersCollection();
        for( var i = 0; i < newPlayers.length; i++ ) {
          newPlayersCollection.add( new PlayerModel( newPlayers[i] ) );
        }
        self.player = new PlayerModel( data.players[0] );
        newPlayersCollection.on( 'add remove', function() { self.render(); } );
        var newGame = new GameModel( data );
        newGame.set( { players: newPlayersCollection } );
        self.game = newGame;
        console.log( '%c-----game-----', "color: blue;" );
        console.log( self.game );
        console.groupEnd();
        self.render();
      });
      self.socket.on( 'update room', function( data ) {
        console.group( 'client updating game' );
        console.log( self );

        var newPlayers = data.players,
            newPlayersCollection = new PlayersCollection();
        for( var i = 0; i < newPlayers.length; i++ ) {
          newPlayersCollection.add( new PlayerModel( newPlayers[i] ) );
        }
        newPlayersCollection.on( 'add remove', function() { self.render(); } );
        var newGame = new GameModel( data );
        newGame.set( { players: newPlayersCollection } );
        self.game = newGame;

        console.log( '%c-----game-----', "color: blue;" );
        console.log( self.game );
        console.groupEnd();
        self.render();
      });
      self.socket.on( 'new player', function( player ) {
        console.group( '%cNew Player', 'color: green;' );
        console.log( 'A new player has arrived. adding ' );
        var newPlayer = new PlayerModel( player );
        if( !self.player ) {
          console.log( 'it was you.' );
          self.player = newPlayer;
        }
        console.log( 'old players: ' );
        console.log( self.game.get( 'players' ) );
        self.game.get( "players" ).add( newPlayer );
        console.log( "%c-----players-----", "color: blue;" );
        console.log( self.game.get( 'players' ) );
        console.groupEnd();

        this.emit( 'update room', self.game );
      });
      this.socket.on( 'player left', function( badsocketid ) {
        console.log( badsocketid + ' left the game' );
        self.game.get( 'players' ).each( function( model ) {
          if( model.get( 'socketid' ) === badsocketid ) {
            model.destroy();
          }
        });
        console.log( '-----players-----' );
        console.log( self.game.get( 'players' ) );

        this.emit( 'update server listing', self.game );
      });
      
    },

    sync: function() {
      console.log( 'GameView.sync()' );
      var socket = io.connect( 'http://meowstep.com:20080' ),
          self = this;
      self.socket = socket;
      var tempName = 'bob' + ( new Date().getMilliseconds() ),
          location = new LocationModel(),
          temporaryPlayer = new PlayerModel({
        name: tempName
      });
      temporaryPlayer.on( 'change', function( data ) {
        console.error( "I CHANGED IN ERROR" );
      });
      self.game.get( "players" ).add( temporaryPlayer );

      self.joinOrCreateGame();
    }
  });

  // Returns the View class
  return View;
});