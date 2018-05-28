/**
 * restaurants_nearby.js
 * Client-side JS
 * @author Will Garside
 */

let lat, lng, map, userMarker;
let markerList = [];

$('#login-warning').click(() => {
    $('#btn-login').click();
});

$(() => {
    $('#nearby-map-wrapper').hover(
        () => {
            $('#nearby-map').removeClass('map-shrink');
        }, () => {
            $('#nearby-map').addClass('map-shrink');
        }
    );
});

$('#allow-location').click(() => {
    allowLocation(true);
});

$('#deny-location').click(() => {
    allowLocation(false);
});

/**
 * Function to get Users location from browser geolocation after they allow it
 * @param {Boolean} allowed Flag to signify whether the User has allowed geolocation or not
 */
function allowLocation(allowed) {
    // TODO test user in washington state??
    if (allowed) {
        sessionStorage.setItem('allowLocation', true);

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
    } else {
        sessionStorage.setItem('allowLocation', false);
    }

    $('#restaurant-location-overlay').css('display', 'none');
}

// TODO jsdoc
function manageGeolocation() {
    if (userLoggedIn) {
        const locFlag = sessionStorage.getItem('allowLocation');
        console.log(typeof locFlag);

        if (locFlag === 'true') {
            console.log('Location already allowed');
            allowLocation(true);
        } else if (locFlag === 'false') {
            console.log('Location already denied');
            allowLocation(false);
        } else {
            console.log('Location permissions not set');
            $('#restaurant-location-overlay').css('display', 'block');
        }
    }
}

/**
 * Called by GMaps script after map is loaded
 * Initialises Google Map V3 attributes
 */
function initMap() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': `${postcode}, UK`}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            createMap();
        } else {
            //TODO: remove/substitute this
            alert("Geocode error: " + status);
        }
    });
}

/**
 * Creates the map on the page, with the User at the centre and with a marker to show their location
 */
