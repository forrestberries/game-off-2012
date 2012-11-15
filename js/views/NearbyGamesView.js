define(['jquery',
  'backbone',
  'collections/GamesCollection',
  'models/GameModel',
  'text!templates/nearby_games.html'], function($, Backbone, GamesCollection, Game, nearbyGamesHTML){
  var View = Backbone.View.extend({

    el: $("#nearby-games"),

    initialize: function() {
      console.log('initializing Nearby Games Search view');
      var self = this;
    },

    events: {
    },

    render: function() {
      console.log( '%cNearbyGamesView.render()', 'color: red;' );
      console.log( this.collection );
      var compiledTemplate = _.template( nearbyGamesHTML, { games: this.collection });
      $("#nearby-games").html(compiledTemplate);
      return this;
    },

    addGame: function ( game ) {
      this.collection.add( game );
    }
  });

  // Returns the View class
  return View;
});