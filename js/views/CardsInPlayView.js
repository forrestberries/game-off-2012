define(['jquery', 'backbone', 'collections/WhiteCardsCollection', 'collections/BlackCardsCollection'], function($, Backbone, WhiteCardsCollection, BlackCardsCollection){
  var View = Backbone.View.extend({

    el: "section#cardsInPlay",

    initialize: function() {
      var self = this;
      this.collection.on( 'add remove change set', function( data ) {
        self.render();
      });
    },

    render: function() {
      console.log( '%cCardsInPlayView.render()', 'color: blue;' );
      this.template = _.template( $("#cards-in-play-view").html(),  { cards: this.collection } );
      console.log( this.template);
      this.$el.html(this.template);
      return this;
    },

    addCard: function( cardModel ) {
      this.collection.add( cardModel );
    },

    removeCard: function( cardModel ) {
      this.collection.remove( cardModel );
    }
  });

  // Returns the View class
  return View;
});