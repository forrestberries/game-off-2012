define(["jquery", "backbone"], function($, Backbone) {

    var Location = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             this.setLatLong();
             console.log('init location');
             var self = this;
        },

        // Default values for all of the Location Model attributes
        defaults: {

            latitude: "",

            longitude: ""

        },

        setLatLong: function() {
            var self = this;
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    console.log('found location coords');
                    self.set( { latitude: position.coords.latitude });
                    self.set( { longitude: position.coords.longitude });
                },function() {
                    console.error('failed to find location');
                    self.set( { latitude: '45' });
                    self.set( { longitude: '-91' });
                },
                {timeout:5000});
        }

    });

    // Returns the Model class
    return Location;

});