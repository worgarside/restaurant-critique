/**
 * restaurant_new.js
 * Client-side JS
 * @author Will Garside
 * @param {Array} categoryVar Array of categories passed from server
 */


$(() => {
    $('#opening-time').timepicker({
        timeFormat: 'HH:mm',
        interval: 30,
        minTime: '0',
        maxTime: '23:30',
        defaultTime: '09',
        startTime: '00:00',
        dynamic: false,
        dropdown: false,
        scrollbar: false
    });

    $('#closing-time').timepicker({
        timeFormat: 'HH:mm',
        interval: 30,
        minTime: '0',
        maxTime: '23:30',
        defaultTime: '23',
        startTime: '00:00',
        dynamic: false,
        dropdown: false,
        scrollbar: false
    });

    categories = categoryVar;
});

$('#new-restaurant-form').on('keyup keypress', function(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
});

// ================ Opening Times ================ \\

// Forces time input to resolve prior to submission
$("#add-times").mouseenter(() => {
    $("#opening-time").blur();
    $("#closing-time").blur();
});

// noinspection JSUnusedGlobalSymbols
/**
 * Displays the selected opening hours on the page when the User clicks the 'Add Times' button
 * Appends a form-row with html to display times and 'remove' button
 * Also updates the values of hidden inputs for submission to the server
 */
function addTimes() {
    const openTimeString = $("#opening-time").val();
    const closeTimeString = $("#closing-time").val();

    if ((openTimeString !== "") && (closeTimeString !== "")) {
        const openTimeInt = (openTimeString.split(':')[0] * 60) + parseInt(openTimeString.split(':')[1]);
        const closeTimeInt = (closeTimeString.split(':')[0] * 60) + parseInt(closeTimeString.split(':')[1]);

        if (openTimeInt < closeTimeInt) {
            const dayInput = $("#days-of-week");
            const dayString = dayInput.children("option").filter(":selected").text();
            const dayValue = dayInput.val();
            const selectedTimes = $("#selected-opening-times");

            const newHTML = `
                <div class='form-row' id='selected-day-${dayString}'>
                    <div class='col-3 text-center'>
                        <p style='margin-bottom:5px'>${dayString}</p>
                    </div>
                    <div class='col-6 text-center'>
                        <p style='margin-bottom:5px'>${openTimeString} - ${closeTimeString} </p>
                    </div>
                    <div class='col-3 text-center'>
                        <a onclick='removeSelectedDay(this);' href='javascript:void(0);' id=${dayString} style='padding:4px'>Remove</a> 
                    </div>
               </div>
                `;

            dayInput.find(`option[value=${dayValue}]`).remove();
            $("#selected-times-row").prop({hidden: false});
            if (dayInput.children('option').length === 0) {
                $(".opening-times-form").prop({"disabled": true, hidden: true});
            }
            selectedTimes.append(newHTML);
            $(`input[name='${dayString.toLowerCase()}Open']`).val(openTimeInt);
            $(`input[name='${dayString.toLowerCase()}Close']`).val(closeTimeInt);

        } else {
            console.log("Invalid time choice");
        }
    } else {
        console.log("Empty time(s)");
    }
}

/**
 * Removes the selected times to allow the User to edit them or leave them out completely
 * Also removes the values of the hidden inputs to avoid incorrect submission
 * @param {button} button The button used to trigger the function, containing the ID of the day to be moved
 */
function removeSelectedDay(button) {
    const dayInput = $("#days-of-week");
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const day = button.id;

    $(`#selected-day-${day}`).remove();
    $(`input[name='${day.toLowerCase()}Open']`).val(null);
    $(`input[name='${day.toLowerCase()}Close']`).val(null);
    $(".opening-times-form").attr({"disabled": false, hidden: false});
    dayInput.append($("<option></option>").attr("value", daysOfWeek.indexOf(day)).text(day));

    if (dayInput.children('option').length === 7) {
        $("#selected-times-row").prop({hidden: true});
    }
}

// ================ Address Lookup ================ \\

let geocoder, categories;
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

// noinspection JSUnusedGlobalSymbols
/**
 * Uses Google Geolocation to find an address from the postcode
 * @returns {HTML} sets the HTML to show the found address
 */
function findAddress() {
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
}

// noinspection JSUnusedGlobalSymbols
/**
 * Toggles some HTML components to allow the user to edit their address
 * @returns {HTML} changes HTML
 */
function editAddress() {
    showHTML([
        $('#address-input-choice'),
        $('#address-lookup-found-edit'),
        $('#address-lookup-found-confirm-control')
    ]);
    hideHTML([
        $('#address-lookup-found-edit-control')
    ]);
}

// noinspection JSUnusedGlobalSymbols
/**
 * Confirms a User's to their address information
 * @returns {HTML} changes HTML
 */
function confirmEdit() {
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
}

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
 */
function editMapAddress() {
    showHTML([
        $('#address-input-choice'),
    ]);
    hideHTML([
        $('#address-map-edit-control')
    ]);
}

/**
 * Helper function to iterate over an array of HTML elements and show them all on the page
 * @param {Array} iterable Array of HTML elements to be displayed
 */
function showHTML(iterable) {
    for (const element of iterable) {
        element.show(400);
        element.prop('readonly', false);
    }
}

/**
 * Helper function to iterate over an array of HTML elements and hide them all on the page
 * @param {Array} iterable Array of HTML elements to be hidden
 */
function hideHTML(iterable) {
    for (const element of iterable) {
        element.hide(400);
        element.prop('readonly', true);
    }
}

// ================ Google Maps ================ \\

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

// ================ Category Picker ================ \\

