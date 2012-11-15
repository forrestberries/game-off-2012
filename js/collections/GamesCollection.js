define(["jquery","backbone","models/GameModel"], function($, Backbone, Game) {

    var Games = Backbone.Collection.extend({

        model: Game

    });

    // Returns the Model class
    return Games;

});