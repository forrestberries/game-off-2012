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
      if( !this.options.player.get( 'hasPlayed' ) ) {
        var card = $( event.target ),
            self = this,
            cardText = card.text(),
            socketid = card.data( 'id' );
        console.log( 'PlayerCardView.playWhiteCard(): socket of person who owns me ' + socketid );
        var cardsArr,
            target = -1;

        cardsArr = this.options.player.get( 'whitecards' );
        console.log( cardsArr );
        for( var i = 0; i < cardsArr.length; i++ ) {
          var currentText = cardsArr.models[i].get( 'text' );
          if( ( currentText.indexOf( cardText ) > -1 ) && ( currentText.length == cardText.length ) ) {
            target = i;
            break;
          }
        }
        console.log( cardsArr, target);
        var targetCard = cardsArr.models[target];
        targetCard.set({
          'playPosition': self.options.game.get( 'players' ).get( socketid ).get( 'cardsInPlay' ).length + 1,
          'inPlay': true
        });

        //update local player..
        this.options.player.removeWhiteCard( targetCard );
        this.options.player.get( 'cardsInPlay' ).add( targetCard );
        this.options.player.set({ 'hasPlayed': true });

        //now update game object
        self.options.game.get( 'players' )
          .get( socketid )
          .set({
            'whitecards': this.options.player.get( 'whitecards' ),
            'cardsInPlay': this.options.player.get( 'cardsInPlay' ),
            'hasPlayed': true
          });

        console.log( '%cEND OF PLAYING WHITE CARD', 'color:#CA0;font-weight:bold;' );
        console.log( this.options.player );
        console.log( this.options.game );

        window.CAH.socket.emit( 'update room', this.options.game );
      }
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