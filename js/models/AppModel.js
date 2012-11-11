define(["jquery", "backbone"], function($, Backbone) {

    var App = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             
             /*this.player = new Player();

             this.game = new Game();

             this.gameOptions = new GameOptions();*/

        },

        // Default values for all of the App Model attributes
        defaults: {

        }

    });

    // Returns the Model class
    return App;

});

