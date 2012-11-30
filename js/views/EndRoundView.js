define([
  'jquery',
  'backbone',
  'collections/BlackCardsCollection',
  'collections/WhiteCardsCollection',
  'collections/PlayersCollection'], function($, Backbone, BlackCardsCollection, WhiteCardsCollection, PlayersCollection){
  var View = Backbone.View.extend({

    el: "section#endRound",

    resetView: function() {
      console.log( 'clearing ', this.t, this.newRoundTimer );
      clearTimeout( this.t );
      clearTimeout( this.newRoundTimer );
      this.collection.reset();
      this.$el.empty();
    },

    initialize: function() {
      console.log( 'endRoundView.init()', this.collection, this.options.game );
      var self = this;
      this.on( 'clear', this.resetView );
      this.collection.on( 'add remove change', function( data ) {
        self.determineWinner( self );
      });
      this.determineWinner( this );
    },

    events: {
    },

    render: function() {
      console.log( '%cEndRoundView.render()', 'color: blue;' );
      this.template = _.template( $("#end-round").html(),  {
        player: this.winner.toJSON(),
        winningResponse: this.winningResponse,
        allResponses: this.allResponses
      });
      this.$el.html(this.template);
      return this;
    },

    determineWinner: function( self ) {
      for( var i = 0; i < self.collection.length; i++ ) {
        if( self.collection.models[i].get( 'isWinner' ) ) {
          self.winner = self.collection.models[i];
        }
      }

      self.prepareResponses( self );
    },

    prepareResponses: function( self ) {
      var blackcard = self.options.game.get( 'blackCardsInPlay' ).models[0],
          text = blackcard.get( 'text' ),
          completeResponses = [];

      for( var i = 0; i < blackcard.get( 'responses' ).length; i++ ) {
        var resp = blackcard.get( 'responses' )[i],
            newResp;
        //sad hack :(
        if( resp !== self.winner.get( 'cardsInPlay' ).models[0].get( 'text' ) ) {
          if( text.indexOf( '_' ) > -1 ) {
            newResp = text.replace( /_+/, "_" + resp + "_" );
          } else {
            newResp = text + ' ' + resp;
          }

          completeResponses.push( newResp );
        }
      }

      if( text.indexOf( '_' ) < 0 ) {
        self.winningResponse = text + ' ' + self.winner.get( 'cardsInPlay' ).models[0].get( 'text' );
      } else {
        self.winningResponse = text.replace( /_+/, "_" + self.winner.get( 'cardsInPlay' ).models[0].get( 'text' ) + "_" );
      }
      self.allResponses = completeResponses;
      self.render();
      self.resetRound();
    },

    resetRound: function() {
      var numOfPlayers = this.options.game.get( 'players' ).length,
          timerLength = ( numOfPlayers - 1 ) * 3000,
          self = this,
          counter = timerLength,
          resetGamePlayers = new PlayersCollection();

      (function(){
        $( '#new-round-timer' ).html( 'New round in ' + ( counter / 1000 ) );
        counter = counter - 1000;
        var t = setTimeout(arguments.callee,1000);
        self.t = t;
      })();
      this.newRoundTimer = setTimeout( function() {
        clearTimeout( self.newRoundTimer );

        //this for loop preserves players and their state
        //must go before the clear event is triggered
        console.log( 'self.player.get( whitecards ).length before', self.options.player.get( 'whitecards' ).length );
        for( var z = 0; z < self.options.game.get( 'players' ).length; z++ ) {
          var player = self.options.game.get( 'players' ).models[z];
          player.set({
            'whitecards': self.options.game.get( 'players' ).models[z].get( 'whitecards' )
          });
          resetGamePlayers.add( player );
        }

        self.trigger( 'clear' );

        //actions that only need to take place by the game host
        if( self.options.player.get( 'gameHost' ) ) {
          self.options.game.set({
            'players': resetGamePlayers,
            'czarSetForCurrentRound': false,
            'inProgress': false,
            'blackCardsInPlay': new BlackCardsCollection(),
            'allCardsInPlay': new WhiteCardsCollection(),
            'awesomePoints': self.options.game.get( 'awesomePoints' ) + 1,
            'currentRound': self.options.game.get( 'currentRound' ) + 1
          });

          console.log( 'self.player.get( whitecards ).length after', self.options.player.get( 'whitecards' ).length );
          //the server resets some attributes on the players ( can't do it in this view )
          window.CAH.socket.emit( 'new round', self.options.game );
        }
      }, timerLength );
    }

  });

  // Returns the View class
  return View;
});