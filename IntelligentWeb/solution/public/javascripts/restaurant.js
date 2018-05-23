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

const uploadPictures = $('#uploadpics');

const deleteCanvas0 = $('#deletestorecanvas5');
const deleteCanvas1 = $('#deletestorecanvas1');
const deleteCanvas2 = $('#deletestorecanvas2');
const deleteCanvas3 = $('#deletestorecanvas3');
const deleteCanvas4 = $('#deletestorecanvas4');


const canvasContainer = $('#canvas');
const videoContainer = $('#video');
const formSubmit = $('#submit');
let canvasContents = Array(5).fill(false);

const canvasStore0 = document.getElementById("storecanvas5");
const canvasStore0Context = canvasStore0.getContext('2d');
const canvasStore1 = document.getElementById("storecanvas1");
const canvasStore1Context = canvasStore1.getContext('2d');
const canvasStore2 = document.getElementById("storecanvas2");
const canvasStore2Context = canvasStore2.getContext('2d');
const canvasStore3 = document.getElementById("storecanvas3");
const canvasStore3Context = canvasStore3.getContext('2d');
const canvasStore4 = document.getElementById("storecanvas4");
const canvasStore4Context = canvasStore4.getContext('2d');

for (let i=0; i < canvasContents.length; i++){
    eval("canvasStore"+i).width = 640;
    eval("canvasStore"+i).height = 480;
}


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

// ================================ Image Viewer ================================ \\

const imageViewer = $('#full-screen-image-viewer');
let primaryPos = 0;
const prevImage = imageViewer.find('#prev-image');
const nextImage = imageViewer.find('#next-image');
const closeButton = imageViewer.find('#close-button');
const authorInfo = imageViewer.find('#author-info');
const authorImage = authorInfo.find('#author-image');
const authorName = authorInfo.find('p');

console.log(reviewImages);

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


// ================================ Camera Functions ================================ \\

deleteCanvas0.click(() => {
    canvasStore0Context.clearRect(0, 0, canvas.width, canvas.height);
    canvasContents[0] = false;
    videoContainer.css("display", "unset");
    takePhotoButton.css("display", "unset");
});
deleteCanvas1.click(() => {
    canvasStore1Context.clearRect(0, 0, canvas.width, canvas.height);
    canvasContents[1] = false;
    videoContainer.css("display", "unset");
    takePhotoButton.css("display", "unset");
});
deleteCanvas2.click(() => {
    canvasStore2Context.clearRect(0, 0, canvas.width, canvas.height);
    canvasContents[2] = false;
    videoContainer.css("display", "unset");
    takePhotoButton.css("display", "unset");
});
deleteCanvas3.click(() => {
    canvasStore3Context.clearRect(0, 0, canvas.width, canvas.height);
    canvasContents[3] = false;
    videoContainer.css("display", "unset");
    takePhotoButton.css("display", "unset");
});

deleteCanvas4.click(() => {
    canvasStore4Context.clearRect(0, 0, canvas.width, canvas.height);
    canvasContents[4] = false;
    videoContainer.css("display", "unset");
    takePhotoButton.css("display", "unset");
});

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


//Checks to see if all Canvas' contain pictures, to hide take picture when 5 pictures are taken.
function arrayTrue(array) {
    for(let i = 0; i < array.length; i++) {
        if(array[i] === false) {
            return false;
        }
    }
    return true;
}


function numberOfTrue(array){
    let trueNumber = 0;
    for(let i = 0; i < array.length; i++) {
        if(array[i] === true) {
            trueNumber++;
        }
    }
    return trueNumber;
}


confirmPhotoButton.click(() => {
    for (let i = 0; i < canvasContents.length; i++) {
        if (!canvasContents[i]){
            eval("canvasStore"+i+"Context").drawImage(canvas, 0, 0, canvas.width, canvas.height);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            canvasContents[i] = true;
            break;
        }
    }

    videoContainer.css("display", "unset");
    canvasContainer.css("display", "none");
    takePhotoButton.css("display", "unset");
    confirmPhotoButton.css("display", "none");
    retakePhotoButton.css("display", "none");
    if (arrayTrue(canvasContents)){
        videoContainer.css("display", "none");
        canvasContainer.css("display", "none");
        takePhotoButton.css("display", "none");
    }

});

retakePhotoButton.click(() => {
    videoContainer.css("display", "unset");
    canvasContainer.css("display", "none");
    takePhotoButton.css("display", "unset");
    confirmPhotoButton.css("display", "none");
    retakePhotoButton.css("display", "none");
});




// ================================ Review Submission ================================ \\

uploadPictures.click(() => {
 sendImage(22);
});

formSubmit.click(() => {


    return false;
});


function handleSuccess(stream) {
    window.stream = stream;
    video.srcObject = stream;
}

function handleError(error) {
    console.log(`navigator.getUserMedia error: ${error}`);
    alert(`Camera not found, or in use elsewhere`)
}


function sendImage(userId) {
    console.log("Image sending to Server");

    let noOfImages = numberOfTrue(canvasContents);
    let data = {
        userId: userId,
        noOfImages: noOfImages
    };

    for (let i = 0; i < canvasContents.length; i++) {
        if (canvasContents[i] = true){
            data["imageBlob"+i] = eval("canvasStore"+i).toDataURL();
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