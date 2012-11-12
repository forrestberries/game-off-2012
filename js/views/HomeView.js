define(['jquery',
  'backbone',
  'models/GameModel',
  'models/PlayerSettingsModel',
  'models/PlayerModel',
  'collections/PlayersCollection',
  'text!templates/home.html'], function($, Backbone, Game, PlayerSettings, Player, PlayersCollection, homeHTML){
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
      "click #create": "createGame",
      "click #joinId": "joinById"
    },

    // creates a new game
    createGame: function() {
        var dispName = $("#displayNameCreate").val();
        if(dispName === null || dispName === "") {
          $(".errors").text('Display Name must not be empty!');
          $("#displayNameCreate").focus();
          return;
        }

        this.playerSettings.set( { displayName: dispName });
        this.player.set( { name: this.playerSettings.get('displayName') });
        var playersCollection = new PlayersCollection(this.player);

        this.game.set({
          id : this.generateGameID(),
          name : 'Created by: ' + this.player.get('name'),
          players: playersCollection
        });

        // ideally, we'll store custom settings in localStorage
        // so that users don't need to keep entering things like
        // their display name, etc.
        localStorage.setItem('playerSettings', JSON.stringify(this.playerSettings));
        localStorage.setItem('game', JSON.stringify(this.game));

        // foward user to the GameView (router will pick up this request)
        window.location = 'game.html#/id/' + this.game.id;
    },

    joinById: function() {
      var dispName = $("#displayNameJoin").val();
      if(dispName === null || dispName === "") {
        $(".errors").text('Display Name must not be empty!');
        $("#displayNameJoin").focus();
        return;
      }
      // parse game ID
      var gameId = $('#gameID').val();
      if(gameId === null || gameId === "") {
        $(".errors").text('Game ID must not be empty!');
        $("#gameID").focus();
        return;
      }

      this.playerSettings.set( { displayName: dispName });
      this.player.set( { name: this.playerSettings.get('displayNameJoin') });
      var playersCollection = new PlayersCollection(this.player);

      this.game.set({
        id : gameId,
        name : 'Joined by: ' + this.player.get('name'),
        players: playersCollection
      });

      // ideally, we'll store custom settings in localStorage
      // so that users don't need to keep entering things like
      // their display name, etc.
      localStorage.setItem('playerSettings', JSON.stringify(this.playerSettings));
      localStorage.setItem('game', JSON.stringify(this.game));

      // foward user to the GameView (router will pick up this request)
      window.location = 'game.html#/id/' + this.game.id;
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
        $("#displayNameCreate").val(localPlayer.displayName);
        $("#displayNameJoin").val(localPlayer.displayName);
      }
      $("#new-game-modal").on('shown', function() {
        console.log('new game modal opened');
        $('#displayNameCreate').focus();
      });
      $("#join-game-id-modal").on('shown', function() {
        console.log('join game by id modal opened');
        if(localPlayer)
          $("#gameID").focus();
        else
          $("#displayNameJoin").focus();
      });
      return this;
    },

    generateGameID: function() {
      var length = 5;
      return this.randomString(length);
    },

    // utility function to return a randomized string
    randomString: function(length) {
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