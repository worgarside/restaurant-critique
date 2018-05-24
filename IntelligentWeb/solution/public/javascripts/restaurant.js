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


let liveVideo, liveVideoContent, newImgCanvas, newImgCanvasContent, origVidWidth, origVidHeight;
const takePhotoButton = $('#take-photo');
const confirmPhotoButton = $('#confirm-photo');
const cancelPhotoButton = $('#cancel-photo');
const reviewSubmitBtn = $('#submit-review');
let canvasContents = new Array(maxImageCount).fill(false);

let canvasArr = [];
let canvasCtx = [];
let deleteButton = [];

$(() => {
    liveVideo = $('#live-video');
    liveVideoContent = liveVideo[0];
    newImgCanvas = $('#new-image');
    newImgCanvasContent = newImgCanvas[0];

    liveVideoContent.onloadeddata = function () {
        origVidWidth = liveVideoContent.videoWidth;
        origVidHeight = liveVideoContent.videoHeight;

        // alert(`Camera res: ${origVidWidth} x ${origVidHeight}`);

        newImgCanvas.width(liveVideo.width());
        newImgCanvas.height(liveVideo.height());

        newImgCanvasContent.width = origVidWidth;
        newImgCanvasContent.height = origVidHeight;

        for (let i = 0; i < maxImageCount; i++) {
            const canvasContent = $(`#image-${i}`)[0];
            canvasContent.width = origVidWidth;
            canvasContent.height = origVidHeight;
            canvasArr.push(canvasContent);
            canvasCtx.push(canvasContent.getContext('2d'));
            deleteButton.push($(`#delete-canvas${i}`));
        }
    };

    const constraints = {
        audio: false,
        video: {
            facingMode: 'environment',// change to user for front facing
            width: {min: 960, ideal: 1920, max: 1920},
            height: {min: 540, ideal: 1080, max: 1080},
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            window.stream = stream;
            liveVideoContent.srcObject = stream;
        })
        .catch((err) => {
            alert(`getUserMedia Error: ${err}`);
        });
});

$('.delete-button').click(function () {
    const imageNumber = parseInt(this.id.split('-').pop());
    canvasCtx[imageNumber].clearRect(0, 0, origVidWidth, origVidHeight);
    canvasContents[imageNumber] = false;
    showHTML([takePhotoButton, liveVideo]);
    hideHTML([$(`#image-container-${imageNumber}`), newImgCanvas, confirmPhotoButton, cancelPhotoButton]);
});

takePhotoButton.click(() => {
    newImgCanvasContent.getContext('2d').drawImage(liveVideoContent, 0, 0, origVidWidth, origVidHeight);
    showHTML([newImgCanvas, confirmPhotoButton, cancelPhotoButton]);
    hideHTML([liveVideo, takePhotoButton]);
});

confirmPhotoButton.click(() => {
    for (let i = 0; i < canvasContents.length; i++) {
        if (!canvasContents[i]) {
            canvasCtx[i].drawImage(newImgCanvasContent, 0, 0, origVidWidth, origVidHeight);
            showHTML([$(`#image-container-${i}`)]);
            newImgCanvasContent.getContext('2d').clearRect(0, 0, origVidWidth, origVidHeight);
            canvasContents[i] = true;
            break;
        }
    }

    showHTML([liveVideo, takePhotoButton]);
    hideHTML([newImgCanvas, confirmPhotoButton, cancelPhotoButton]);

    if (canvasContents.every(x => x)) {
        hideHTML([liveVideo, newImgCanvas, takePhotoButton]);
    }
});

cancelPhotoButton.click(() => {
    hideHTML([newImgCanvas, confirmPhotoButton, cancelPhotoButton]);
    showHTML([liveVideo, takePhotoButton]);
});

function hideHTML(array) {
    array.forEach(x => x.hide());
}

function showHTML(array) {
    array.forEach(x => x.show());
}

// ================================ Review Submission ================================ \\

// TODO jsdoc
$('form#review-form').submit((e) => {
    e.preventDefault();

    let imageBlob = [];
    for (let i = 0; i < maxImageCount; i++) {
        if (canvasContents[i]) {
            imageBlob.push(canvasArr[i].toDataURL());
        }
    }

    // Push empty string to ensure array has at least 2 elements for parsing - weird bug, easy fix
    imageBlob.push('');

    console.log($('#image-upload').files);
    let data = {
        title: $('#review-title').val(),
        rating: $('input.star:checked').val(),
        body: $('#review-body').val(),
        imageBlob: imageBlob,
        restaurantId: restaurantId,
    };

    $.ajax({
        url: '/restaurant/submit_review',
        type: 'POST',
        method: 'POST',
        dataType: 'json',
        data: data,
        success: (result) => {
            alert(result);
            console.log('Success');
        },
        error: (err) => {
            alert(`Error: ${err.status}: ${err.statusText}`);
        }
    });

});