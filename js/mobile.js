// Sets the require.js configuration for your application.
require.config({

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.7.2.min")
  paths: {

      // Core Libraries
      "modernizr": "libs/modernizr",
      "jquery": "libs/jquery",
      "bootstrap": "plugins/bootstrap",
      "underscore": "libs/lodash",
      "backbone": "libs/backbone",
      "backbone.validateAll": "plugins/Backbone.validateAll",
      "socket.io": "server/socket.io",
      "canary-util": "plugins/canary-util",
      "templates": "../templates"
  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {

      // Twitter Bootstrap jQuery plugins
      "bootstrap": ["jquery"],

      "backbone": {
          "deps": ["underscore", "jquery"],
          "exports": "Backbone"  //attaches "Backbone" to the window object
      },

      // Backbone.validateAll depends on Backbone.
      "backbone.validateAll": ["backbone"],

      "canary-util": []

  } // end Shim Configuration

});

// Include Mobile Specific JavaScript files here (or inside of your Mobile router)
require(['modernizr','jquery','backbone','routers/homeRouter', 'routers/gameRouter','bootstrap','backbone.validateAll', 'plugins/canary-util'], function(Modernizr, $, Backbone, HomeRouter, GameRouter) {
  if (! window.CAH ) {
    window.CAH = {};
  }
  window.CAH.serverhost = 'localhost:20080';
  // Instantiates a new Router
  if( document.URL.indexOf( 'game.html' ) > -1 ) {
    console.log( 'starting GameRouter' );
    this.router = new GameRouter();
  } else {
    console.log( 'starting homeRouter' );
    this.router = new HomeRouter();
  }
});