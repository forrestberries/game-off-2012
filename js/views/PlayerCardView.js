define(['jquery', 'backbone', 'collections/WhiteCardsCollection'], function($, Backbone, WhiteCardsCollection){
  var View = Backbone.View.extend({

    el: "section#cards",

    initialize: function() {
      var self = this;
      this.collection.on( 'add remove change set', function( data ) {
        self.render();
      });
    },

    events: {

    },

    render: function() {
      console.log( '%cPlayerCardView.render()', 'color: red;' );
      console.log( this.collection );
      this.template = _.template( $("#players-card-view").html(),  {  cards: this.collection } );
      this.$el.html(this.template);
      return this;
    },

    addCard: function( cardModel ) {
      this.collection.add( cardModel );
    }
  });

  // Returns the View class
  return View;
});