
/*
Need to go through and refine the choose czar logic and when the udpating happens to continue the rest of the round.
After that, need to set hasPlayed to true after playing awhite card then disable additional playes.
*/


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
        //this.location = new Location();

        //this.location.on('change', function() { console.log(this.location); });
         /*this.deck = new Deck();


         this.gameOptions = new GameOptions();

         this.czar = new Player();*/
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

      playWhiteCard: function( player, socketid, cardText ) {
        var cardsArr, 
            target = -1;

        cardsArr = player.get( 'whitecards' );
        console.log( cardsArr );
        for( var i = 0; i < cardsArr.length; i++ ) {
          var currentText = cardsArr.models[i].get( 'text' );
          if( ( currentText.indexOf( cardText ) > -1 ) && ( currentText.length == cardText.length ) ) {
            target = i;
            break;
          }
        }
        console.log( cardsArr, target);
        var targetCard = cardsArr.models[target];
        targetCard.set({ 
          'playPosition': this.get( 'players' ).get( socketid ).get( 'cardsInPlay' ).length + 1,
          'inPlay': true 
        });
        
        //update local player..
        player.removeWhiteCard( targetCard );
        player.get( 'cardsInPlay' ).add( targetCard );
        player.set({ 'hasPlayed': true });

        //now update game object
        this.get( 'players' )
          .get( socketid )
          .set({ 
            'whitecards': player.get( 'whitecards' ),
            'cardsInPlay': player.get( 'cardsInPlay' ),
            'hasPlayed': true 
          });

        console.log( self.player.toJSON() );
        window.CAH.socket.emit( 'update room', this );
      },

      chooseCzar: function( self, callback ) {
        var czarPosition = this.getRandomInt( 0, self.game.get( 'players' ).length - 1 );
        console.log( 'The CZAR is : ', self.game.get( 'players' ).at( czarPosition ).get( 'name' ) );
        self.game.get( 'players' ).at( czarPosition ).set({ 'isCzar': true });
        self.socket.emit( 'czar chosen', self.game );
        callback();
      },

      updateCards: function( whitecards, blackcards, blackCardsInPlay ) {
        var self = this,
            wcc = new WhiteCardsCollection( whitecards ),
            bcc = new BlackCardsCollection( blackcards ),
            bcip = new BlackCardsCollection( blackCardsInPlay );

        self.get( 'deck' ).set({ 
          "whitecards": wcc,
          "blackcards": bcc
        });
        self.set({
          "blackCardsInPlay": bcip
        });
      },

      updateGameObjectFromData: function( self, data ) {
        self.game.set({
          'awesomePoints': data.awesomePoints,
          'currentRound': data.currentRound,
          'id': data.id,
          'location': data.location,
          'name': data.name,
          'czarSetForCurrentRound': data.czarSetForCurrentRound
        });
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
        console.log('Can the game  begin?', this.get( 'players').length );
        return ( this.get( 'players' ).length > 2 );
      },

      newPlayer: function( player, self ) {
        console.group( '%cNew Player', 'color: green;' );
        var newPlayer = new PlayerModel( player );
        if( !self.player ) {
          self.player = newPlayer;
        }
        self.playerListView.addPlayer( newPlayer );
        self.game.get( "players" ).add( newPlayer );

        console.log( "%c-----players-----", "color: blue;" );
        console.log( self.game.get( 'players' ) );
        console.groupEnd();

        self.socket.emit( 'update room', self.game );
      },

      drawWhiteCards: function( self ) {
        var numberOfCards = 10; //TODO get from Settings
        for( var i = 0; i < numberOfCards; i++ ) {
          var whitecards = this.get( 'deck' ).get( 'whitecards' ),
              cardPosition = this.getRandomInt( 0, whitecards.length ),
              card = whitecards.at( cardPosition );

          console.log( 'getting card at cardPosition ' + cardPosition );

          whitecards.remove( card );
          card.set({ 'socketid': self.player.id });
          self.player.addWhiteCard( card );
          self.game.get( 'players' ).get( self.player.id ).set({ 'whitecards' : self.player.get( 'whitecards' ) });
        }
        self.socket.emit( 'update room', self.game );
      },

      drawBlackCard: function( self, callback ) {
        var blackcards = this.get( 'deck' ).get( 'blackcards' ),
            cardPosition = this.getRandomInt( 0, blackcards.length ),
            card = blackcards.at( cardPosition );

        blackcards.remove( card );
        card.set({ 'socketid': self.player.id });
        self.game.putBlackCardInPlay( card, self, callback );

      },

      putBlackCardInPlay: function( card, self, callback ) {
        this.get( 'blackCardsInPlay' ).add( card );
        self.blackCardInPlayView.addCard( card );
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

        players: [],

        //id: "",

        currentRound: 1,

        awesomePoints: 0,

        name: "",

        location: {},

        blackCardsInPlay: []

        // deck

        // location

        // gameOptions

        // czar (Player)

      }

  });

  // Returns the Model class
  return Game;

});