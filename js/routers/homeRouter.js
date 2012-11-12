define([
  'jquery',
  'backbone',
  'views/HomeView',
  'views/NearbyGamesView'], function($, Backbone, HomeView, NearbyGamesView){

  var Router = Backbone.Router.extend({

    initialize: function(){
      // Tells Backbone to start watching for hashchange events
      Backbone.history.start();
    },

    // All of your Backbone Routes (add more)
    routes: {
      // When there is no hash bang on the url, the home method is called
      "": "home",
      "join-game-nearby": "nearbySearch"
    },

    home: function() {
      var homeView = new HomeView();
      homeView.render();
    },

    nearbySearch: function() {
      var nearbyGamesView = new NearbyGamesView();
      nearbyGamesView.render();
    }
  });

  // Returns the Router class
  return Router;

});