define(['jquery', 'backbone'], function($, Backbone){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function() {
      // Setting the view's template property
      this.template = _.template( $("#home-view").html() );
    },

    events: {

    },

    render: function() {
      this.$el.html(this.template);
      return this;
    }
  });

  // Returns the View class
  return View;
});