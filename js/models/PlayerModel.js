define([
  "jquery",
  "backbone",
  "collections/BlackCardsCollection",
  "collections/WhiteCardsCollection"], function($, Backbone, BlackCardsCollection, WhiteCardsCollection) {

  var Player = Backbone.Model.extend({
    idAttribute: "socketid",
    // Model Constructor
    initialize: function() {
      this.set({ 'blackcards': new BlackCardsCollection() });
      this.set({ 'whitecards': new WhiteCardsCollection() });
      this.set({ 'cardsInPlay': new WhiteCardsCollection() });
      
      
    },

    addWhiteCard: function( card ) {
      this.get( 'whitecards' ).add( card );
    },

    removeWhiteCard: function( card ) {
      this.get( 'whitecards' ).remove( card );
    },

    playWhiteCard: function( card ) {

    },

    // Default values for all of the Player Model attributes
    defaults: {

      name: "",

      socketid: "",

      isCzar: false,

      isGambling: false,

      isWinner: false,

      hasPlayed: false,

      hasDrawnWhiteCards: false,

      hasDrawnBlackCard: false,

      awesomePoints: 0,

      whitecards: [],

      blackcards: [],

      cardsInPlay: []
      
      // playerSettings

    }

  });

  // Returns the Model class
  return Player;

});