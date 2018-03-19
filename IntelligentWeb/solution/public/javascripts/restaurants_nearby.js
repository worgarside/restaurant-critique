let lat, lng;

$(() => {
    getUserLocation();
});

function getUserLocation() {
    // console.log("Tell me where you are");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(createMap);
    } else {
        // TODO: fallback to user postcode
    }
}

function createMap(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    const currentLocation = {lat: lat, lng: lng};
    console.log(`Create the map @ ${currentLocation.lat}, ${currentLocation.lng}`);

    const map = new google.maps.Map($('#nearby-map')[0], {
        zoom: 14,
        center: currentLocation
    });

    const marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: currentLocation
    });

    google.maps.event.addListener(marker, 'dragend', () => {
        lat = marker.getPosition().lat();
        lng = marker.getPosition().lng();
    });
}

// noinspection JSUnusedGlobalSymbols [IntelliJ]
function updateList() {
    let coordinates = JSON.stringify({lat: lat, lng: lng});

    $.ajax({
        url: '/restaurants-nearby',
        data: coordinates,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        type: 'POST',
        success: [(dataR) => {
            // callback1 - can use an array of CBs and iterate through
            console.log(dataR);
            $('#results')[0].innerHTML = JSON.stringify(dataR);
        }],
        error: (xhr, status, error) => {
            alert(`Error: ${error.message}`);
        }
    });
}

// Placeholder function to stop GMaps error on load
// noinspection JSUnusedGlobalSymbols [IntelliJ]
function initMap() {
    console.log("Map loaded");
}


