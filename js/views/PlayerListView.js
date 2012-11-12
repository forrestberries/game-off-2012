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

    render: function() {
      console.log( '%cPlayerListView.render()', 'color: red;' );
      console.log( this.collection );
      this.template = _.template( $("#players-list-view").html(),  {  players: this.collection } );
      this.$el.html(this.template);
      return this;
    },

    addPlayer: function( playerModel ) {
      this.collection.add( playerModel );
    }
  });

  // Returns the View class
  return View;
});