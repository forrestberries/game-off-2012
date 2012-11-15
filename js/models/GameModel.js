
define(["jquery",
  "backbone",
  "models/LocationModel",
  "models/DeckModel"], function($, Backbone, Location, DeckModel ) {

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

      createGameFromData: function( data ) {

      },

      nextRound: function() {
          this.set({ currentRound: this.get( 'currentRound' ) + 1 });
      },

      // Default values for all of the Game Model attributes
      defaults: {

        players: [],

        //id: "",

        currentRound: 0,

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