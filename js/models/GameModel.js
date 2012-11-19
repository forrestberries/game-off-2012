
define(["jquery",
  "backbone",
  "models/LocationModel",
  "models/DeckModel",
  "models/PlayerModel",
  "collections/WhiteCardsCollection",
  "collections/BlackCardsCollection"], function($, Backbone, Location, DeckModel, PlayerModel, WhiteCardsCollection, BlackCardsCollection ) {

  var Game = Backbone.Model.extend({

      // Model Constructor
      initialize: function() {

        this.set({ location: new Location() });
        this.set({ deck: new DeckModel() } );
        //this.location = new Location();

        //this.location.on('change', function() { console.log(this.location); });
         /*this.deck = new Deck();


         this.gameOptions = new GameOptions();

         this.czar = new Player();*/
      },

      playWhiteCard: function( player, socketid, cardText ) {
        var cardsArr, 
            target = -1;

        cardsArr = this.get( 'players' ).get( socketid ).get( 'whitecards' );
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
        targetCard.set({ 'playPosition': this.get( 'players' ).get( socketid ).get( 'cardsInPlay' ).length + 1 });

        this.get( 'players' ).get( socketid ).removeWhiteCard( targetCard );
        this.get( 'players' ).get( socketid ).get( 'cardsInPlay' ).add( targetCard );
        this.get( 'players' ).get( socketid ).set({ 'hasPlayed': true });
        
        //update local player..
        player.removeWhiteCard( targetCard );
        player.get( 'cardsInPlay' ).add( targetCard );
        player.set({ 'hasPlayed': true });

        console.log( this.get( 'players' ) );
        window.CAH.socket.emit( 'update room', this );
      },

      chooseCzar: function( self ) {
        var czarPosition = this.getRandomInt( 0, self.game.get( 'players' ).length );
        self.game.get( 'players' ).at( czarPosition ).set({ 'isCzar': true });
        if( self.game.get( 'players' ).at( czarPosition ).id === self.player.id ) {
          self.player.set({ 'isCzar': true });
        }
        self.socket.emit( 'czar chosen', self.game );
      },

      updateCards: function( whitecards, blackcards ) {
        var self = this,
            wcc = new WhiteCardsCollection( whitecards ),
            bcc = new BlackCardsCollection( blackcards );

        self.get( 'deck' ).set({ "whitecards": wcc });
        self.get( 'deck' ).set({ "blackcards": bcc });
      },

      gameCanBegin: function() {
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

      playerLeft: function( badsocketid, self ) {
        console.log( badsocketid + ' left the game' );
        self.game.get( 'players' ).each( function( model ) {
          if( model.get( 'socketid' ) === badsocketid ) {
            model.destroy();
          }
        });

        self.socket.emit( 'update server listing', self.game );
      },

      drawWhiteCard: function( callback ) {
        var whitecards = this.get( 'deck' ).get( 'whitecards' );
        var cardPosition = this.getRandomInt( 0, whitecards.length );
        var card = whitecards.at( cardPosition );
        whitecards.remove( card );
        callback( card );
      },

      nextRound: function( self ) {
          this.set({ currentRound: this.get( 'currentRound' ) + 1 });
          this.chooseCzar( self );
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

        location: {}

        // deck

        // location

        // gameOptions

        // czar (Player)

      }

  });

  // Returns the Model class
  return Game;

});