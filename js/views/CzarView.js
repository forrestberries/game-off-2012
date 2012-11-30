define(['jquery', 'backbone', 'collections/WhiteCardsCollection'], function($, Backbone, WhiteCardsCollection){
  var View = Backbone.View.extend({

    el: "section#czarCardsInPlay",

    resetView: function() {
      this.collection.reset();
      this.$el.empty();
    },

    initialize: function() {
      var self = this;
      this.on( 'clear', this.resetView );
    },

    events: {
      'click .player-whitecard': 'chooseWinnerCard'
    },

    render: function() {
      console.log( '%cCzarView.render()', 'color: blue;' );
      // mask cards until all players (except czar) have played
      if (this.options.game.get( 'players' ).length -1 !== this.collection.length) {
        for (var i = 0; i < this.collection.length; i++) {
          this.collection.at(i).set( { text: 'Cards Against Humanity' }, { "silent": true });
        }
      }
      this.template = _.template( $("#czar-view").html(),  { cards: this.collection } );
      this.$el.html(this.template);
      return this;
    },

    updateCards: function( cards ) {
      this.collection.reset( cards.models, { "silent":true } );
      this.render();
    },

    chooseWinnerCard: function( event ) {
      var self = this;
      var allPlayersHavePlayed = function() {
        var theyHave = true;
        var players = self.options.game.get( 'players' );
        for( var i = 0; i < players.length; i++ ) {
          if( !players.models[i].get( 'hasPlayed' ) && !players.models[i].get( 'isCzar' ) && players.models[i].get( 'isPlaying' ) ) {
            theyHave = false;
          }
        }
        return theyHave;
      };
      if( allPlayersHavePlayed() && self.options.game.get( 'inProgress' ) ) {
        var card = $( event.target ),
            cardText = card.text(),
            socketid = card.data( 'id' ),
            responseArray = [];


        for( var k = 0; k < self.options.game.get( 'allCardsInPlay' ).length; k++ ) {
          responseArray.push( self.options.game.get( 'allCardsInPlay' ).models[k].get( 'text' ) );
        }
        self.options.game.get( 'blackCardsInPlay' ).models[0].set({
          'responses': responseArray
        });
        self.options.game.set({
          'inProgress': false
        });
        self.options.game.get( 'players' ).get( socketid ).set({
          'awesomePoints': self.options.game.get( 'players' ).get( socketid ).get( 'awesomePoints' ) + 1,
          'isWinner': true
        });
        window.CAH.socket.emit( 'update room', this.options.game );
      }
    }

  });

  // Returns the View class
  return View;
});