define(['jquery','backbone', 'views/HomeView'], function($, Backbone, HomeView){

  var Router = Backbone.Router.extend({

    initialize: function(){
      // Tells Backbone to start watching for hashchange events
      Backbone.history.start();
    },

    // All of your Backbone Routes (add more)
    routes: {
      // When there is no hash bang on the url, the home method is called
      "": "home"
    },

    home: function() {
      var homeView = new HomeView();
      homeView.render();
    }
  });

  // Returns the Router class
  return Router;

});