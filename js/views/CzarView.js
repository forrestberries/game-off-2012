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
      'click .player-whitecard': 'chooseWinnerCard'
    },

    render: function() {
      console.log( '%cCzarView.render()', 'color: blue;' );
      this.template = _.template( $("#czar-view").html(),  { cards: this.collection } );
      this.$el.html(this.template);
      return this;
    },

    updateCards: function( cards ) {
      this.collection.reset( cards.models );
    },

    chooseWinnerCard: function( event ) {
      var self = this;
      var allPlayersHavePlayed = function() {
        var theyHave = true;
        var players = self.options.game.get( 'players' );
        for( var i = 0; i < players.length; i++ ) {
          if( !players.models[i].get( 'hasPlayed' ) && !players.models[i].get( 'isCzar' ) ) {
            theyHave = false;
          }
        }
        return theyHave;
      };
      if( allPlayersHavePlayed() ) {
        var card = $( event.target ),
            cardText = card.text(),
            socketid = card.data( 'id' );
        self.options.game.get( 'players' ).get( socketid ).set({ 'awesomePoints': self.options.game.get( 'players' ).get( socketid ).get( 'awesomePoints' ) + 1 });
        window.CAH.socket.emit( 'update room', this.options.game );
      }
    }

  });

  // Returns the View class
  return View;
});