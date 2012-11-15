
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
        if( this.gameCanBegin() ) {
          self.gameWaitingView.hideModal();
        }
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

      drawWhiteCard: function() {
        var whitecards = this.get( 'deck' ).get( 'whitecards' );
        var cardPosition = this.getRandomInt( 0, whitecards.length );
        var card = whitecards.at( cardPosition );
        whitecards.remove( card );
        return card;
      },

      nextRound: function() {
          this.set({ currentRound: this.get( 'currentRound' ) + 1 });
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