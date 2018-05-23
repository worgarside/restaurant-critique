/**
 * restaurant.js
 * Client-side JS
 * @author Greta Ramaneckaite, Will Garside, Rufus Cope
 * @param {Array} coordinates
 */


// ================================ Google Maps ================================ \\

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

// ================================ Image Viewer ================================ \\

const imageViewer = $('#full-screen-image-viewer');
let primaryPos = 0;
const prevImage = imageViewer.find('#prev-image');
const nextImage = imageViewer.find('#next-image');
const closeButton = imageViewer.find('#close-button');
const authorInfo = imageViewer.find('#author-info');
const authorImage = authorInfo.find('#author-image');
const authorName = authorInfo.find('p');

$('img.pointer').click(function () {
    if ($(window).width() > 700) {
        const currentSource = this.src;
        const currentImage = currentSource.substr(currentSource.lastIndexOf('/') + 1).replace(/(%20)/, ' ');
        primaryPos = images.indexOf(currentImage);
        updateImageViewer();
    }
});

prevImage.click(() => {
    primaryPos--;
    if (primaryPos < 0) {
        primaryPos += images.length;
    }
    updateImageViewer();
});

nextImage.click(() => {
    primaryPos++;
    primaryPos = primaryPos % images.length;
    updateImageViewer();
});

closeButton.click(() => {
    imageViewer.hide();
});

function updateImageViewer() {
    const viewerImages = [];

    for (let i = 0; i < images.length; i++) {
        let pointer = (i + primaryPos) % images.length;
        viewerImages.push(images[pointer]);
    }

    // noinspection FallThroughInSwitchStatementJS
    switch (viewerImages.length) {
        case 4:
            imageViewer.find('#fourth-image img').attr('src', `/images/restaurants/${restaurantId}/${viewerImages[3]}`);
        case 3:
            imageViewer.find('#third-image img').attr('src', `/images/restaurants/${restaurantId}/${viewerImages[2]}`);
        case 2:
            imageViewer.find('#second-image img').attr('src', `/images/restaurants/${restaurantId}/${viewerImages[1]}`);
        case 1:
            imageViewer.find('#main-image').attr('src', `/images/restaurants/${restaurantId}/${viewerImages[0]}`);
            break;
        case 0:
            break;
        default:
            imageViewer.find('#fourth-image img').attr('src', `/images/restaurants/${restaurantId}/${viewerImages[3]}`);
            imageViewer.find('#third-image img').attr('src', `/images/restaurants/${restaurantId}/${viewerImages[2]}`);
            imageViewer.find('#second-image img').attr('src', `/images/restaurants/${restaurantId}/${viewerImages[1]}`);
            imageViewer.find('#main-image').attr('src', `/images/restaurants/${restaurantId}/${viewerImages[0]}`);
    }

    for (let i = 0; i < reviewImages.length; i++) {
        if (reviewImages[i].images.includes(viewerImages[0])) {
            authorName.text(`${reviewImages[i].author.forename} ${reviewImages[i].author.surname}`);
            authorImage.attr('src', `/images/userImages/${reviewImages[i].author.reducedID}`);
            authorInfo.show();
            break;
        } else {
            authorInfo.hide();
        }
    }

    imageViewer.show();
}

$(document)
    .mousedown((e) => {
        if (!imageViewer.find('table').is(e.target) && imageViewer.find('table').has(e.target).length === 0) {
            imageViewer.hide();
        }
    })
    .keydown((e) => {
        if (e.keyCode === 27) { // escape key maps to keycode `27`
            imageViewer.hide();
        }
    });


// ================================ WebRTC ================================ \\

const maxImageCount = 5;


let video, canvas, canvasDOM;
const canvasWidth = 640;
const canvasHeight = 480;
const takePhotoButton = $('#take-photo');
const confirmPhotoButton = $('#confirm-photo');
const retakePhotoButton = $('#retake-photo');
const uploadPictures = $('#upload-pics');
const canvasContainer = $('#new-image');
const videoContainer = $('#live-video');
const formSubmit = $('#submit');
let canvasContents = new Array(maxImageCount).fill(false);

let canvasArr = [];
let canvasCtx = [];
let deleteButton = [];

for (let i = 0; i < maxImageCount; i++) {
    const canvasStore = $(`#image-${i}`)[0];
    canvasStore.width = canvasWidth;
    canvasStore.height = canvasHeight;
    canvasArr.push(canvasStore);
    canvasCtx.push(canvasStore.getContext('2d'));

    deleteButton.push($(`#delete-canvas${i}`));
}

$(() => {
    video = $('video')[0];
    canvas = $('#new-image');
    canvasDOM = canvas[0];
    canvasDOM.width = canvasWidth;
    canvasDOM.height = canvasHeight;

    const constraints = {
        audio: false,
        video: {facingMode: 'environment'}
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            window.stream = stream;
            video.srcObject = stream;
        })
        .catch((err) => {
            alert(`Camera not found, or in use elsewhere`)
        });
});

$('.delete-image').click(function () {
    const imageNumber = parseInt(this.id.split('-').pop());
    canvasCtx[imageNumber].clearRect(0, 0, canvasWidth, canvasHeight);
    canvasContents[imageNumber] = false;
    showHTML([takePhotoButton, videoContainer]);
});

takePhotoButton.click(() => {
    canvasDOM.getContext('2d').drawImage(video, 0, 0, canvasWidth, canvasHeight);
    showHTML([canvasContainer, confirmPhotoButton, retakePhotoButton]);
    hideHTML([videoContainer, takePhotoButton]);
});

confirmPhotoButton.click(() => {
    for (let i = 0; i < canvasContents.length; i++) {
        if (!canvasContents[i]) {
            canvasCtx[i].drawImage(canvasDOM, 0, 0, canvasWidth, canvasHeight);
            canvasDOM.getContext('2d').clearRect(0, 0, canvasWidth, canvasHeight);
            canvasContents[i] = true;
            break;
        }
    }

    showHTML([videoContainer, takePhotoButton]);
    hideHTML([canvasContainer, confirmPhotoButton, retakePhotoButton]);

    if (canvasContents.every(x => x)) {
        hideHTML([videoContainer, canvasContainer, takePhotoButton]);
    }
});

retakePhotoButton.click(() => {
    hideHTML([canvasContainer, confirmPhotoButton, retakePhotoButton]);
    showHTML([videoContainer, takePhotoButton]);
});

function hideHTML(array) {
    array.forEach(x => x.hide());
}

function showHTML(array) {
    array.forEach(x => x.show());
}

// ================================ Review Submission ================================ \\

uploadPictures.click(() => {
    sendImage(22);
});

formSubmit.click(() => {
    return false;
});

function sendImage(userId) {
    let imageCount = 0;
    canvasContents.forEach(x => x ? imageCount++ : x);

    let data = {
        userId: userId,
        noOfImages: imageCount
    };

    for (let i = 0; i < maxImageCount; i++) {
        if (canvasContents[i]) {
            data[`imageBlob${i}`] = canvasArr[i].toDataURL();
        }
    }

    $.ajax({
        url: '/restaurant/upload_picture',
        type: "POST",
        method: 'POST',
        dataType: 'json',
        data: data,
        success: (data) => {
            console.log("Success");
        },
        error:
            (err) => {
                alert(`Error: ${err.status}: ${err.statusText}`);
            }
    });
}