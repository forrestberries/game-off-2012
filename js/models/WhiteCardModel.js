define(["jquery", "backbone", "models/CardModel"], function($, Backbone, Card) {

    var WhiteCard = Card.extend({

        // Model Constructor
        initialize: function() {
             

        },

        // Default values for all of the WhiteCard:Card Model attributes
        defaults: {

            playPosition: 0

        }

    });

    // Returns the Model class
    return WhiteCard;

});