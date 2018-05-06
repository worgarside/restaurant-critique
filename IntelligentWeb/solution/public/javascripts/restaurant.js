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
    console.log("clicky confirmy");
    sendImage("22", dataURLtoBlob(canvas.toDataURL()));
    console.log("clicky confirmy2");

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

function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}


function sendImage(userId, imageBlob) {



    const data = JSON.stringify({
        userId: userId,
        imageBlob: imageBlob
    });

    // let data = new FormData();
    //
    // data.append('userId', 'userId');
    // data.append('imageBlob', 'imageBlob');

    $.ajax({
        url: '/restaurant/upload_picture',
        type: "POST",
        method: 'POST',
        // dataType: 'application/json',
        data: JSON.stringify(data),
        processData: false,
        contentType: false,
        json: true,
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