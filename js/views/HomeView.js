define(['jquery', 'backbone', 'socket.io'], function($, Backbone, Socket){
  var View = Backbone.View.extend({

    el: "section#main",

    initialize: function() {
      // Setting the view's template property
      this.template = _.template( $("#home-view").html() );

      /*test code-uncomment to see socket.io work or delete when ready*/
      /*var socket = io.connect( 'http://meowstep.com:20080' );
      socket.on('push update', function (data) {
        console.log( 'update from server' );
        console.log(data);
      });
      socket.emit( 'game update', { test: 'message' } );*/
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