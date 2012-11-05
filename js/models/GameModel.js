define(["jquery", "backbone"], function($, Backbone) {

    var Game = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             
             this.deck = new Deck();

             this.location = new Location();
             
             this.gameOptions = new GameOptions();

             this.czar = new Player();
        },

        // Default values for all of the Game Model attributes
        defaults: {

            players: [],

            id: "",

            currentRound: 0,

            awesomePoints: 0

            // deck

            // location

            // gameOptions

            // czar (Player)

        }

    });

    // Returns the Model class
    return Game;

});

