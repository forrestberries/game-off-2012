define(["jquery",
  "backbone",
  "models/LocationModel",
  "models/DeckModel",
  "models/PlayerModel",
  "collections/WhiteCardsCollection",
  "collections/BlackCardsCollection",
  "collections/PlayersCollection"], function($, Backbone, Location, DeckModel, PlayerModel, WhiteCardsCollection, BlackCardsCollection, PlayersCollection ) {

  var Game = Backbone.Model.extend({
      idAttribute: "id",
      // Model Constructor
      initialize: function() {

        this.set({ location: new Location() });
        this.set({ deck: new DeckModel() } );
        this.set({ 'blackCardsInPlay': new BlackCardsCollection() });
      },

      hasAnyonePlayed: function() {
        for( var i = 0; i < this.get( 'players' ).length; i++ ) {
          if( this.get( 'players' ).models[i].get( 'hasPlayed' ) ) {
            return true;
          }
        }
        return false;
      },

      beginRound: function( self ) {
        if( self.game.get( 'czarSetForCurrentRound' ) ) {

        } else {
          //goin' to do some synchronous stuff.. :*(
          this.chooseCzar( self, function(){
            //not needed for now...
          });
        }
      },

      chooseCzar: function( self, callback ) {
        var numOfPlayers = self.game.get( 'players' ).length,
            round = self.game.get( 'currentRound' ),
            czarPosition = round % numOfPlayers;
        self.game.get( 'players' ).at( czarPosition ).set({ 'isCzar': true });
        self.socket.emit( 'czar chosen', self.game );
        callback();
      },

      updateCards: function( data, self ) {
        var wcc = new WhiteCardsCollection( data.deck.whitecards ),
            bcc = new BlackCardsCollection( data.deck.blackcards ),
            bcip = new BlackCardsCollection( data.blackCardsInPlay );
        this.get( 'deck' ).set({
          "whitecards": wcc,
          "blackcards": bcc
        });
        if( self.player.get( 'gameHost' ) && !self.player.get( 'hasDrawnBlackCard' ) ) {
          self.player.set({ 'hasDrawnBlackCard': true });
          self.game.drawBlackCard( self, function() {
            self.game.set({ 'blackCardsInPlay': self.game.get( 'blackCardsInPlay' ) });
            self.socket.emit( 'blackcard chosen', self.game, self.game.get( 'blackCardsInPlay' ).models );
          });
        } else {
          if( bcip.length > 0 ) {
            bcip.models[0].set({
              'responses': data.blackCardsInPlay[0].responses
            });
          }
          self.game.set({
            "blackCardsInPlay": bcip
          });
        }
      },

      updateGameObjectFromData: function( self, data ) {
        self.game.set({
          'awesomePoints': data.awesomePoints,
          'currentRound': data.currentRound,
          'id': data.id,
          'location': data.location,
          'name': data.name,
          'inProgress': data.inProgress,
          'czarSetForCurrentRound': data.czarSetForCurrentRound
        });
      },

      updateGamePlayers: function( data, self ) {
        var newPlayers = data.players,
            newPlayersCollection = new PlayersCollection(),
            allCardsInPlay = new WhiteCardsCollection();

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

        if( !self.player.get( 'socketid' ) ) {
          self.player.set({ 'socketid': newPlayers[newPlayers.length - 1].socketid });
        }
        self.game.set({
          'players': newPlayersCollection,
          'allCardsInPlay': allCardsInPlay
        });
        return newPlayersCollection;
      },

      gameCanBegin: function() {
        return ( this.get( 'players' ).length > 2 );
      },

      newPlayer: function( player, self ) {
        var newPlayer = new PlayerModel( player );
        if( !self.player ) {
          self.player = newPlayer;
        }
        self.playerListView.addPlayer( newPlayer );
        self.game.get( "players" ).add( newPlayer );

        self.socket.emit( 'update room', self.game );
      },

      drawWhiteCards: function( self ) {
        var numberOfCards = 10; //TODO get from Settings
        for( var i = 0; i < numberOfCards; i++ ) {
          var whitecards = this.get( 'deck' ).get( 'whitecards' ),
              cardPosition = this.getRandomInt( 0, whitecards.length ),
              card = whitecards.at( cardPosition );


          whitecards.remove( card );
          card.set({ 'socketid': self.player.id });
          self.player.addWhiteCard( card );
          self.game.get( 'players' ).get( self.player.id ).set({ 'whitecards' : self.player.get( 'whitecards' ) });
        }
        self.socket.emit( 'update room', self.game );
      },

      drawBlackCard: function( self, callback ) {
        var blackcards = self.game.get( 'deck' ).get( 'blackcards' ),
            cardPosition = this.getRandomInt( 0, blackcards.length ),
            card = blackcards.at( cardPosition );
        self.game.get( 'blackCardsInPlay' ).add( card );
        self.game.set({ 'blackCardsInPlay': self.game.get( 'blackCardsInPlay' ) });
        blackcards.remove( card );
        callback();
      },

      nextRound: function( self ) {
        this.set({ currentRound: this.get( 'currentRound' ) + 1 });
        this.$el.find( '#drawWhiteCard' ).attr("disabled", "disabled");
        this.beginRound( self );
      },

      getRandomInt: function( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
      },

      // Default values for all of the Game Model attributes
      defaults: {

        currentRound: 1,

        awesomePoints: 0,

        name: "",

        location: {}

      }

  });

  // Returns the Model class
  return Game;

});