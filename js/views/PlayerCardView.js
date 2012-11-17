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
      'click .player-whitecard': 'playWhiteCard'
    },
    playWhiteCard: function( event ) {
      var socketid = $( event.target.outerHTML ).data( 'id' );
      window.CAH.game.playWhiteCard( socketid );
    },

    render: function() {
      console.log( '%cPlayerCardView.render()', 'color: blue;' );
      _.each(this.collection.toJSON(), function(card) {
        console.log( card );
      });
      this.template = _.template( $("#players-card-view").html(),  {  cards: this.collection } );
      console.log( this.template);
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