let lat, lng, map;

$(() => {
    $('#nearby-map').hover(
        () => {
            expandMap();
        }, () => {
            shrinkMap();
        }
    );
});

// function getUserLocation() {    const options = {        enableHighAccuracy: true,        timeout: 10000        // maximumAge: 0    };    navigator.geolocation.getCurrentPosition(createMap, navigatorFallback, options);}

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

    map = new google.maps.Map($('#nearby-map')[0], {
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
        updateList();
    });

    updateList();
}

// noinspection JSUnusedGlobalSymbols [IntelliJ]
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

    for (const [index, value] of results.entries()) {
        let restaurantContainer = document.createElement('div');
        restaurantContainer.innerHTML = getRestaurantDiv(value, index);
        restaurantListDOM.appendChild(restaurantContainer);
        initSlideshow(index);

        const icon = {
            url: '/images/site/gmaps-custom-pin-small.png',
            scaledSize: new google.maps.Size(25, 42)
        };

        new google.maps.Marker({
            map: map,
            position: {lat: value.latitude, lng: value.longitude},
            icon: icon
        });
    }
    console.log('HTML Updated\n');
    shrinkMap();
}

function shrinkMap() {
    console.log('shrink');
    $('#nearby-map').addClass('map-shrink');
}

function expandMap() {
    console.log('shrink');
    $('#nearby-map').removeClass('map-shrink');
}

function getRestaurantDiv(restaurant, index) {
    const htmlStart = `
        <div class="container nearby-restaurant">
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
              <p class="restaurant-address">${restaurant.wholeAddress}</p>
          </div>
      </div>
    `;

    let htmlCategories = `
        <div class="row">
            <div style="margin: -5px" class="col">
    `;

    if (restaurant.categories.length > 0) {
        for (const category of restaurant.categories) {
            htmlCategories += `<p class="restaurant-category">${category}</p>`;
        }
    }

    htmlCategories += `     
            </div>
        </div>
    `;

    let htmlDescription = '';

    if (restaurant.description) {
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
            if (image !== '.keep') {
                htmlSlideshow += `<img src="images/restaurants/${restaurant._id}/${image}" class="slide-${index}"/>`;
                imageCount += 1;
            }
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
