let lat, lng;
// noinspection JSJQueryEfficiency
$(() => {
    getUserLocation();

    const btnNext = $('#button-next');
    const btnPrev = $('#button-prev');

    $('.img-slides').first().addClass('current');
    $('.img-slides').hide();
    $('.current').show();

    // noinspection JSJQueryEfficiency
    btnNext.click(() => {
        $('.current').removeClass('current').addClass('previous');
        if ($('.previous').is(':last-child')) {
            $('.img-slides').first().addClass('current');
        }
        else {
            $('.previous').next().addClass('current');
        }
        $('.previous').removeClass('previous');
        $('.img-slides').fadeOut();
        $('.current').fadeIn();
    });

    btnPrev.click(() => {
        console.log('prev');
        $('.current').removeClass('current').addClass('previous');
        if ($('.previous').is(':first-child')) {
            $('.img-slides').last().addClass('current');
        }
        else {
            $('.previous').prev().addClass('current');
        }
        $('.previous').removeClass('previous');
        $('.img-slides').fadeOut();
        $('.current').fadeIn();
    });

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

    // noinspection JSUnusedGlobalSymbols
    $.ajax({
        url: '/restaurants-nearby',
        data: coordinates,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (result) => {
            // callback1 - can use an array of CBs and iterate through
            console.log(result);
            processData(result);
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
}

function processData(results) {
    $('#restaurant-list')[0].innerHTML = null;
    for (let result of results) {
        // result = JSON.stringify(result);

        let newElement = document.createElement('div');

        newElement.innerHTML = getRestaurantDiv(result);

        $('#restaurant-list')[0].appendChild(newElement);
    }
}

function getRestaurantDiv(restaurant) {
    return `<p>${restaurant.images}</p>`
}
