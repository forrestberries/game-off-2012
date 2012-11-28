define(['jquery', 'backbone', 'collections/BlackCardsCollection'], function($, Backbone, BlackCardsCollection){
  var View = Backbone.View.extend({

    el: "section#blackCardInPlay",

    initialize: function() {
      var self = this;
      this.on( 'clear', this.resetView );
      this.collection.on( 'add remove change reset', function( data ) {
        self.render();
      });
    },

    events: {
    },

    resetView: function() {
      this.collection.reset();
      this.remove();
    },

    render: function() {
      console.log( '%cBlackCardInPlayView.render()', 'color: blue;' );
      this.template = _.template( $("#black-card-in-play-view").html(),  {  cards: this.collection } );
      this.$el.html(this.template);
      return this;
    },

    addCard: function( cardModel ) {
      this.collection.add( cardModel );
    },

    removeCard: function( cardModel ) {
      this.collection.remove( cardModel );
    },

    updateCards: function( cards ) {
      this.collection.reset( cards.models );
    }
  });

  // Returns the View class
  return View;
});