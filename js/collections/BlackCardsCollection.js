define(["jquery","backbone","models/BlackCardModel"], function($, Backbone, BlackCardModel) {

    var BlackCards = Backbone.Collection.extend({

        model: BlackCardModel

    });

    // Returns the Model class
    return BlackCards;

});