
define([
  'jquery',
  'backbone',
  'socket.io',
  'collections/PlayersCollection',
  'models/PlayerModel',
  'models/LocationModel',
  'models/GameModel',
  'models/BlackCardModel',
  'views/PlayerListView',
  'views/PlayerCardView',
  'views/GameWaitingView',
  'views/CardsInPlayView',
  'views/BlackCardInPlayView',
  'views/CzarView',
  'collections/WhiteCardsCollection',
  'collections/BlackCardsCollection',
  'models/DeckModel'], function($, Backbone, Socket, PlayersCollection, PlayerModel, LocationModel, GameModel, BlackCardModel, PlayerListView, PlayerCardView, GameWaitingView, CardsInPlayView, BlackCardInPlayView, CzarView, WhiteCardsCollection, BlackCardsCollection, DeckModel){
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
        card.set({ 'socketid': self.player.id });
        self.player.addWhiteCard( card );
        self.game.get( 'players' ).get( self.player.id ).set({ 'whitecards' : self.player.get( 'whitecards' ) });
        $( '#drawWhiteCard' ).attr("disabled", "disabled");
        self.socket.emit( 'update room', self.game );
      });
    },

    render: function() {
      console.log( 'GameView.render()' );
      this.template = _.template( $("#game-view").html(), { id: this.id } );
      this.playerListView.render();
      this.$el.html(this.template);
      return this;
    },

    gameInProgress: function( self ) {
      var alreadyHidden = ( $( '#waiting-msg' ).css( 'display' ) == 'none' );

      if( !alreadyHidden ) {
        self.gameWaitingView.hideModal();
      }
      //SOME BULLSHIT CONDITION CHECKS COMIN' UP BRO.
      //condition so the beginRound code is only executed by one client
      //Not sure how else to do this...
      console.log( 'is this person the game host', !!self.player.get( 'gameHost' ));
      if( !!self.player.get( 'gameHost' ) ) {
        if( !self.player.get( 'czarSetForCurrentRound' ) )  {
          //choose the czar
          self.player.set({'czarSetForCurrentRound': true});
          self.game.chooseCzar( self, function() {

          });
        }
      }
      if( self.game.get( 'czarSetForCurrentRound' ) ) {
        console.log( 'is this person the czar', !!self.player.get( 'isCzar' ));
        if( self.player.get( 'isCzar' ) ) {
          if( !self.czarView ) {
            self.czarView = new CzarView({ collection: self.game.get( 'allCardsInPlay' ), game:self.game, player: self.player }).render();
          } else {
            console.log( 'cards in play', self.game.get( 'allCardsInPlay' ) ) ;
            self.czarView.updateCards( self.game.get( 'allCardsInPlay' ) );
          }
        } else { //player is NOT the czar
          //draw some white cards once
          console.log( 'here the player is the czar ', !!self.player.get( 'isCzar' ) );
          if( self.player.get( 'whitecards' ).length < 1 ) {
            self.game.drawWhiteCards( self );
          }
        }
      }

      self.blackCardInPlayView.updateCards( self.game.get( 'blackCardsInPlay' ) );
    },

    updateRoom: function( data, self ) {
      console.log( 'client updating game' );
      console.log( data );

      this.playerListView.update( data.players );

      self.game.updateGamePlayers( data, self );
      self.game.updateGameObjectFromData( self, data );
      self.game.updateCards( data, self );


      if( self.game.gameCanBegin() ) {
        self.gameInProgress( self );
      }

      window.CAH.game = self.game;
      self.render();
    },

    joinOrCreateGame: function() {
      console.info( 'GameView.joinOrCreateGame()' );
      var self = this;

      self.socket.emit( 'join game', self.game, function( data ) {
        //so this is only called if you're the first person
        //to join a game
        self.player.set({ 'gameHost': true });
        self.updateRoom( data, self );
      });

      self.socket.on( 'blackcard chosen', function( data ) {
        console.log( 'on blackcard chosen ', data );
        self.game.set({ 'blackCardsInPlay': new BlackCardsCollection( new BlackCardModel( data.blackCardsInPlay[0] ) ) });
        self.blackCardInPlayView.updateCards( self.game.get( 'blackCardsInPlay' ) );
        console.log( self.game );
        self.socket.emit( 'update room', self.game );
      });
      self.socket.on( 'player update', function( players ) {

      });

      self.socket.on( 'update room', function( data ) {
        self.updateRoom( data, self );
      });

      self.socket.on( 'new player', function( player ) {
        self.game.newPlayer( player, self );
      });

      self.socket.on( 'czar chosen', function( data ) {
        self.updateRoom( data, self );
        self.game.set({ 'inProgress': true });
        self.game.set({'czarSetForCurrentRound': true});
        self.socket.emit( 'update room', self.game );
      });

      this.socket.on( 'player left', function( badsocketid ) {
        self.playerListView.playerLeft( badsocketid, self );
      });

    },

    spawnChildViews: function() {
      //this.cardsInPlayView = new CardsInPlayView({ collection: this.player.get( 'cardsInPlay' )});
      this.playerCardView = new PlayerCardView( { collection: this.player.get( 'whitecards' ), game: this.game, player: this.player } );
      this.blackCardInPlayView = new BlackCardInPlayView({ collection: this.game.get( 'blackCardsInPlay' ) });
      this.playerListView = new PlayerListView( { collection: this.game.get( 'players' ) } );
      this.playerListView.socket = this.socket;
      this.playerListView.collection.url = 'http://' + window.CAH.serverhost + '/games/id/' + this.id + '/players';

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
      window.CAH.socket = self.socket;
      self.spawnChildViews();
    }
  });

  // Returns the View class
  return View;
});