function createMap() {
    const currentLocation = {lat: lat, lng: lng};
    console.log(`Creating the map @ ${currentLocation.lat}, ${currentLocation.lng}`);

    const styles = [
        {
            "featureType": "poi.business",
            "stylers": [
                {"visibility": "off"}
            ]
        }
    ];

    if (userLoggedIn) {
        map = new google.maps.Map($('#nearby-map')[0], {
            zoom: 14,
            center: currentLocation,
            styles: styles,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
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
            updateList();
        });
    } else {
        map = new google.maps.Map($('#nearby-map')[0], {
            zoom: 14,
            center: currentLocation,
            draggable: false,
            styles: styles,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
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
    manageGeolocation();
    updateList();


}

/**
 * Sends an AJAX POST request to the server to get a list of nearby Restaurants
 * @see routes/restaurants_nearby.js
 */
function updateList() {
    const coordinates = JSON.stringify({lat: lat, lng: lng});

    $.ajax({
        url: '/restaurants-nearby',
        data: coordinates,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (restaurants) => {
            clearMarkers();
            processRestaurants(restaurants);
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
}

/**
 * Process the returned list of restaurants to create HTML for them and append it to the page
 * Also adds their locations to the map with markers and info windows
 * @param {Array} results
 * @see updateList()
 */
function processRestaurants(results) {
    const restaurantListDOM = $('#restaurant-list')[0];
    restaurantListDOM.innerHTML = null;

    const icon = {
        url: '/images/site/gmaps-custom-pin-small.png',
        scaledSize: new google.maps.Size(25, 42)
    };

    markerList = [];
    let infoWindow = new google.maps.InfoWindow();
    let contentList = [];
    let htmlString = '';

    if (results.length > 0) {
        htmlString += '<h2 id="restaurant-result-header">Your nearest restaurants</h2>';
    }

    for (const [index, restaurant] of results.entries()) {
        if (restaurant.published) {
            htmlString += createRestaurantPreview(restaurant, index);

            const infoWindowContent = `
                <div class='container' id='info-${index}' style='max-width: 400px;'>
                    <div class='row'>
                        <div class='col'>
                            <table>
                                <tr>
                                    <td><h5 style='font-weight: 400; max-width: 200px; min-width: 130px;' class='mb-0'>${restaurant.name}</h5></td>
                                    <td style='width: 95px; vertical-align: bottom;'><p style='font-weight: 400; float: right;' class='align-bottom mb-0'>&nbsp;&nbsp;&nbsp;${(restaurant.distance / 1000).toFixed(2)}km away</p></td>
                                </tr>
                                <tr>
                                    <td colspan='2'><p class='mb-0'>${restaurant.description}</p></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col'>
                            <a class='float-right info-window-more-info' onclick='scrollToRestaurant(${index});' href='javascript:void(0)'>More info</a>
                        </div>
                    </div>
                </div>
            `;

            const newMarker = new google.maps.Marker({
                title: restaurant.name,
                map: map,
                position: {lat: restaurant.address.latitude, lng: restaurant.address.longitude},
                icon: icon
            });

            google.maps.event.addListener(newMarker, 'click', function () {
                infoWindow.setContent(infoWindowContent);
                infoWindow.open(map, this);
            });

            markerList.push(newMarker);
        }
    }

    let resultContainer = document.createElement('div');
    resultContainer.innerHTML = htmlString;
    restaurantListDOM.appendChild(resultContainer);

    //TODO scrolling back up to map from icon on each restaurant div for location and distance slider w/ jquery

    for (let i = 0; i < results.length; i++) {
        initSlideshow(i);
    }
    updateJQueryClickables();
}

// TODO jsdoc
function clearMarkers() {
    for (let i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }
}

/**
 * Dynamically creates a Restaurant preview 'card' to add to the page from the Restaurant info
 * It checks each of the relevant Restaurant attributes and uses them to fill out a HTML template
 * @param {Restaurant} restaurant The Restaurant being previewed
 * @param {number} index The number the Restaurant is on the page, used for setting button IDs
 * @returns {string} The generated HTML to be appended to the page
 * @author Will Garside
 */
function createRestaurantPreview(restaurant, index) {
    const htmlStart = `
        <div class='container restaurant-card' id='restaurant-container-${index}'>
            <div class='row'>
                <div class='col-12 col-lg-8'>
                    <div class='vert-center-parent'>
                        <div class='vert-center-child'>
                            <div class='row'>
                                <div class='col'>
                                    <a href='restaurant/${restaurant.localUrl}' class='restaurant-title d-inline'>${restaurant.name}</a>
    `;

    let htmlStars = '';

    if (restaurant.averageRating) {
        const starRating = Math.round(restaurant.averageRating);

        htmlStars = `
            <div class='restaurant-stars'>
        `;

        for (let i = 0; i < starRating; i++) {
            htmlStars += `<span class='oi oi-star star-highlight'></span>`;
        }

        for (let i = 0; i < (5 - starRating); i++) {
            htmlStars += `<span class='oi oi-star'></span>`;
        }

        htmlStars += '</div>';
    }

    const htmlAddress = `
            </div>
        </div>
        <div class='row'>
            <div class='col'>
                <a href='javascript:void(0)' class='restaurant-card-map-link restaurant-address' data-restaurant-name="${restaurant.name}">
                    <img src='/images/site/gmaps-custom-pin-small.png'/>
                    ${restaurant.address.formattedAddress}
                </a>
            </div>
        </div>
    `;

    let htmlCategories = `
        <div class='row'>
            <div class='col'>
    `;

    if (restaurant.categories.length > 0) {
        for (const category of restaurant.categories) {
            htmlCategories += `<p class='restaurant-category'>${category.name}</p>`;
        }
    }

    htmlCategories += `     
            </div>
        </div>
    `;

    let htmlDescription = '';

    if (restaurant.description !== 'No description currently available.') {
        htmlDescription = `
            <div class='row'>
                <div class='col'>
                    <p class='restaurant-description'>${restaurant.description}</p>
                </div>
            </div>
        `;
    }

    let htmlSlideshow = `
                    </div>
                </div>
            </div>
            <div class='col-12 col-lg-4'>
                <div class='row'>
                    <div class='col'>
                        <div class='restaurant-nearby-images'>
                            <div class='slideshow-wrapper'>
        `;

    let imageCount = 0;

    if (restaurant.images.length > 0) {
        htmlSlideshow += "<div class='slideshow'>";
        for (const image of restaurant.images) {
            htmlSlideshow += `<img src='images/restaurants/${restaurant._id}/${image}' class='slide-${index}'/>`;
            imageCount += 1;
            if (imageCount >= 3) {
                // only show first 3 images
                break;
            }
        }
        htmlSlideshow += '</div>';
    }

    if (imageCount > 1) {
        htmlSlideshow += `
                <div id='button-prev-${index}' class='slideshow-prev'>
                    <span class='oi oi-chevron-left'></span>
                </div>
                <div id='button-next-${index}' class='slideshow-next'>
                    <span class='oi oi-chevron-right'></span>
                </div>
        `;
    }

    htmlSlideshow += "</div>";

    const htmlEnd = `</div></div></div></div></div></div>`;

    return htmlStart + htmlStars + htmlAddress + htmlCategories + htmlDescription + htmlSlideshow + htmlEnd;
}

/**
 * Image slideshow navigation using buttons on page
 * JQuery selectors have to be re-used due to the changing classes of the images
 * @param {number} value The index value of the slideshow, so multiple ones can be on the page simultaneously without controls
 * getting mixed up
 * @author Will Garside
 */
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
        } else {
            $(`.previous-${value}`).next().addClass(`current-${value}`);
        }
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        $(`.slide-${value}`).fadeOut();
        $(`.current-${value}`).fadeIn();
    });

    btnPrev.click(() => {
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        if ($(`.previous-${value}`).is(':first-child')) {
            $(`.slide-${value}`).last().addClass(`current-${value}`);
        } else {
            $(`.previous-${value}`).prev().addClass(`current-${value}`);
        }
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        $(`.slide-${value}`).fadeOut();
        $(`.current-${value}`).fadeIn();
    });
}

/**
 * Auto-scrolls to Restaurant preview from the link in the map infowindow
 * @param {number} index The index of the Restaurant
 */
function scrollToRestaurant(index) {
    $('html, body').animate({
        scrollTop: $(`#restaurant-container-${index}`).offset().top - 60
    }, 800);
}