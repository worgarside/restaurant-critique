console.log('Loaded restaurant_new.js');
let geocoder;
let formattedAddress = '';
let currentLocation = {lat: 53.380450, lng: -1.472233};

const inputAddress1 = $('#address1');
const inputAddress2 = $('#address2');
const inputCity = $('#city');
const inputPostcode = $('#postcode');
const inputLat = $('#lat');
const inputLng = $('#lng');
const searchAddress = $('#search-address');
const searchPostcode = $('#search-postcode');

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

    $.ajax({
        url: '/restaurant/new/get-categories',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (result) => {
            console.log('AJAX Succeeded');
            console.log(result);
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });

});

// ================ Opening Times ================ \\

// Forces time input to resolve prior to submission
$("#add-times").mouseenter(() => {
    $("#opening-time").blur();
    $("#closing-time").blur();
});

// noinspection JSUnusedGlobalSymbols
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

$('#address-lookup-search').find('input').keypress((e) => {
    if (e.which === 13) {
        $('#lookup-btn').click();
        e.preventDefault()
    }
});

$('.no-enter-submit').keypress((e) => {
    if (e.which === 13) e.preventDefault();
});

$('.title-case').keyup(function () {
    const inputString = $(this).val().split(" ");
    for (let i = 0; i < inputString.length; i++) {
        const j = inputString[i].charAt(0).toUpperCase();
        inputString[i] = j + inputString[i].substr(1);
    }
    $(this).val(inputString.join(' '));
});

$('.upper-case').keyup(function () {
    $(this).val($(this).val().toUpperCase());
});

// noinspection JSUnusedGlobalSymbols
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
function editMapAddress() {
    showHTML([
        $('#address-input-choice'),
    ]);
    hideHTML([
        $('#address-map-edit-control')
    ]);
}

function showHTML(iterable) {
    for (const element of iterable) {
        element.show(400);
        element.prop('readonly', false);
    }
}

function hideHTML(iterable) {
    for (const element of iterable) {
        element.hide(400);
        element.prop('readonly', true);
    }
}

// ================ Google Maps ================ \\

// noinspection JSUnusedGlobalSymbols
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

let categoryList;

$('#category').keyup(() =>{
    let returnedCount = 10;
    
    if ($('this').val() === '0'){

    }else{
        console.log('showing dd');
        showCategoryDropdown();
    }
});

function showCategoryDropdown() {
    $('#category').css('border-radius', '4px 4px 0 0');
}