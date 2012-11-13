define([
  'jquery', 
  'backbone', 
  'socket.io', 
  'collections/PlayersCollection', 
  'models/PlayerModel', 
  'models/LocationModel', 
  'models/GameModel',
  'views/PlayerListView'], function($, Backbone, Socket, PlayersCollection, PlayerModel, LocationModel, GameModel, PlayerListView){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function( id ) {
      console.info( 'GameView initialize()' );
      var self = this,
          socket = io.connect( 'http://meowstep.com:20080' );

      this.id = id;

      self.socket = socket;
      self.syncFromLocalStorage( id );
      
      self.joinOrCreateGame();

    },

    events: {

    },

    render: function() {
      console.info( 'GameView.render()' );
      this.template = _.template( $("#game-view").html(), { id: this.id } );
      this.playerListView.render();
      this.$el.html(this.template);
      return this;
    },

    newPlayer: function( player, self ) {
      console.group( '%cNew Player', 'color: green;' );
      var newPlayer = new PlayerModel( player );
      if( !self.player ) {
        console.log( 'it was you.' );
        self.player = newPlayer;
      }
      self.playerListView.addPlayer( newPlayer );
      self.game.get( "players" ).add( newPlayer );
      console.log( "%c-----players-----", "color: blue;" );
      console.log( self.game.get( 'players' ) );
      console.groupEnd();

      this.emit( 'update room', self.game );
    },

    updateRoom: function( data, self ) {
      console.group( 'client updating game' );
      console.log( self );

      var newPlayersCollection = self.updateGamePlayers( data, self );

      var newGame = new GameModel( data );
      self.playerListView = new PlayerListView( { collection: newPlayersCollection } );
      newGame.set( { players: newPlayersCollection } );
      
      self.game = newGame;

      console.log( '%c-----game-----', "color: blue;" );
      console.log( self.game );
      console.groupEnd();
      self.render();
    },

    updateGamePlayers: function( data, self ) {
      var newPlayers = data.players,
          newPlayersCollection = new PlayersCollection();

      for( var i = 0; i < newPlayers.length; i++ ) {
        newPlayersCollection.add( new PlayerModel( newPlayers[i] ) );
      }

      return newPlayersCollection;
    },

    playerLeft: function( badsocketid, self ) {
      console.log( badsocketid + ' left the game' );
      self.game.get( 'players' ).each( function( model ) {
        if( model.get( 'socketid' ) === badsocketid ) {
          model.destroy();
        }
      });

      this.emit( 'update server listing', self.game );
    },

    joinOrCreateGame: function() {
      console.info( 'GameView.joinOrCreateGame()' );
      var self = this;

      self.socket.emit( 'join game', self.game, function( data ) {
        //so this is only called if you're the first person
        //to join a game
        console.group( 'client updating game (response from server)', 'join game' );
        self.updateRoom( data, self );
        self.player = new PlayerModel( data.players[0] );
      });

      self.socket.on( 'update room', function( data ) {
        self.updateRoom( data, self );
      });

      self.socket.on( 'new player', function( player ) {
        self.newPlayer( player, self );
      });

      this.socket.on( 'player left', function( badsocketid ) {
        self.playerLeft( badsocketid, self);
      });
      
    },

    syncFromLocalStorage: function() {
      console.log( 'GameView.syncFromLocalStorage()' );
      var gameFromLocalStorageJson = JSON.parse( localStorage.getItem( 'game' ) );
          playerSettingsJson = JSON.parse( localStorage.getItem( 'playerSettings' ) ),
          name = ''; //can get player name from PlayerSettings

      if( playerSettingsJson ) {
        //lulz just for debuggins 
        name = playerSettingsJson.displayName + ( new Date().getMilliseconds() );
      } else {
        //lulz just for debuggins 
        name = 'bob' + ( new Date().getMilliseconds() );
      }
      var player = new PlayerModel( { name: name } );
      if( gameFromLocalStorageJson ) {
        //found a good game object in local storage 
        var location = gameFromLocalStorageJson.location,
            players = gameFromLocalStorageJson.players;

        this.game = new GameModel( gameFromLocalStorageJson );
        this.game.set(
          { 
            location: new LocationModel( location ),
            players: new PlayersCollection( player )
          }
        );
        this.game.get( 'deck' ).loadCards();
      } else {
        //mock one up and join an already existing game
        //to have game obj filled out later via server syncFromLocalStorages
        //only ting that needs set is the id and player
        this.game = new GameModel( { id: this.id } );
        this.game.set(
          { 
            players: new PlayersCollection( player )
          }
        );
      }
      this.playerListView = new PlayerListView( { collection: this.game.get( 'players' ) } );
      console.log( this.game );
    }
  });

  // Returns the View class
  return View;
});







