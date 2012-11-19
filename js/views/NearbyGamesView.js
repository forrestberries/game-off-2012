define(['jquery',
  'backbone',
  'collections/GamesCollection',
  'models/GameModel',
  'models/LocationModel',
  'text!templates/nearby_games.html'], function($, Backbone, GamesCollection, Game, Location, nearbyGamesHTML){
  var View = Backbone.View.extend({

    el: $("#nearby-games"),

    initialize: function() {
      var self = this;
      var userLoc = new Location();
      this.collection = new GamesCollection();
      this.collection.on('set change add remove reset', function() {
        self.render();
      });

      $('#join-game-nearby-modal').on('hidden', function() {
        clearTimeout(self.t);
      });

      userLoc.on("locationFound", function() {
        var URL = 'http://' + window.CAH.serverhost + '/games/location/' + userLoc.get('latitude') + ',' + userLoc.get('longitude');
        (function(){
          $("#nearby-games").find("#loadingNearby").show();
          $.getJSON( URL, function(data) {
            if(data) {
              self.collection.reset( data.games );
              $("#nearby-games").find("#loadingNearby").hide();
            }
          });

          var t = setTimeout(arguments.callee,10000);
          self.t = t;
        })();
      });
    },

    events: {
      'click .joinableGame': 'gameSelected'
    },

    render: function() {
      var self = this;
      console.log( 'NearbyGamesView.render()' );
      var compiledTemplate = _.template( nearbyGamesHTML, { games: this.collection });
      $("#nearby-games").find("#gameTable").html(compiledTemplate);
      $('.joinableGame').on('click', function(event) {
        self.gameSelected(event,self);
      });
      // should loop through game Ids and see if it matches
      // a gameId previously selected, then add the selected
      // class to it
      return this;
    },

    addGame: function ( game ) {
      this.collection.add( game );
    },

    gameSelected: function( event, self ) {
      var gameEntry = $( event.target ).parent();
      // add selected class to row, remove from others
      gameEntry.addClass('selected').siblings().removeClass('selected');
      var gameId = $(gameEntry[0]).data('id');
      self.trigger('gameChosen', gameId);
    }
  });

  // Returns the View class
  return View;
});