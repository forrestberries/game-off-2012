define(['jquery', 'backbone'], function($, Backbone){
  var View = Backbone.View.extend({

    el: "#waiting-modal",

    initialize: function() {

    },

    render: function() {
      console.log( 'GameWaitingView.render()' );
      this.template = _.template( $("#waiting").html() );
      this.$el.html(this.template);
      this.$el.find( '#waiting-msg' ).modal( 'show' );
      return this;
    },

    hideModal: function() {
      this.$el.find( '#waiting-msg' ).modal( 'hide' );
    }

  });

  // Returns the View class
  return View;
});