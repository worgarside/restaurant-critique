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

$('#add-photo-btn').find('button').click(() => {
    const constraints = {
        audio: false,
        video: {
            facingMode: 'environment',
            width: {min: 960, ideal: 1920, max: 1920},
            height: {min: 540, ideal: 1080, max: 1080},
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {


            $('#pre-webRTC-col').hide();

            liveVideo = $('#live-video');
            liveVideoContent = liveVideo[0];
            newImgCanvas = $('#new-image');
            newImgCanvasContent = newImgCanvas[0];

            window.stream = stream;
            liveVideoContent.srcObject = stream;

            liveVideoContent.onloadeddata = function () {
                console.log('Video stream active');
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

            $('#webRTC-col').show();
        })
        .catch((err) => {
            alert('There was an error connecting to your webcam. Please ensure it is connected and try again, or try again later.');
            console.log(`getUserMedia Error: ${err}`);
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

/**
 * Prevent the default action of the review submission form, serialise the webRTC canvasses and send the blobs to
 * the server via AJAX
 * @function submitReview
 */
$('form#review-form').submit((e) => {
    e.preventDefault();
    $('#submitting-div').show();

    let imageBlob = [];
    for (let i = 0; i < maxImageCount; i++) {
        if (canvasContents[i]) {
            imageBlob.push(canvasArr[i].toDataURL());
        }
    }

    // Push empty string to ensure array has at least 2 elements for parsing - weird bug, easy fix
    imageBlob.push('');

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
            if (result.success) {
                $('.row#review-submission-div').hide();
            }
        },
        error: (err) => {
            alert('Review submission failed. Please try again later.');
            console.log(`Review error: ${err}`);
            $('#submitting-div').hide();
        }
    });
});

// ================================ Category List Toggle ================================ \\

let categoriesHidden = true;
const hiddenCategories = $('.hidden-category');

$('#toggle-btn').click(function () {
    categoriesHidden = !categoriesHidden;
    if (categoriesHidden) {
        hiddenCategories.css('display', 'none');
        this.text = 'View more...';
    } else {
        hiddenCategories.css('display', 'inline-block');
        this.text = 'View less...';
    }
});

// ================================ Socket IO ================================ \\

const socket = io();
if (navigator.onLine){
    socket.on('review', (review) => {
        console.log(review);

        const reviewDate = new Date(review.updatedAt);
        const month = reviewDate.getMonth() + 1;
        const day = (reviewDate.getDate() < 10) ? '0' + reviewDate.getDate() : reviewDate.getDate();
        const year = reviewDate.getFullYear();

        const starRating = Math.round(review.restaurantRating);
        let starCount = 0;

        let starHTML = '';

        while (starCount < starRating) {
            starHTML += "<span class='oi oi-star star-highlight'></span>";
            starCount++;
        }
        while (starCount < 5) {
            starHTML += "<span class='oi oi-star '></span>";
            starCount++;
        }

        let imageHTML = '';

        if (review.images.length === 1) {
            imageHTML = `
                <div class='review-image-main vert-center-parent'>
                    <div class='vert-center-child'>
                        <img src='/images/restaurants/${review.restaurant._id}/${review.images[0]}'/>
                    </div>
                </div>
            `;
        } else if (review.images.length > 1) {
            imageHTML = `
                <tr>
                    <td rowspan='2'>
                        <div class='review-image-main'>
                            <img src='/images/restaurants/${review.restaurant._id}/${review.images[0]}'/>
                        </div>
                    </td>
                    <td>
                        <div class='review-image-secondary'>
                            <img src='/images/restaurants/${review.restaurant._id}/${review.images[1]}'/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
            `;

            if (review.images[2]) {
                imageHTML += `
                <div style="margin-top: 1px;" class='review-image-secondary'>
                    <img src='/images/restaurants/${review.restaurant._id}/${review.images[2]}'/>
                </div>
            `;
            } else {
                imageHTML += `
                    <div style='margin-top: 1px; background-color: rgba(0, 0, 0, 0);' class='review-image-secondary'>
                    </div>
                `;
            }
        }

        imageHTML += `
            </td>
        </tr>
        `;

        const newReviewHTML = `
            <br/>
            <div class='row no-gutters'>
                <div class='col-lg-2 col-md-12'>
                    <div class='vert-center-parent'>
                        <div class='vert-center-child'>
                            <div class='text-center'>
                                <img src='/images/userImages/${review.author.reducedID}' class='mb-2 review-author-image'/>
                                <h5 class='mb-0'>${review.author.forename} ${review.author.surname}</h5>
                                <p class='mt-1 review-date'>${month}/${day}/${year}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='col-lg-6 col-md-8'>
                    <div class='vert-center-parent'>
                        <div class='vert-center-child'>
                            <div class='row mb-2'>
                                <div class='col'>
                                    ${starHTML}
                                    <h5 id=${review._id} class='d-inline ml-2'>${review.title}</h5>
                                </div>
                            </div>
                            <div class='row'>
                                <div class='col-lg-12'>
                                    <p class='mb-0'>${review.body}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='col-lg-4 col-md-4'>
                    <div id='review-image-container'>
                        ${imageHTML}
                    </div>
                </div>
            </div>
        `;

        $('#reviews').append(newReviewHTML);
    });
}

console.log('Loaded restaurant.js');