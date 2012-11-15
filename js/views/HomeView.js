define(['jquery',
  'backbone',
  'models/GameModel',
  'models/PlayerSettingsModel',
  'models/PlayerModel',
  'collections/PlayersCollection',
  'collections/GamesCollection',
  'views/NearbyGamesView',
  'text!templates/home.html'], function($, Backbone, Game, PlayerSettings, Player, PlayersCollection, GamesCollection, NearbyGamesView, homeHTML){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function() {
        var self = this;
        var player = new Player();
        var playerSettings = new PlayerSettings();
        this.player = player;
        this.playerSettings = playerSettings;
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
        return this.startGame(dispName, this.generateGameID());
    },

    // joinById acts like createGame but uses a set ID rather than an auto generated
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
      return this.startGame(dispName, gameId);

    },

    startGame: function(dispName, gameId) {
      // initialize player settings
      this.playerSettings.set( { displayName: dispName });
      this.player.set( { name: this.playerSettings.get('displayNameJoin') });
      var playersCollection = new PlayersCollection(this.player);

      // initialize Game object
      this.game.set({
        id : gameId,
        name : this.player.get('name'),
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
      var self = this;

      // load in player name into the fields for the user
      var localPlayer = JSON.parse(localStorage.getItem('playerSettings'));
      if(localPlayer) {
        $("#displayNameCreate").val(localPlayer.displayName);
        $("#displayNameJoin").val(localPlayer.displayName);
      }

      // clear errors on new modal, set proper focus location
      $("#new-game-modal").on('shown', function() {
        $('.errors').empty();
        $('#displayNameCreate').focus();
      });
      $("#join-game-id-modal").on('shown', function() {
        $('.errors').empty();
        if(localPlayer)
          $("#gameID").focus();
        else
          $("#displayNameJoin").focus();
      });
      $("#join-game-nearby-modal").on('shown', function() {
        if(localPlayer)
          $("#displayNameJoinNearby").focus();
        else
          $("#displayNameJoinNearby").focus();

        // poll for nearby games here

        var game1 = new Game( { name: "Game 1", currentRound: 5 } );
        var game2 = new Game( { name: "Game 2", currentRound: 14 } );
        self.game = game1;
        self.games = new GamesCollection ( game1 );
        self.games.add(game2);

        this.nearbyGamesView = new NearbyGamesView( { collection: self.games } );
        this.nearbyGamesView.render();
      });
      return this;
    },

    generateGameID: function() {
      var length = 5;
      return this.randomString(length);
    },

    // utility function to return a randomized string
    // taken from user sarsar on http://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
    randomString: function(length) {
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

      if (!length) {
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