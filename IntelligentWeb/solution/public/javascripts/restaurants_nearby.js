let lat, lng, map, userMarker;

$(() => {
    $('#nearby-map-wrapper').hover(
        () => {
            $('#nearby-map').removeClass('map-shrink');
        }, () => {
            $('#nearby-map').addClass('map-shrink');
        }
    );

    if (!userLoggedIn) {
        $('#login-warning').click(() => {
            $('#btn-login').click();
        });
    } else {
        $('#restaurant-overlay').css('display', 'block');
    }
});

function allowLocation(allowed) {
    if (allowed) {
        const options = {enableHighAccuracy: true, timeout: 10000, maximumAge: 750000};

        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            lng = position.coords.longitude;

            map.setCenter({lat: lat, lng: lng});
            userMarker.setPosition(new google.maps.LatLng(lat, lng));
            console.log('Geolocation succeeded!');
            updateList();
        }, () => {
            console.log('Geolocation failed :(');
        }, options)
    }

    $('#restaurant-overlay').css('display', 'none');
}

function initMap() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': postcode}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            createMap();
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function createMap() {
    const currentLocation = {lat: lat, lng: lng};
    console.log(`Creating the map @ ${currentLocation.lat}, ${currentLocation.lng}`);

    const styles = [
        {
            "featureType": "poi.business",
            "stylers": [
                { "visibility": "off" }
            ]
        }
    ];

    if (userLoggedIn) {
        map = new google.maps.Map($('#nearby-map')[0], {
            zoom: 14,
            center: currentLocation,
            styles: styles
        });

        userMarker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: currentLocation
        });

        google.maps.event.addListener(userMarker, 'dragend', () => {
            lat = userMarker.getPosition().lat();
            lng = userMarker.getPosition().lng();
            // TODO: think about this
            // map.setCenter({lat: lat, lng: lng});
            updateList();
        });
    } else {
        map = new google.maps.Map($('#nearby-map')[0], {
            zoom: 14,
            center: currentLocation,
            draggable: false,
            styles: styles
        });

        userMarker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: currentLocation
        });

        google.maps.event.addListener(userMarker, 'click', () => {
            $('#btn-login').click();
        });
    }
    updateList();
}

