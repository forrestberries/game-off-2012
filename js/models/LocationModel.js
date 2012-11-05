define(["jquery", "backbone"], function($, Backbone) {

    var Location = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             

        },

        // Default values for all of the Location Model attributes
        defaults: {

            latitude: "",

            longitude: ""

        }

    });

    // Returns the Model class
    return Location;

});