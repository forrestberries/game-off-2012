define(['jquery', 'backbone', 'collections/PlayersCollection'], function($, Backbone, PlayersCollection){
  var View = Backbone.View.extend({

    el: "section#players",

    initialize: function() {
      var self = this;
      this.collection.on( 'add remove change set', function( data ) {
        self.render();
      });
    },

    events: {

    },

    update: function( models ) {
      if( !models ) {
        var self = this,
            success = function( data ) {
          self.collection.reset( data );
        };
        this.collection.fetch({ success: success });
      } else {
        this.collection.reset( models );
      }
    },

    render: function() {
      this.template = _.template( $("#players-list-view").html(),  {  players: this.collection } );
      this.$el.html(this.template);
      return this;
    },

    playerLeft: function( badsocketid, self ) {
      var clazz = this;
      console.log( badsocketid + ' left the game' );
      self.game.get( 'players' ).remove( self.game.get( 'players' ).get( badsocketid ) );
      this.collection.remove( badsocketid );
      clazz.socket.emit( 'update server listing', self.game );
    },

    addPlayer: function( playerModel ) {
      this.collection.add( playerModel );
    }
  });

  // Returns the View class
  return View;
});