var lat, lng;

$(function () {
    getUserLocation();
});

function getUserLocation() {
    console.log("Tell me where you are");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(createMap);
    } else {
        // fallback to user postcode
    }
}

function createMap(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    var currentLocation = {lat: lat, lng: lng};
    console.log("Create the map @ " + currentLocation.lat + ", " + currentLocation.lng);
    var map = new google.maps.Map($('#nearby-map')[0], {
        zoom: 14,
        center: currentLocation
    });

    var marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: currentLocation
    });

    google.maps.event.addListener(marker, 'dragend', function callback() {
        lat = marker.getPosition().lat();
        lng = marker.getPosition().lng();
        // geocodePosition(marker.getPosition());
    });

    function geocodePosition(pos) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({latLng: pos}, function callback(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    console.log(results[0].formatted_address);
                }
                else {
                    console.log('Error');
                }
            }
        );
    }
}

function updateList() {
    console.log(lat);
    console.log(lng);
}

// Placeholder function to stop GMaps error on load
function initMap() {
    console.log("Map loaded");
}