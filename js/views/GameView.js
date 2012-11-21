
define([
  'jquery',
  'backbone',
  'socket.io',
  'collections/PlayersCollection',
  'models/PlayerModel',
  'models/LocationModel',
  'models/GameModel',
  'views/PlayerListView',
  'views/PlayerCardView',
  'views/GameWaitingView',
  'views/CardsInPlayView',
  'views/BlackCardInPlayView',
  'views/CzarView',
  'collections/WhiteCardsCollection',
  'collections/BlackCardsCollection',
  'models/DeckModel'], function($, Backbone, Socket, PlayersCollection, PlayerModel, LocationModel, GameModel, PlayerListView, PlayerCardView, GameWaitingView, CardsInPlayView, BlackCardInPlayView, CzarView, WhiteCardsCollection, BlackCardsCollection, DeckModel){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function( id ) {
      console.info( 'GameView initialize()' );
      var self = this,
          socket = io.connect( 'http://localhost:20080' );

      this.id = id;
      if( !window.CAH ) {
        window.CAH = {};
      }

      self.socket = socket;

      self.syncFromLocalStorage( id );

      self.joinOrCreateGame();

      self.gameWaitingView = new GameWaitingView().render();
    },

    events: {
    },

    drawWhiteCard: function( self ) {
      self.game.drawWhiteCard( function( card ) {
        console.log( 'GameView.drawWhiteCard(): socketid of he who owns me: ' + self.player.id );
        card.set({ 'socketid': self.player.id });
        self.player.addWhiteCard( card );
        self.game.get( 'players' ).get( self.player.id ).set({ 'whitecards' : self.player.get( 'whitecards' ) });
        console.log( 'PLAYERS AFTER drawWhiteCard' );
        console.log( self.game.get( 'players' ) );
        $( '#drawWhiteCard' ).attr("disabled", "disabled");
        self.socket.emit( 'update room', self.game );
      });
    },

    updateCards: function( card, self ) {
      self.game.get( 'whitecards' ).get( card )
      self.game.updateCards( data.deck.whitecards, data.deck.blackcards );
    },

    render: function() {
      console.info( 'GameView.render()' );
      this.template = _.template( $("#game-view").html(), { id: this.id } );
      this.playerListView.render();
      this.$el.html(this.template);
      return this;
    },

    oncePerClientPerRound: function( self ) {

    },

    updateRoom: function( data, self ) {
      console.group( 'client updating game' );
      var newPlayersCollection = self.updateGamePlayers( data, self ),
          alreadyHidden = ( self.gameWaitingView.$el.find( '#waiting-msg' ).css( 'display' ) == 'none' );

      self.game.updateGameObjectFromData( self, data );

      //pry don't need to do a new,
      //just a set??
      self.playerListView = new PlayerListView( { collection: newPlayersCollection } );
      self.game.set({ players: newPlayersCollection });
      if( self.game.gameCanBegin() && !alreadyHidden) {
        self.gameWaitingView.hideModal();
      }
      //SOME BULLSHIT CONDITION CHECKS COMIN' UP BRO.
      //condition so the beginRound code is only executed by one client
      //Not sure how else to do this...
      if( self.game.gameCanBegin() && !!self.player.get( 'gameHost' ) && !self.game.get( 'czarSetForCurrentRound' )) {
        self.game.beginRound( self );
      }
      //condition for code that needs to happen
      //ONCE per EACH client EXCEPT the czar
      if( self.game.gameCanBegin() && !self.player.get( 'isCzar' )  && !self.player.get( 'hasDrawnWhiteCards' ) && self.game.get( 'czarSetForCurrentRound' ) ) {
        self.player.set({ 'hasDrawnWhiteCards': true });
        self.game.drawWhiteCards( self );
      }
      if( self.game.get( 'inProgress' ) ) { //game is in progress stuff that needs to happen
      }
      //ONLY EXEC ONCE for the player who IS the czar
      //and has NOT drawn black card.
      if( !!self.player.get( 'isCzar' ) && ( self.game.get( 'blackCardsInPlay' ).length === 0 ) ) {
        /*self.game.drawBlackCard( self, function() {
          self.socket.emit( 'update room', self.game );
        });*/
      }
      
      
      self.game.updateCards( data.deck.whitecards, data.deck.blackcards, data.deck.blackcards );
      window.CAH.game = self.game;

      console.log( '%c-----game-----', "color: blue;" );
      console.log( self.game );
      console.groupEnd();
      self.render();
    },

    renderBlackCardInPlayView: function( self ) {
    },

    updateGamePlayers: function( data, self ) {
      console.log( 'GameView.updateGamePlayers()' );
      var newPlayers = data.players,
          newPlayersCollection = new PlayersCollection(),
          allCardsInPlay = new WhiteCardsCollection();
      console.log( data );
      for( var i = 0; i < newPlayers.length; i++ ) {
        var whites = new WhiteCardsCollection(),
            blacks = new BlackCardsCollection(),
            inplay = new WhiteCardsCollection(),
            p = new PlayerModel( newPlayers[i] );
          
        whites.add( newPlayers[i].whitecards );
        blacks.add( newPlayers[i].blackcards );
        inplay.add( newPlayers[i].cardsInPlay );
        allCardsInPlay.add( newPlayers[i].cardsInPlay );

        p.set({ 'whitecards': whites, 'blackcards': blacks, 'cardsInPlay': inplay });
        if( p.id == self.player.id && ( p.get( 'isCzar' ) ) ) {
          self.player.set({ 'isCzar': true });
        }
        newPlayersCollection.add( p );
      }
      if( self.player.get( 'isCzar' ) ) {
        console.log( "I AM THE CZAR. 8========D~~~~ on YOU" );
        self.czarView = new CzarView({ collection: allCardsInPlay }).render();
      } else {
      }

      if( !self.player.get( 'socketid' ) ) {
        self.player.set({ 'socketid': newPlayers[newPlayers.length - 1].socketid });
      }

      return newPlayersCollection;
    },

    joinOrCreateGame: function() {
      console.info( 'GameView.joinOrCreateGame()' );
      var self = this;

      self.socket.emit( 'join game', self.game, function( data ) {
        //so this is only called if you're the first person
        //to join a game
        self.player.set({ 'gameHost': true });
        console.log( 'client updating game (response from server)', 'join game' );
        self.updateRoom( data, self );
      });

      self.socket.on( 'update room', function( data ) {
        self.updateRoom( data, self );
      });

      self.socket.on( 'new player', function( player ) {
        self.game.newPlayer( player, self );
      });

      this.socket.on( 'player left', function( badsocketid ) {
        self.game.playerLeft( badsocketid, self );
      });

    },

    syncFromLocalStorage: function() {
      console.log( 'GameView.syncFromLocalStorage()' );
      var gameFromLocalStorageJson = JSON.parse( localStorage.getItem( 'game' ) );
          playerSettingsJson = JSON.parse( localStorage.getItem( 'playerSettings' ) ),
          name = '', //can get player name from PlayerSettings
          self = this;

      if( playerSettingsJson ) {
        //lulz just for debuggins
        name = playerSettingsJson.displayName + ( new Date().getMilliseconds() );
      } else {
        //lulz just for debuggins

        //TODO
        name = 'bob' + ( new Date().getMilliseconds() );
      }
      var player = new PlayerModel( { name: name } );
      if( gameFromLocalStorageJson ) {
        //found a good game object in local storage
        localStorage.removeItem( 'game' );
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
        this.player = player;
        this.game = new GameModel( { id: this.id } );
        this.game.set(
          {
            players: new PlayersCollection( player )
          }
        );
      }
      self.player = player;
      console.log( 'self.player' );
      console.log( self.player );
      self.cardsInPlayView = new CardsInPlayView({ collection: self.player.get( 'cardsInPlay' )});
      self.playerCardView = new PlayerCardView( { collection: self.player.get( 'whitecards' ), game: self.game, player: self.player } );
      //self.blackCardInPlayView = new BlackCardInPlayView({ collection: self.game.get( 'blackCardsInPlay' )});
      this.playerListView = new PlayerListView( { collection: this.game.get( 'players' ) } );
      window.CAH.socket = self.socket;
    }
  });

  // Returns the View class
  return View;
});







