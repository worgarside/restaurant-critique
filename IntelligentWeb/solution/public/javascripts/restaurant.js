/**
 * restaurant.js
 * Client-side JS
 * @author Greta Ramaneckaite, Will Garside, Rufus Cope
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

/**
 * WebRTC based webcam pictures
 * @author Rufus Cope
 */


/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

// Put variables in global scope to make them available to the browser console.
let video = document.querySelector('video');
let canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;

let button = document.querySelector('button#takephoto');
button.onclick = function() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').
    drawImage(video, 0, 0, canvas.width, canvas.height);
};

let constraints = {
    audio: false,
    video: true
};

function handleSuccess(stream) {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;
}

function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
then(handleSuccess).catch(handleError);