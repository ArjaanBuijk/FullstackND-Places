var map;
function initMap() {
    /* Callback by Google Map API, once loaded */

    // Creates a new map and store in global variable
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
    });

    // Initialize the markers
    viewModel.initMarkers();

}