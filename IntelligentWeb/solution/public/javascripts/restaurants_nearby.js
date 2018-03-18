// const mongoose = require('mongoose');
// const Restaurant = mongoose.model('Restaurant');

var lat, lng;

$(function () {
    getUserLocation();
});

function getUserLocation() {
    // console.log("Tell me where you are");
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
    // console.log("Create the map @ " + currentLocation.lat + ", " + currentLocation.lng);
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
    // console.log(lat);
    // console.log(lng);

    var coordinates = JSON.stringify({lat: lat, lng:lng});
    console.log(coordinates);

    $.ajax({
        url: '/restaurants-nearby',
        data: coordinates,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            // var ret = dataR;

            // in order to have the object printed by alert
            // we need to JSON stringify the object
            console.log(dataR);
            $('#results')[0].innerHTML = JSON.stringify(dataR);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });

    // Restaurant.aggregate([{
    //         "$geoNear": {
    //             "near": {
    //                 "type": "Point",
    //                 "coordinates": [-1.4960387, 53.386666]
    //             },
    //             "distanceField":
    //                 "distance",
    //             "spherical":
    //                 true,
    //             "maxDistance":
    //                 10000
    //         }
    //     }],
    //
    //     function (err, results) {
    //         console.log(results);
    //     }
    // );
}

// Placeholder function to stop GMaps error on load
function initMap() {
    console.log("Map loaded");
}


