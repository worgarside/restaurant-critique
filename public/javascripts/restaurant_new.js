/**
 * restaurant_new.js
 * Client-side JS
 * @author Will Garside
 * @param {Array} categoryVar Array of categories passed from server
 */

$(() => {
    allCategories = categoryVar;
});

$('#new-restaurant-form').on('keyup keypress', function (e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
});

// ================ Address Lookup ================ \\

let geocoder, allCategories;
let formattedAddress = '';
let currentLocation = {lat: 53.380450, lng: -1.472233};
let selectedCategories = [];

const inputAddress1 = $('#address1');
const inputAddress2 = $('#address2');
const inputCity = $('#city');
const inputPostcode = $('#postcode');
const inputLat = $('#lat');
const inputLng = $('#lng');
const searchAddress = $('#search-address');
const searchPostcode = $('#search-postcode');

/**
 * Toggles the HTML to show the user an address lookup form
 * @returns {HTML} changes HTML
 * @function lookupAddressToggle
 */
$('#address-lookup-button').click(() => {
    $('#address-lookup-button').addClass('active');
    $('#address-map-button').removeClass('active');

    showHTML([$('#address-lookup-search')]);
    hideHTML([
        $('#address-map-text'),
        $('#address-map-map-wrapper')
    ]);
    $('#search-address').focus();
});

/**
 * Toggles the HTML to show a GMap for the user to set their address on rather than a manual form
 * @returns {HTML} changes HTML
 * @function lookupMapToggle
 */
$('#address-map-button').click(() => {
    $('#address-map-button').addClass('active');
    $('#address-lookup-button').removeClass('active');

    showHTML([
        $('#address-map-text'),
        $('#address-map-map-wrapper'),
        $('#address-map-edit-control')
    ]);
    hideHTML([
        $('#address-lookup-search'),
        $('#address-lookup-found'),
        $('#address-lookup-found-edit'),
        $('#address-input-choice')
    ]);
});

/**
 * Sets the value of the address values for submission when the User edits the form
 * @function editFoundAddress
 */
$('#address-lookup-found-edit').on('input', () => {
    formattedAddress = '';

    $('#address-lookup-found-edit').find('input').each((index, item) => {
        if (item.value !== '') {
            if (index > 0) {
                formattedAddress += ', ';
            }
            formattedAddress += item.value;
        }
    });
    $('#formatted-address-lookup').val(formattedAddress);
});

/**
 * Prevents the user from submitting the form by accident if they confirm their address
 */
$('#address-lookup-search').find('input').keypress((e) => {
    if (e.which === 13) {
        $('#lookup-btn').click();
        e.preventDefault()
    }
});

/**
 * Uses Google Geolocation to find an address from the postcode
 * @returns {HTML} sets the HTML to show the found address
 * @function findAddress
 */
$('#lookup-btn').click(() => {
    const submittedAddress1 = searchAddress.val();
    const submittedPostcode = searchPostcode.val();
    formattedAddress = '';

    inputAddress1.val('');
    inputAddress2.val('');
    inputCity.val('');
    inputPostcode.val('');

    if (!submittedPostcode || !submittedAddress1) {
        alert('Please enter a name/number and a postcode')
    } else {
        geocoder.geocode({'address': `${submittedPostcode}, UK`}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                inputLat.val(lat.toFixed(9));
                inputLng.val(lng.toFixed(9));
                currentLocation = {lat: lat, lng: lng};

                let foundAddress = {};
                for (const component of results[0].address_components) {
                    if (component.long_name) {
                        foundAddress[`${component.types[0]}`] = component.long_name;
                    }
                }

                inputAddress1.val(searchAddress.val());
                formattedAddress += searchAddress.val();

                if (foundAddress.route) {
                    inputAddress2.val(foundAddress.route);
                    formattedAddress += `, ${foundAddress.route}`;
                }

                if (foundAddress.postal_town) {
                    inputCity.val(foundAddress.postal_town);
                    formattedAddress += `, ${foundAddress.postal_town}`;
                }

                inputPostcode.val(foundAddress.postal_code);

                formattedAddress += `, ${foundAddress.postal_code}`;
                $('#formatted-address-lookup').val(formattedAddress);

                showHTML([
                    $('#address-lookup-found')
                ]);

                hideHTML([
                    $('#address-input-choice'),
                    $('#address-lookup-search')
                ]);
            } else {
                alert('Invalid postcode. Please try again.');
            }
        });
    }
});

// noinspection JSUnusedGlobalSymbols
/**
 * Toggles some HTML components to allow the user to edit their address
 * @returns {HTML} changes HTML
 * @function editAddress
 */
$('#address-lookup-found-edit-control').click(() => {
    showHTML([
        $('#address-input-choice'),
        $('#address-lookup-found-edit'),
        $('#address-lookup-found-confirm-control')
    ]);
    hideHTML([
        $('#address-lookup-found-edit-control')
    ]);
});

// noinspection JSUnusedGlobalSymbols
/**
 * Confirms a User's to their address information
 * @returns {HTML} changes HTML
 * @function confirmEdit
 */
$('#confirm-edit').click(() => {
    const oldPostcode = searchPostcode.val().toLowerCase().replace(/ /g, '');
    const newPostcode = inputPostcode.val().toLowerCase().replace(/ /g, '');

    if (oldPostcode !== newPostcode) {
        geocoder.geocode({'address': `${newPostcode}, UK`}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                inputLat.val(lat.toFixed(9));
                inputLng.val(lng.toFixed(9));
                currentLocation = {lat: lat, lng: lng};
                confirmEditHTMLMod()
            }
        })
    } else {
        confirmEditHTMLMod()
    }
});

