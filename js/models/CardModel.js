define(["jquery", "backbone"], function($, Backbone) {

    var Card = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             

        },

        // Default values for all of the Card Model attributes
        defaults: {

            isCustom: false,

            playerOwner: "",

            text: "",

            inPlay: false

        }

    });

    // Returns the Model class
    return Card;

});