define(['jquery',
  'backbone',
  'text!templates/nearby_games.html'], function($, Backbone, modalHTML){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function() {
      console.log('initializing Nearby Games Search view');
    },

    events: {
    },

    render: function() {
      this.$el.html(modalHTML);
      $("#nearby-games-modal").modal('show');
      return this;
    }
  });

  // Returns the View class
  return View;
});