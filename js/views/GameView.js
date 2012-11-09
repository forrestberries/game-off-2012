define(['jquery', 'backbone', 'socket.io', 'collections/PlayersCollection', 'models/PlayerModel', 'models/LocationModel'], function($, Backbone, Socket, PlayersCollection, PlayerModel, LocationModel){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function( id ) {
      console.log( 'GameView initialize()' );
      this.id = id;
      this.socket = {};

      this.sync();
      this.render();
    },

    events: {

    },

    updateGame: function( data ) {
      console.log( 'client updating game' );
      this.game = data;
      console.log( '-----game-----' );
      console.log( this.game );
    },

    render: function() {
      this.template = _.template( $("#game-view").html(), { id: this.id, players: this.players } );
      this.$el.html(this.template);
      return this;
    },

    handleNewPlayer: function( player ) {
      this.game.players.push( player );
      /*var p = new PlayerModel( player );
      this.players.add( p );*/
      console.log( '-----players-----' );
      console.log( this.game.players );
      this.socket.emit( 'join game', this.game );
    },

    joinOrCreateGame: function( game ) {
      console.log( 'GameView.joinOrCreateGame()' );
      this.game = game;
      this.socket.on('confirm', function(msg){console.log(msg.message);})
      this.socket.emit( 'join game', game, this.updateGame );
      this.socket.on( 'update room', this.updateGame );
      this.socket.on( 'new player', function( player ) {
        this.game.players.push( player );
        /*var p = new PlayerModel( player );
        this.players.add( p );*/
        console.log( '-----players-----' );
        console.log( this.game.players );
        

        this.emit( 'update room', this.game );
      });
    },

    sync: function() {
      console.log( 'GameView.sync()' );
      var socket = io.connect( 'http://localhost:20080' );
      this.socket = socket;
      /* HARD CODED, DELETE WHEN MODEL CAN BE GRABBED FROM LOCAL STORAGE  */
      var player = {},
          game = {};
      player.name = 'bob' + ( new Date().getSeconds() );
      player.location = new LocationModel();
      game.players = [];
      game.id = this.id;
      game.players.push( player );
      /* END HARD CODED SECTION */

      this.joinOrCreateGame( game );

    }
  });

  // Returns the View class
  return View;
});

/*


      var socket = io.connect( 'http://meowstep.com:20080' );
      this.socket = socket;
      this.socket.on( 'join game room', function( data ) {
        console.log( 'join game room handler local hit' );
        console.log( data.msg );
      });

    gameUpdate: function() {
      var name = this.$el.find( '#display-name' ).val();
      this.name = name;
      var data = {
        displayname: name,
        game: 'room1'
      };
      this.data = data;
      this.socket.emit( 'join game room', this.data, function( response ) {
        console.log( response.msg );
      });
    },
    */