/**
 * Simply modifies the HTML when the User confirms an address edit to keep the page from being cluttered
 * @returns {HTML} changes HTML
 */
function confirmEditHTMLMod() {
    $('#formatted-address-lookup').val(formattedAddress);

    showHTML([
        $('#address-lookup-found-edit-control')
    ]);
    hideHTML([
        $('#address-input-choice'),
        $('#address-lookup-found-edit'),
        $('#address-lookup-found-confirm-control')
    ]);
}

// noinspection JSUnusedGlobalSymbols
/**
 * Toggles HTML components for the User to edit their address after using the map to find it
 * @returns {HTML} changes HTML
 * @function editMapAddress
 */
$('#address-map-edit-control').click(() => {
    showHTML([
        $('#address-input-choice'),
    ]);
    hideHTML([
        $('#address-map-edit-control')
    ]);
});


// ================================ Google Maps ================================ \\

// noinspection JSUnusedGlobalSymbols
/**
 * Called by GMaps script after map is loaded
 * Initialises Google Map V3 attributes and markers
 */
function initMap() {
    geocoder = new google.maps.Geocoder();

    const styles = [{
        "featureType": "poi.business",
        "stylers": [
            {"visibility": "off"}
        ]
    }];

    const map = new google.maps.Map($('#address-map-map')[0], {
        zoom: 14,
        center: currentLocation,
        styles: styles,
        mapTypeControl: false,
        streetViewControl: false,
    });

    const marker = new google.maps.Marker({
        map: map,
        draggable: true,
        position: currentLocation
    });

    google.maps.event.addListener(marker, 'dragend', () => {
        const lat = marker.getPosition().lat();
        const lng = marker.getPosition().lng();
        inputLat.val(lat.toFixed(9));
        inputLng.val(lng.toFixed(9));

        geocoder.geocode({'location': {lat: lat, lng: lng}}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
                let foundAddress = {};
                formattedAddress = '';

                console.log(results[0]);

                for (const component of results[0].address_components) {
                    if (component.long_name) {
                        foundAddress[`${component.types[0]}`] = component.long_name;
                    }
                }

                if (foundAddress.street_number) {
                    inputAddress1.val(foundAddress.street_number);
                    formattedAddress += `${foundAddress.street_number}, `;
                } else if (foundAddress.premise) {
                    inputAddress1.val(foundAddress.premise);
                    formattedAddress += `${foundAddress.premise}, `;
                }

                if (foundAddress.route) {
                    inputAddress2.val(foundAddress.route);
                    formattedAddress += `${foundAddress.route}, `;
                }

                if (foundAddress.postal_town) {
                    inputCity.val(foundAddress.postal_town);
                    formattedAddress += `${foundAddress.postal_town}, `;
                }

                inputPostcode.val(foundAddress.postal_code);

                formattedAddress += foundAddress.postal_code;
                $('#formatted-address-map').val(formattedAddress);
            }
        });

    });
}

// ================================ Category Picker ================================ \\

/**
 * When a User clicks on a Category in the picker, it is selected and added to a list for submission
 * This function adds the selected Category to a hidden input, and move it to the selected box o the page
 * @param {String} category The selected Category's name
 */
function selectCategory(category) {
    categoryPicker.css('border-radius', '0');

    selectedCategories.push(category);

    for (const [index, object] of allCategories.entries()) {
        if (object._id === category._id) {
            allCategories.splice(index, 1);
            break
        }
    }

    categoryBodyInput.val(JSON.stringify(selectedCategories));

    // Need to have single quotes around the onclick function!
    categorySelected.append(`
        <div class="category-selected" id="selected-${category._id}">
            <p>${category.name}
                <span class="oi oi-x" onclick='removeCategory(${JSON.stringify(category)});'></span>
            </p>
        </div>
    `);

    categoryPicker.focus();
}

// ================================ Image Upload ================================ \\

const imageInput = $('#image-upload');
const imageList = $('#uploaded-images');
const imageClicker = $('#image-upload-link');
const fileCountInput = $('#file-count');

imageClicker.click(() => {
    imageInput.click();
});

/**
 * Updates the HTML to allow previews of the uploaded images
 * @function updateImagePreviews
 */
imageInput.change(function () {
    imageList.empty();

    for (let i = 0; i < this.files.length; i++) {
        let newFile = {
            name: this.files[i].name,
            url: window.URL.createObjectURL(this.files[i])
        };

        imageList.append(`
            <div class='row'>
                <div class='col-10'>
                    <div class='vert-center-parent'>
                        <div class='vert-center-child'>
                        <p class='mb-0'>${newFile.name}</p>
                        </div>
                    </div>
                </div>
                <div class='col-2'>
                    <div class='vert-center-parent'>
                        <div class='vert-center-child'>
                            <span class='oi oi-image d-inline'><img src='${newFile.url}'/></span>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    if (this.files.length === 0) {
        fileCountInput.val('Click here to upload images');
    } else if (this.files.length === 1) {
        fileCountInput.val('1 File Added');
    } else {
        fileCountInput.val(`${this.files.length} Files Added`);
    }
});

// ================================ Create Restaurant ================================ \\

/**
 * Submits the Restaurant immediately after setting the verification and publish flag to False on button click
 * @function saveRestaurant
 */
$('#save-restaurant').click(() => {
    $('#verified-flag').prop('checked', false);
    $('#publish-flag').prop('checked', false);
    $('#submit').click();
});

/**
 * Submits the Restaurant immediately after setting the verification and publish flag to True on button click
 * @function publishRestaurant
 */
$('#publish-restaurant').click(() => {
    $('#verified-flag').prop('checked', true);
    $('#publish-flag').prop('checked', true);
    $('#submit').click();
});


console.log('Loaded restaurant_new.js');