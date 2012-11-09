define(["jquery", "backbone"], function($, Backbone) {

    var Player = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {

             /*this.location = new Location();

             this.playerSettings = new PlayerSettings();*/

        },

        // Default values for all of the Player Model attributes
        defaults: {
            name: "",

            socketid: "",

            isCzar: false,

            isGambling: false,

            isWinner: false,

            hasPlayed: false,

            awesomePoints: 0,

            whiteCards: [],

            blackCards: [],

            cardsInPlay: []

            // location

            // playerSettings

        }

    });

    // Returns the Model class
    return Player;

});