function updateList() {
    const coordinates = JSON.stringify({lat: lat, lng: lng});
    console.log(`Sending ${coordinates} to AJAX POST`);

    $.ajax({
        url: '/restaurants-nearby',
        data: coordinates,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (result) => {
            console.log('AJAX Succeeded');
            processData(result);
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
}

function processData(results) {
    const restaurantListDOM = $('#restaurant-list')[0];
    restaurantListDOM.innerHTML = null;

    const icon = {
        url: '/images/site/gmaps-custom-pin-small.png',
        scaledSize: new google.maps.Size(25, 42)
    };

    for (const [index, restaurant] of results.entries()) {
        let restaurantContainer = document.createElement('div');
        restaurantContainer.innerHTML = getRestaurantDiv(restaurant, index);
        restaurantListDOM.appendChild(restaurantContainer);
        initSlideshow(index);

        console.log(restaurant);

        const infoWindowContent = `
            <div class="container" id="info-${index}" style="max-width: 400px;">
                <div class="row">
                    <div class="col">
                        <h5 style="font-weight: 400;" class="d-inline">${restaurant.name}</h5>
                        <p style="font-weight: 400;" class="d-inline">&nbsp;&nbsp;&nbsp;${(restaurant.distance / 1000).toFixed(2)}km away</p>
                        <p style="margin-bottom: 0;">${restaurant.description}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <a class="float-right info-window-more-info" onclick="scrollToRestaurant(${index});" href="#">More info</a>
                    </div>
                </div>
            </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });

        const newMarker = new google.maps.Marker({
            map: map,
            position: {lat: restaurant.latitude, lng: restaurant.longitude},
            icon: icon
        });

        newMarker.addListener('click', () => {
            infoWindow.open(map, newMarker);
        });
    }
    console.log('HTML Updated\n');
}

function getRestaurantDiv(restaurant, index) {
    const htmlStart = `
        <div class="container nearby-restaurant" id="restaurant-container-${index}">
            <div class="row">
                <div class="col-8">
                    <div class="vert-center-parent">
                        <div class="vert-center-child">
                            <div class="row">
                               <div class="col"><a href="#" class="restaurant-title d-inline">${restaurant.name}</a>
    `;

    let htmlStars = '';

    if (restaurant.average_rating) {
        const starRating = Math.round(restaurant.average_rating);

        htmlStars = `
            <div class="restaurant-stars">
        `;

        for (let i = 0; i < starRating; i++) {
            htmlStars += `<span aria-hidden="true" style="color: orange;" class="oi oi-check oi-star"></span>`;
        }

        for (let i = 0; i < (5 - starRating); i++) {
            htmlStars += `<span aria-hidden="true" class="oi oi-check oi-star"></span>`;
        }

        htmlStars += `</div>`;
    }

    const htmlAddress = `
          </div>
      </div>
      <div class="row">
          <div class="col">
              <p class="restaurant-address">${restaurant.address.formattedAddress}</p>
          </div>
      </div>
    `;

    let htmlCategories = `
        <div class="row">
            <div style="margin: -5px" class="col">
    `;

    if (restaurant.categories.length > 0) {
        for (const category of restaurant.categories) {
            htmlCategories += `<p class="restaurant-category">${category.name}</p>`;
        }
    }

    htmlCategories += `     
            </div>
        </div>
    `;

    let htmlDescription = '';

    if (restaurant.description !== 'No description currently available.') {
        htmlDescription = `
            <div class="row">
                <div class="col">
                    <p class="restaurant-description">${restaurant.description}</p>
                </div>
            </div>
        `;
    }

    let htmlSlideshow = `
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="vert-center-parent">
                    <div class="vert-center-child">
                    <div class="row">
                        <div class="col">
                            <div class="float-right">
                                <div class="slideshow-wrapper">
                                    <div class="slideshow">
        `;

    let imageCount = 0;

    if (restaurant.images.length > 0) {
        for (const image of restaurant.images) {
            htmlSlideshow += `<img src="images/restaurants/${restaurant._id}/${image}" class="slide-${index}"/>`;
            imageCount += 1;
        }
    }

    htmlSlideshow += "</div>";

    if (imageCount > 1) {
        htmlSlideshow += `
                <div id="button-prev-${index}" class="slideshow-prev">
                    <span aria-hidden="true" class="oi oi-check oi-chevron-left"></span>
                </div>
                <div id="button-next-${index}" class="slideshow-next">
                    <span aria-hidden="true" class="oi oi-check oi-chevron-right"></span>
                </div>
        `;
    }

    htmlSlideshow += "</div>";

    const htmlEnd = `</div></div></div></div></div></div></div></div>`;
    console.log(htmlSlideshow);

    return htmlStart + htmlStars + htmlAddress + htmlCategories + htmlDescription + htmlSlideshow + htmlEnd;
}

function initSlideshow(value) {
    const btnNext = $(`#button-next-${value}`);
    const btnPrev = $(`#button-prev-${value}`);

    $(`.slide-${value}`).first().addClass(`current-${value}`);
    $(`.slide-${value}`).hide();
    $(`.current-${value}`).show();

    // noinspection JSJQueryEfficiency
    btnNext.click(() => {
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        if ($(`.previous-${value}`).is(':last-child')) {
            $(`.slide-${value}`).first().addClass(`current-${value}`);
        }
        else {
            $(`.previous-${value}`).next().addClass(`current-${value}`);
        }
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        $(`.slide-${value}`).fadeOut();
        $(`.current-${value}`).fadeIn();
    });

    btnPrev.click(() => {
        console.log('prev');
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        if ($(`.previous-${value}`).is(':first-child')) {
            $(`.slide-${value}`).last().addClass(`current-${value}`);
        }
        else {
            $(`.previous-${value}`).prev().addClass(`current-${value}`);
        }
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        $(`.slide-${value}`).fadeOut();
        $(`.current-${value}`).fadeIn();
    });
}

function scrollToRestaurant(index) {
    $('#nearby-map').addClass('map-shrink');

    // Wait for map to shrink
    setTimeout(() => {
        console.log(`this fucker ${index}`);
        $('html, body').animate({
            scrollTop: $(`#restaurant-container-${index}`).offset().top - 60
        }, 800, () => {
        });
    }, 250);
}