const categorySelector = $('#category-selector');
const categorySelected = $('#category-selected');
const categoryPicker = $('#category');
const categoryDropdown = $('#category-dropdown');
const categoryBodyInput = $('#category-body');

/**
 * Changes some HTML elements styling and attributes when the Category picker is deselected when the user clicks off it
 * @function hideCategoryPicker
 */
$(document).mousedown((e) => {
    if (!categorySelector.is(e.target) && !categoryPicker.is(e.target) &&
        !categoryDropdown.is(e.target) && categorySelector.has(e.target).length === 0) {
        categoryPicker.blur();
        categorySelected.css('border-color', '#ced4da');
        categoryPicker.css('border-color', '#ced4da');
        hideCategoryDropdown();
    }
});

categoryPicker.focus(() => {
    categoryPicker.css('border-color', '#818181');
    categorySelected.css('border-color', '#818181');
    checkCategoryPicker();
});

categoryPicker.keyup(() => {
    checkCategoryPicker();
});

/**
 * Checks the Category picker's contents to determine if it should be shown or not
 */
function checkCategoryPicker() {
    console.log('.');
    if (categoryPicker.val().length > 0) {
        const matchedCategories = matchCategories(categoryPicker.val());

        if (matchedCategories.length > 0) {
            showCategoryDropdown(matchedCategories);
        } else {
            hideCategoryDropdown();
        }
    } else {
        hideCategoryDropdown();
    }

    if (selectedCategories.length > 0) {
        categorySelected.show();
    } else {
        hideCategorySelected();
    }

}

/**
 * Matches categories to a User search query
 * @param {String} categorySearch The User's query
 * @returns {Array} An array of Category names
 */
function matchCategories(categorySearch) {
    let matchList = [];

    for (const category of categories) {
        if (category.name.toLowerCase().startsWith(categorySearch.toLowerCase())) {
            matchList.push(category);
        }
    }

    return matchList
}

/**
 * Displays the Category dropdown to the User with the matched Categories as its contents
 * @param {Array} matchedCategories An array of Category names
 */
function showCategoryDropdown(matchedCategories) {
    categoryPicker.css('border-bottom-left-radius', '0');
    categoryPicker.css('border-bottom-right-radius', '0');
    categoryDropdown.show();

    $('.category-matched').remove();
    for (category of matchedCategories) {
        // Need to have single quotes around the onclick function!

        categoryDropdown.append(`
            <div class="category-matched" onclick='selectCategory(${JSON.stringify(category)});'>
                <p>${category.name}</p>
            </div>
        `);
    }
}

/**
 * Modifies the HTML to hide the Category dropdown and its contents
 */
function hideCategoryDropdown() {
    categoryPicker.css('border-bottom-left-radius', '4px');
    categoryPicker.css('border-bottom-right-radius', '4px');
    categoryDropdown.hide();
}

/**
 * When a User clicks on a Category in the picker, it is selected and added to a list for submission
 * This function adds the selected Category to a hidden input, and move it to the selected box o the page
 * @param {String} category The selected Category's name
 */
function selectCategory(category) {
    categoryPicker.css('border-radius', '0');

    selectedCategories.push(category);

    for (const [index, object] of categories.entries()) {
        if (object._id === category._id) {
            categories.splice(index, 1);
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

/**
 * The User can remove a Category from the selection box if they decided against it or have selected it by mistake.
 * This function removes it from a hidden input and updates the Category picker HTML
 * @param {String} category The Category name to be removed
 */
function removeCategory(category) {
    $(`#selected-${category._id}`).remove();


    for (const [index, object] of selectedCategories.entries()) {
        if (object._id === category._id) {
            selectedCategories.splice(index, 1);
            break
        }
    }

    categories.push(category);
    categoryBodyInput.val(JSON.stringify(selectedCategories));

    categoryPicker.focus();
}

/**
 * Hides the selected Category HTML and changes styling for consistency
 */
function hideCategorySelected() {
    categorySelected.hide();
    categoryPicker.css('border-top-left-radius', '4px');
    categoryPicker.css('border-top-right-radius', '4px');
}

// ================ Price Range ================ \\

const priceRangeBody = $('#price-range');
const increaseButton = $('#price-range-increase');
const decreaseButton = $('#price-range-decrease');

increaseButton.click((e) => {
    e.preventDefault();

    if (priceRangeBody.val()) {
        if (priceRangeBody.val() < 4) {
            priceRangeBody.val(parseInt(priceRangeBody.val()) + 1);
        }
    } else {
        priceRangeBody.val(1);
    }

    colorPriceRangeInput();
});

decreaseButton.click((e) => {
    e.preventDefault();

    if (priceRangeBody.val()) {
        if (priceRangeBody.val() > 1) {
            priceRangeBody.val(parseInt(priceRangeBody.val()) - 1);
        }
    } else {
        priceRangeBody.val(1);

    }

    colorPriceRangeInput();
});

/**
 * Applies colours to the Price Range input when the value is set/changed
 */
function colorPriceRangeInput() {
    for (let i = 0; i < 5; i++) {
        if (i < priceRangeBody.val()) {
            $(`#price-range-selector-${i + 1}`).css('color', 'black');
        } else {
            $(`#price-range-selector-${i + 1}`).css('color', '#919191');
        }
    }
}

// ================ Create Restaurant ================ \\

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

$('#verify-email').click(()=>{
    $.ajax({
        url: '/verify_email',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (response) => {
            if (response){
                alert('Verification email sent, it should arrive within the next 24 hours. If not, please check your spam folder or contact us.');
            }else{
                alert('Sorry, we are unable to process your request at this time. PLease try again later.');
            }
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
});

console.log('Loaded restaurant_new.js');
