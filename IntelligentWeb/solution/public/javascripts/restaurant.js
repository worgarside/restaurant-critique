/**
 * restaurant.js
 * Client-side JS
 * @author Greta Ramaneckaite, Will Garside
 * @param {Array} coordinates
 */

$(() => {
    initMainSlideshow();
});

/**
 * Called by GMaps script after map is loaded
 * Initialises Google Map V3 attributes and markers
 */
function initMap() {
    const currentLocation = {lat: coordinates[1], lng: coordinates[0]};

    const styles = [{
        "featureType": "poi.business",
        "stylers": [
            {"visibility": "off"}
        ]
    }];

    map = new google.maps.Map($('#restaurant-current-map')[0], {
        zoom: 14,
        center: currentLocation,
        styles: styles
    });

    userMarker = new google.maps.Marker({
        map: map,
        draggable: false,
        animation: google.maps.Animation.DROP,
        position: currentLocation
    });

    google.maps.event.addListener(userMarker, 'dragend', () => {
        lat = userMarker.getPosition().lat();
        lng = userMarker.getPosition().lng();
        map.setCenter({lat: lat, lng: lng});
    });
}

/**
 * Image slideshow navigation using buttons on page
 * JQuery selectors have to be re-used due to the changing classes of the images
 * @author Will Garside
 */
function initMainSlideshow() {
    const btnNext = $(`#button-next-rest`);
    const btnPrev = $(`#button-prev-rest`);

    $(`.slide-rest`).first().addClass(`current-rest`);
    $(`.slide-rest`).hide();
    $(`.current-rest`).show();

    btnNext.click(() => {
        $(`.current-rest`).removeClass(`current-rest`).addClass(`previous-rest`);
        if ($(`.previous-rest`).is(':last-child')) {
            $(`.slide-rest`).first().addClass(`current-rest`);
        } else {
            $(`.previous-rest`).next().addClass(`current-rest`);
        }
        $(`.previous-rest`).removeClass(`previous-rest`);
        $(`.slide-rest`).fadeOut();
        $(`.current-rest`).fadeIn();
    });

    btnPrev.click(() => {
        $(`.current-rest`).removeClass(`current-rest`).addClass(`previous-rest`);
        if ($(`.previous-rest`).is(':first-child')) {
            $(`.slide-rest`).last().addClass(`current-rest`);
        } else {
            $(`.previous-rest`).prev().addClass(`current-rest`);
        }
        $(`.previous-rest`).removeClass(`previous-rest`);
        $(`.slide-rest`).fadeOut();
        $(`.current-rest`).fadeIn();
    });
}