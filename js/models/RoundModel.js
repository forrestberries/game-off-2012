define(["jquery", "backbone"], function($, Backbone) {

    var Player = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             
             this.blackCard = new BlackCard();

        },

        // Default values for all of the Player Model attributes
        defaults: {

            whiteCards: []

            // blackCard

        }

    });

    // Returns the Model class
    return Player;

});

