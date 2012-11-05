define(["jquery", "backbone"], function($, Backbone) {

    var GameOptions = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             

        },

        // Default values for all of the GameOptions Model attributes
        defaults: {
            
        }

    });

    // Returns the Model class
    return GameOptions;

});