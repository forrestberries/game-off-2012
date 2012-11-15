define([
  "jquery",
  "backbone",
  "collections/BlackCardsCollection",
  "collections/WhiteCardsCollection"], function($, Backbone, BlackCardsCollection, WhiteCardsCollection) {

  var Player = Backbone.Model.extend({

    // Model Constructor
    initialize: function() {

       //this.playerSettings = new PlayerSettings();
      this.set({ 'blackcards': new BlackCardsCollection() });
      this.set({ 'whitecards': new WhiteCardsCollection() });
    },

    // Default values for all of the Player Model attributes
    defaults: {

      name: "",

      socketid: "",

      isCzar: false,

      isGambling: false,

      isWinner: false,

      hasPlayed: false,

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