define(["jquery", "backbone"], function($, Backbone) {

    var Deck = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             

        },

        // Default values for all of the Deck Model attributes
        defaults: {

            cards: []

        }

    });

    // Returns the Model class
    return Deck;

});