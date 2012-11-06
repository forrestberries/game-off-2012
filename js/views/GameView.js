define(['jquery', 'backbone'], function($, Backbone){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function( id ) {
      this.id = id;
      this.template = _.template( $("#game-view").html(), { id: id } );

      //this.sync();
      this.render();
    },

    events: {

    },

    sync: function() {
      this.socket = io.connect( 'http://meowstep.com:20080' );
      /* HARD CODED, DELETE WHEN MODELS ARE FINISHED */
      var player = {},
          game = {};
      player.name = 'bob';
      game.players = [];
      game.players.push( player );
      /* END HARD CODED SECTION */
      
      this.socket.emit( 'join game', game, updateGame );
      this.socket.on( 'join game', updateGame );
    },

    updateGame: function( data ) {
      console.log( 'client updating game' );
    },

    render: function() {
      this.$el.html(this.template);
      return this;
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