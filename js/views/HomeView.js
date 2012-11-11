define(['jquery',
  'backbone',
  'models/GameModel',
  'models/PlayerSettingsModel',
  'collections/PlayersCollection',
  'models/PlayerModel',
  'text!templates/home.html'], function($, Backbone, Game, PlayerSettings, PlayersCollection, Player, homeHTML){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function() {
        var player = new Player();
        var playerSettings = new PlayerSettings();
        var game = new Game();

        this.player = player;
        this.playerSettings = playerSettings;
        this.game = game;
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

        this.playerSettings.set( { displayName: dispName });
        this.player.set( { name: dispName });
        var playersCollection = new PlayersCollection(this.player);

        this.game.set({
          id : this.generateGameID(),
          name : 'Created by: ' + this.player.get('name'),
          players: playersCollection
        });

        console.log(this.game);

        localStorage.setItem('playerSettings', JSON.stringify(this.playerSettings));
        localStorage.setItem('game', JSON.stringify(this.game));

        window.location = 'game.html#/id/' + this.game.id;
        console.log('forwarding ' + this.game.get('name') + ' to ' + window.location);
    },

    joinGame: function() {
       // nearby, use URL: http://meowstep.com:20080/games/location/56,91
       var URL = 'http://meowstep.com:20080/games/location/56,91';
       $.getJSON(URL,function(data) { console.log(data); });
       // populate collection of games in modal
    },

    render: function() {
      this.$el.html(homeHTML);
      var localPlayer = JSON.parse(localStorage.getItem('playerSettings'));
      if(localPlayer) {
        $("#displayName").val(localPlayer.displayName);
      }
      return this;
    },

    generateGameID: function() {
      var length = 5;
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

      if (! length) {
          length = Math.floor(Math.random() * chars.length);
      }

      var str = '';
      for (var i = 0; i < length; i++) {
          str += chars[Math.floor(Math.random() * chars.length)];
      }
      return str;
    }
  });

  // Returns the View class
  return View;
});