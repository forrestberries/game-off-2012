define(["jquery", "backbone", "models/CardModel"], function($, Backbone, Card) {

    var BlackCard = Card.extend({

        // Model Constructor
        initialize: function() {
            this.responses = [];
        },

        // Default values for all of the BlackCard:Card Model attributes
        defaults: {

            isPickTwo: false,
            isPickThree: false

        }

    });

    // Returns the Model class
    return BlackCard;

});