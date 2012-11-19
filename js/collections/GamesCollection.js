define(["jquery","backbone","models/GameModel"], function($, Backbone, Game) {

    var Games = Backbone.Collection.extend({

        model: Game

    });

    Games.prototype.add = function(game) {
		var isDupe = this.any(function(_game) {

			return _game.id === game.id;
		});
		if (isDupe) {
			this.trigger('add');
			console.log('duplicate game found: ' + game.id + ":" + JSON.stringify(game));
			return false;
		}
		Backbone.Collection.prototype.add.call(this, game);

	};

    // Returns the Model class
    return Games;

});