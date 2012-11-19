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
      var card = $( event.target ),
          self = this,
          cardText = card.text(),
          socketid = card.data( 'id' );
      console.log( 'PlayerCardView.playWhiteCard(): socket of person who owns me ' + socketid );
      self.options.game.playWhiteCard( self.options.player, socketid, cardText );
    },

    render: function() {
      console.log( '%cPlayerCardView.render()', 'color: blue;' );
      this.template = _.template( $("#players-card-view").html(),  {  cards: this.collection } );
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