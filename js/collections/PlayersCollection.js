define(["jquery","backbone","models/PlayerModel"], function($, Backbone, Player) {

    var Players = Backbone.Collection.extend({

      model: Player,

      syncCollection: function( self ) {
      	
      }

    });

    // Returns the Model class
    return Players;

});