define(["jquery", "backbone"], function($, Backbone) {

    var PlayerSettings = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {


        },

        // Default values for all of the PlayerSettings Model attributes
        defaults: {

            displayName: '',

            customDecks: [],

            gameLength: 15, // 15 rounds default

            handSize: 10 // per game rules, could be customizable

        }

    });

    // Returns the Model class
    return PlayerSettings;

});

