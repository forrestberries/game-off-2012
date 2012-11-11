define(["jquery", "backbone"], function($, Backbone) {

    var Round = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             
             /*this.blackCard = new BlackCard();*/

        },

        // Default values for all of the Round Model attributes
        defaults: {

            whiteCards: []

            // blackCard

        }

    });

    // Returns the Model class
    return Round;

});

