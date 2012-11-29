define(["jquery", "backbone"], function($, Backbone) {

    var Location = Backbone.Model.extend({

        // Model Constructor
        initialize: function() {
             var self = this;
             var locationFound = false;
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
                    locationFound = true;
                    self.trigger("locationFound", { locationFound : true });
                },function() {
                    console.error('failed to find location');
                    self.set( { latitude: '45' });
                    self.set( { longitude: '-91' });
                    self.trigger("locationFound", { locationFound : false });
                },
                {timeout:5000});
        }

    });

    // Returns the Model class
    return Location;

});