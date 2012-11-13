define(["jquery","backbone","models/WhiteCardModel"], function($, Backbone, WhiteCardModel) {

    var WhiteCards = Backbone.Collection.extend({

        model: WhiteCardModel

    });

    // Returns the Model class
    return WhiteCards;

});