define(['jquery',
  'backbone',
  'text!templates/nearby_games.html'], function($, Backbone, modalHTML){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function() {

    },

    events: {
    },

    render: function() {
      this.$el.html(modalHTML);
      return this;
    }
  });

  // Returns the View class
  return View;
});