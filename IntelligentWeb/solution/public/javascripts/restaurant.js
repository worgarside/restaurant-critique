$(() => {
    const btnNext = $(`#button-next`);
    const btnPrev = $(`#button-prev`);

    $(`.slide`).first().addClass(`current`);
    $(`.slide`).hide();
    $(`.current`).show();

    // noinspection JSJQueryEfficiency
    btnNext.click(() => {
        $(`.current`).removeClass(`current`).addClass(`previous`);
        if ($(`.previous`).is(':last-child')) {
            $(`.slide`).first().addClass(`current`);
        }
        else {
            $(`.previous`).next().addClass(`current`);
        }
        $(`.previous`).removeClass(`previous`);
        $(`.slide`).fadeOut();
        $(`.current`).fadeIn();
    });

    btnPrev.click(() => {
        $(`.current`).removeClass(`current`).addClass(`previous`);
        if ($(`.previous`).is(':first-child')) {
            $(`.slide`).last().addClass(`current`);
        }
        else {
            $(`.previous`).prev().addClass(`current`);
        }
        $(`.previous`).removeClass(`previous`);
        $(`.slide`).fadeOut();
        $(`.current`).fadeIn();
    });
});

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