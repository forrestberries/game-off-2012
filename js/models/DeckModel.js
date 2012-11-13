define(["jquery",
        "backbone",
        'models/WhiteCardModel',
        'models/BlackCardModel',
        'collections/WhiteCardsCollection',
        'collections/BlackCardsCollection'], function($, Backbone, WhiteCardModel, BlackCardModel, WhiteCardsCollection, BlackCardsCollection) {

  var Deck = Backbone.Model.extend({

    // Model Constructor
    initialize: function() {

    },

    drawWhiteCard: function() {

    },

    drawBlackCard: function() {

    },

    shuffle: function() {

    },

    loadCards: function() {
      this.loadWhiteCards();
      this.loadBlackCards();
    },

    loadWhiteCards: function() {
      var self = this;

      self.whitecards = new WhiteCardsCollection();
      $.getJSON( 'data/white-cards.json', function( response ){
         for( var i = 0; i < response.cards.length; i++ ) {
            var whiteCard = new WhiteCardModel( { text: response.cards[i] } );
            self.whitecards.add( whiteCard );
         }
         self.trigger( 'white cards loaded' );
      });
    },

    loadBlackCards: function() {
      var self = this;

      self.blackcards = new BlackCardsCollection();
      $.getJSON( 'data/black-cards.json', function( response ){
         for( var i = 0; i < response.cards.length; i++ ) {
            var blackCard = new BlackCardModel( { text: response.cards[i] } );
            self.blackcards.add( blackCard );
         }
         self.trigger( 'black cards loaded' );
      });
    },

    // Default values for all of the Deck Model attributes
    defaults: {

      whitecards: [],
      blackcards: []

    }

  });

  // Returns the Model class
  return Deck;

});