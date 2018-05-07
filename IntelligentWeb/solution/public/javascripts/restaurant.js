/**
 * restaurant.js
 * Client-side JS
 * @author Greta Ramaneckaite, Will Garside, Rufus Cope
 * @param {Array} coordinates
 */

let video, canvas;
const takePhotoButton = $('#takephoto');
const confirmPhotoButton = $('#confirmphoto');
const retakePhotoButton = $('#retakephoto');

const canvasContainer = $('#canvas');
const videoContainer = $('#video');
const formSubmit = $('#submit');
let imageUpload = $('#uploadedFile');

let images = [];


$(() => {
    video = document.querySelector('video');
    canvas = window.canvas = document.querySelector('canvas');
    canvas.width = 480;
    canvas.height = 360;

    const constraints = {
        audio: false,
        video: {facingMode: "environment"}
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError);
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


//buttons for camera
takePhotoButton.click(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    videoContainer.css("display", "none");
    canvasContainer.css("display", "unset");
    takePhotoButton.css("display", "none");
    confirmPhotoButton.css("display", "unset");
    retakePhotoButton.css("display", "unset");

});

confirmPhotoButton.click(() => {
    sendImage("22", canvas.toDataURL());
    videoContainer.css("display", "unset");
    canvasContainer.css("display", "none");
    takePhotoButton.css("display", "unset");
    confirmPhotoButton.css("display", "none");
    retakePhotoButton.css("display", "none");
});

retakePhotoButton.click(() => {
    videoContainer.css("display", "unset");
    canvasContainer.css("display", "none");
    takePhotoButton.css("display", "unset");
    confirmPhotoButton.css("display", "none");
    retakePhotoButton.css("display", "none");
});

formSubmit.click(() => {
    return false
});


function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

function handleError(error) {
    console.log(`navigator.getUserMedia error: ${error}`);
    alert(`Camera not found, or in use elsewhere`)
}


function sendImage(userId, imageBlob) {
    console.log("Image sendiing to Server");

    let data = {
        userId: userId,
        imageBlob: imageBlob
    };

    $.ajax({
        url: '/restaurant/upload_picture',
        type: "POST",
        method: 'POST',
        dataType: 'json',
        data: data,
        success: (data) => {
            // const token = data.token;
            // location.reload();
            console.log("Success");
        },
        error:
             (err) => {
                alert(`Error: ${err.status}: ${err.statusText}`);
            }
    });
}