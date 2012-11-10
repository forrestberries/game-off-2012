define(["jquery", 
    "backbone", 
    "models/LocationModel", 
    "models/PlayerSettingsModel"], function($, Backbone, Location, PlayerSettings) {

    var Player = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             
             this.location = new Location();
             
             this.playerSettings = new PlayerSettings();

        },

        // Default values for all of the Player Model attributes
        defaults: {

            isCzar: false,

            isGambling: false,

            isWinner: false,

            hasPlayed: false,

            awesomePoints: 0,

            whiteCards: [],

            blackCards: [],

            id: "",

            cardsInPlay: []

            // location

            // playerSettings

        }

    });

    // Returns the Model class
    return Player;

});

