let initialLocations = [
    {title: 'Park Ave Penthouse', position: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', position: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', position: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', position: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', position: {lat: 40.7195264, lng: -74.0089934}}
];

let Location = function(locationName, locationPosition, locationMarker, locationVenue) {
    let self = this;

    self.title = locationName;
    self.position = locationPosition;
    self.marker = locationMarker;
    self.venue = locationVenue;
};

let Venue = function(venueName, venueUrl) {
    let self = this;

    self.venueName = venueName;
    self.venueUrl = venueUrl
};


var ViewModel = function() {
    let self = this;

    /* *************************************
    * Helper functions
    * ************************************* */

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high, have an origin
    // of 0, 0 and be anchored at 10, 34).
    self.makeMarkerIcon = function(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    };

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    self.populateInfoWindow = function(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<h4>' + marker.title + '</h4>'+
            '<h5>Recommended Venue (via Foursquare):</h5>'+
            '<h5><a href="'+self.currentLocation().venue.venueUrl+'">'+self.currentLocation().venue.venueName+'</a></h5>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.setMarker = null;
            });
        }
    };

    // This function closes infowindow
    self.closeInfoWindow = function(infowindow) {
        infowindow.close();
        //infowindow.setMarker = null;
    };


    /* *************************************
    * Initialization
    * ************************************* */

    self.locations = ko.observableArray([]);
    self.currentLocation = ko.observable( );

    // call this function from initMap, called by Google Maps once loaded
    self.initMarkers = function() {
        // Style the markers a bit. This will be our default marker icon.
        self.defaultIcon = self.makeMarkerIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker or selects a marker in the list
        self.highlightedIcon = self.makeMarkerIcon('FFFF24');


        self.largeInfowindow = new google.maps.InfoWindow();

        self.bounds = new google.maps.LatLngBounds();
        // Define the markers for initially defined locations
        initialLocations.forEach(function(locationItem) {
            viewModel.createMarker(locationItem);
        });

        /* ***********************************************************
        * Get a venue recommendations at each location via FourSquare
        * See: https://developer.foursquare.com/docs/api/venues/explore
        * ************************************************************ */

        let foursquareUrlBase = 'https://api.foursquare.com/v2/venues/explore?v=20180501&radius=2000&client_id=VV2G3W3ALC4LYDEB0JDC2KJSKLXD2GPU5ZJM4V55OSMV50AE&client_secret=R55AX1RKXWEBXMIG43YI2343C3ZR2BCQSTITGWHZDJJV00EB&limit=1';

        self.locations().forEach(function(locationItem) {
            let foursquareUrl = foursquareUrlBase + '&ll=' + locationItem.position.lat + ',' + locationItem.position.lng;

            // NOTE: .getJSON method is an abstraction of the .ajax method
            $.getJSON(foursquareUrl, function(data){

                if (data.meta.code === 200) {
                    let venueName = data.response.groups[0].items[0].venue.name;
                    let venueUrl = data.response.groups[0].items[0].venue.url;
                    locationItem.venue = new Venue(venueName, venueUrl);
                    // alert('Recommended venue for ' + locationItem.title + ': '+ venueName + ' ('+venueUrl+')');
                }
                else {
                    alert('Foursquare did not find a venue for ' + locationItem.title);
                    locationItem.venue = '**NONE**';
                }

            }).fail( function(e) {
                alert('Error retrieving foursquare result for ' + locationItem.title);
                locationItem.venue = '**NONE**';
            });
        });

        self.currentLocation( self.locations()[0] );
        self.currentLocation().marker.setIcon(self.highlightedIcon);
    };

    /* *************************************
    * Operations...
    * ************************************* */
    self.createMarker = function(locationItem) {
        // Create new marker and push on the storage array
        let marker = new google.maps.Marker({
            map: map,
            position: locationItem.position,
            title: locationItem.title,
            animation: google.maps.Animation.DROP,
            icon: self.defaultIcon
        });

        // Create new location and add to the ViewModel storage array
        // with reference to the marker
        // initialize venue to null
        self.locations.push( new Location(
            locationItem.title,
            locationItem.position,
            marker,
            null
        ));

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(self.highlightedIcon);
        });

        marker.addListener('mouseout', function() {
            // Only reset the icon if this marker is not for currently selected item in list
            if (self.currentLocation().marker != this) {
                this.setIcon(self.defaultIcon);
            }
        });

        // Create an onclick event for the marker
        marker.addListener('click', function() {
            self.clickedMarker(this);
        });

        // Extend the boundaries of the map for this new marker
        self.bounds.extend(marker.position);
        map.fitBounds(self.bounds);
    };

    self.setCurrentLocationFromMarker = function(marker) {
        self.locations().forEach(function(locationItem) {
            if (locationItem.marker == marker) {
                self.currentLocation(locationItem);
                // Highlight the associated marker of new selection
                self.currentLocation().marker.setIcon(self.highlightedIcon);
                // open the InfoWindow
                self.populateInfoWindow(self.currentLocation().marker, self.largeInfowindow);
            }
        });
    };

    /* Callback function when a location is selected in the list */
    self.clickedListLocation = function(clickedLocation) {

        // Close the InfoWindow if it was open
        //self.closeInfoWindow(self.largeInfowindow);

        // Reset the icon of associated marker of current selection
        self.currentLocation().marker.setIcon(self.defaultIcon);

        // Set currentLocation based on clicked item in the list
        self.currentLocation(clickedLocation);

        // Bounce the associated marker a couple of times
        clickedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
        clickedLocation.marker.setAnimation(4);

        // Highlight the associated marker of new selection
        clickedLocation.marker.setIcon(self.highlightedIcon);

        // open the InfoWindow
        self.populateInfoWindow(clickedLocation.marker, self.largeInfowindow);
    };


    /* Callback function when a marker is clicked */
    self.clickedMarker = function(marker) {
        // Reset the icon of associated marker of current selection
        self.currentLocation().marker.setIcon(self.defaultIcon);

        // make this location the current location, so list will update itself
        self.setCurrentLocationFromMarker(marker);

        // open the InfoWindow
        self.populateInfoWindow(marker, self.largeInfowindow);
    };


    /* *************************************
    * Filtering of the list
    * See: https://github.com/stevesanderson/knockout-projections
    * ************************************* */

    self.filterInput = ko.observable("");
    self.filterPattern = ko.computed(function() {
        // convert input string into a regex pattern
        return new RegExp(self.filterInput(),"i");
    });

    self.locationsFiltered = self.locations.filter(function(x) {
        let showLocation = true;

        // Check if filter string is included in title of location, via regexp test
        if (self.filterInput() !== "") {
            showLocation = self.filterPattern().test(x.title);
        }

        // Turn marker on or off
        x.marker.setVisible(showLocation);

        return showLocation;
    });

};

// store viewModel in global variable, so map.js can call the callbacks once the google map has initialized itself
var viewModel = new ViewModel();
ko.applyBindings(viewModel);