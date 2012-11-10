define(['jquery', 'backbone', 'models/GameModel', 'models/PlayerSettingsModel'], function($, Backbone, Game, PlayerSettings){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function() {
      // Setting the view's template property
      this.template = _.template( $("#home-view").html() );
      
    },

    events: {
      "click #create": "createGame"
    },

    // creates a new game
    createGame: function() {
        var dispName = $("#displayName").val();
        if(dispName === null || dispName === "") {

          $(".errors").text('Display Name must not be empty!');
          $("#displayName").focus();
          return;
        }
        var game = new Game();
        game.name = dispName;
        
        // do processing here
        game.id = 1; // need to generate a unique ID here

        window.location = 'game.html#id/game' + game.id;
        console.log('forwarding ' + game.name + ' to ' + window.location);
    },

    render: function() {
      this.$el.html(this.template);

      $("#new-game-modal").on("hidden", function() {
          // Clear's any error messages
          $(".errors").empty();
          console.log('modal is hidden');

      });
      console.log($("#new-game-modal"));

      return this;
    }
  });

  // Returns the View class
  return View;
});