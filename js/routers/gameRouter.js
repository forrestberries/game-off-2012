define(['jquery','backbone', 'views/GameView'], function($, Backbone, GameView){

  var Router = Backbone.Router.extend({

    initialize: function(){
      // Tells Backbone to start watching for hashchange events
      Backbone.history.start();
    },

    // All of your Backbone Routes (add more)
    routes: {
      
      "id/:id": "home",
      'last-round': 'showLastRound',
      '': 'error'
    },

    home: function( id ) {
      console.log( 'creating new GameView with id ' + id );
      var gameView = new GameView( id );
    },
    showLastRound: function() {

    },
    error: function() {
      console.error( 'Attempted to access GameView with no id.' );
    }
  });

  // Returns the Router class
  return Router;

});