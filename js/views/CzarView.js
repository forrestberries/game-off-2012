define(['jquery', 'backbone', 'collections/WhiteCardsCollection'], function($, Backbone, WhiteCardsCollection){
  var View = Backbone.View.extend({

    el: "section#czarCardsInPlay",

    initialize: function() {
      var self = this;
      this.collection.on( 'add remove change reset', function( data ) {
        self.render();
      });
    },

    events: {
    },
    render: function() {
      console.log( '%cCzarView.render()', 'color: blue;' );
      this.template = _.template( $("#czar-view").html(),  { cards: this.collection } );
      this.$el.html(this.template);
      return this;
    },

    updateCards: function( cards ) {
      this.collection.reset( cards.models );
    }

  });

  // Returns the View class
  return View;
});