define(['jquery', 
  'backbone', 
  'models/GameModel', 
  'models/PlayerSettingsModel',
  'text!templates/home.html'], function($, Backbone, Game, PlayerSettings, homeHTML){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function() {
      
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

    joinGame: function() { 

    },

    render: function() {
      this.$el.html(homeHTML);
      return this;
    }
  });

  // Returns the View class
  return View;
});