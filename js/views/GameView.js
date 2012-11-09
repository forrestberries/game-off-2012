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

      console.log( '%cself', 'color: blue;' );
      console.log( self );
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
      console.log( 'render()' );
      console.log( this );
      var game = this.game;
      this.template = _.template( $("#game-view").html(), { id: this.id, players: game.get( "players" ) } );
      this.$el.html(this.template);
      return this;
    },

    joinOrCreateGame: function() {
      console.log( 'GameView.joinOrCreateGame()' );
      var self = this;


      self.socket.emit( 'join game', self.game, function( data ) {
        console.info( 'client updating game (response from server)' );

        //AH HA!, when data comes back, needs to strip
        //it all apart and new up Models individually, add to collection
        //then put that collection as child of GameModel. WOO!
        self.game = new GameModel( data );
        console.log( '%c-----game-----', "color: blue;" );
        console.log( self.game );
        self.render();
      });
      self.socket.on( 'update room', function( data ) {
        console.log( 'client updating game' );
        console.log( self );
        self.game = data;
        console.log( '%c-----game-----', "color: blue;" );
        console.log( self.game );
        self.render( self );
      });
      self.socket.on( 'new player', function( player ) {
        console.log( '%cself', 'color: yellow;' );
        console.log( self );
        console.log( 'A new player has arrived. adding ' );
        var newPlayer = new PlayerModel( player );
        console.log( 'old game: ' );
        console.log( self.game );
        self.game.get( "players" ).add( newPlayer );
        console.log( "%c-----players-----", "color: blue;" );
        console.log( self.game.get( 'players' ) );


        this.emit( 'update room', self.game );
      });
      this.socket.on( 'player left', function( badsocketid ) {
        console.clear();
        console.log( badsocketid + ' left the game' );
        var players = self.game.players,
            newPlayers = [];
        for(var i = 0; i < players.length; i++ ) {
          if( players[i].socketid !== badsocketid ) {
            newPlayers.push( players[i] );
          }
        }
        self.game.players = newPlayers;
        console.log( '-----players-----' );
        console.log( self.game.players );
      });
      $( window ).bind( 'beforeunload', function() {
        var socketid = self.player.socketid;
        self.socket.emit( 'player left', self.game.id, socketid );
      });
    },

    sync: function() {
      console.log( 'GameView.sync()' );
      var socket = io.connect( 'http://localhost:20080' ),
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
      console.log( self );
    }
  });

  // Returns the View class
  return View;
});