console.log('Loaded restaurant_new.js');
let geocoder;

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

    $('#address-lookup-button').click(() => {
        $('#address-lookup-button').addClass('active');
        $('#address-map-button').removeClass('active');

        showHTML([$('#address-lookup-form')]);
        hideHTML([$('#address-map-form')]);
    });

    $('#address-map-button').click(() => {
        $('#address-map-button').addClass('active');
        $('#address-lookup-button').removeClass('active');

        showHTML([$('#address-map-form')]);
        hideHTML([
            $('#address-lookup-form'),
            $('#address-lookup-found')
        ]);
    });

    $('#found-address-edit').on('input', () => {
        let editedAddress = '';

        $('#found-address-edit').find('input').each( (index, item) => {
            if (item.value !== '') {
                if (index > 0) {
                    editedAddress += ', ';
                }
                editedAddress += item.value;
            }
        });

        $('#found-address').text(editedAddress);
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

let formattedAddress = '';

// noinspection JSUnusedGlobalSymbols
function findAddress() {
    const submittedAddress1 = $('#address-search').val();
    const submittedPostcode = $('#postcode-search').val();
    formattedAddress = '';

    if (!submittedPostcode || !submittedAddress1) {
        alert('Please enter a name/number and a postcode')
    } else {
        geocoder.geocode({'address': `${submittedPostcode}, UK`}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {

                console.log(JSON.stringify(results[0]));

                let foundAddress = {};
                for (const component of results[0].address_components) {
                    if (component.long_name) {
                        foundAddress[`${component.types[0]}`] = component.long_name;
                    }
                }

                $('#address1').val($('#address-search').val());
                formattedAddress += $('#address-search').val();

                if (foundAddress.route) {
                    $('#address2').val(foundAddress.route);
                    formattedAddress += `, ${foundAddress.route}`;
                }

                if (foundAddress.postal_town) {
                    $('#city').val(foundAddress.postal_town);
                    formattedAddress += `, ${foundAddress.postal_town}`;
                }

                $('#postcode').val(foundAddress.postal_code);
                formattedAddress += `, ${foundAddress.postal_code}`;

                $('#found-address').text(formattedAddress);

                showHTML([
                    $('#address-lookup-found'),
                    $('#address-lookup-found-correct'),
                    $('#address-lookup-found-edit'),
                    $('#address-lookup-found-incorrect')
                ]);

                hideHTML([
                    $('#address-lookup-form'),
                    $('#found-address-edit')
                ]);

            } else {
                alert('Invalid postcode. Please try again.');
            }
        });
    }
}

// noinspection JSUnusedGlobalSymbols
function confirmAddress() {
    const addressHtml = $('#found-address');
    const foundAddressMapHtml = $('#found-address-map');

    hideHTML([
        $('.address-input-found-controls'),
        $('#address-input-choice')
    ]);

    addressHtml.replaceWith(`<label for="formattedAddress">Address</label><span class="oi oi-pencil float-right" aria-hidden='true'/><input id="formattedAddress" class="form-control" disabled value="${addressHtml.text()}" />`);

    geocoder.geocode({'address': $('#postcode').val()}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const currentLocation = {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()};

            const styles = [{
                "featureType": "poi.business",
                "stylers": [
                    {"visibility": "off"}
                ]
            }];

            const map = new google.maps.Map(foundAddressMapHtml[0], {
                zoom: 15,
                center: currentLocation,
                styles: styles,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                draggable: false
            });

            new google.maps.Marker({
                map: map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: currentLocation
            });

            showHTML([$('#found-address-map-wrapper')]);
        }
    });
    hideHTML([$('#found-address-edit')]);

}

// noinspection JSUnusedGlobalSymbols
function editAddress() {
    showHTML([$('#found-address-edit')]);
    hideHTML([$('#address-lookup-found-edit')]);
}

// noinspection JSUnusedGlobalSymbols
function rejectAddress() {
    $('#found-address').text('');

    $('#address1').val('');
    $('#address2').val('');
    $('#city').val('');
    $('#postcode').val('');

    showHTML([$('#address-lookup-form')]);
    hideHTML([
        $('#address-lookup-found'),
        $('#found-address-edit')
    ]);
}

function showHTML(iterable) {
    for (const element of iterable) {
        element.show('slow');
        element.prop('readonly', false);
    }
}

function hideHTML(iterable) {
    for (const element of iterable) {
        element.hide('slow');
        element.prop('readonly', true);
    }
}

// ================ Google Maps ================ \\

// noinspection JSUnusedGlobalSymbols
function initMap() {

    geocoder = new google.maps.Geocoder();
    // let currentLocation = {lat: 53.381423, lng: -1.488378};
    //
    // geocoder.geocode({'address': userPostcode}, (results, status) => {
    //     if (status === google.maps.GeocoderStatus.OK) {
    //         const lat = results[0].geometry.location.lat();
    //         const lng = results[0].geometry.location.lng();
    //         currentLocation = {lat: lat, lng: lng};
    //     } else {
    //         //TODO: remove this
    //         alert("Geocode error: " + status);
    //     }
    // });
    //
    // const styles = [{
    //     "featureType": "poi.business",
    //     "stylers": [
    //         {"visibility": "off"}
    //     ]
    // }];
    //
    // const map = new google.maps.Map($('#new-map')[0], {
    //     zoom: 14,
    //     center: currentLocation,
    //     styles: styles,
    //     zoomControl: true,
    //     mapTypeControl: false,
    //     streetViewControl: false,
    //     fullscreenControl: true
    // });
    //
    // const userMarker = new google.maps.Marker({
    //     map: map,
    //     draggable: true,
    //     animation: google.maps.Animation.DROP,
    //     position: currentLocation
    // });
    //
    // google.maps.event.addListener(userMarker, 'dragend', () => {
    //     geocodePosition(userMarker.getPosition());
    // });
}

// function geocodePosition(pos) {
//     const geocoder = new google.maps.Geocoder();
//     geocoder.geocode({latLng: pos}, (results, status) => {
//             if (status === google.maps.GeocoderStatus.OK) {
//                 for (const component of results[0].address_components) {
//                     if (component.long_name) {
//                         switch (component.types[0]) {
//                             case 'postal_code':
//                                 $('#postcode').val(component.long_name);
//                                 break;
//                             // case n:
//                             //     code block
//                             //     break;
//                             // default:
//                             //     code block
//                         }
//                         // console.log(component.long_name);
//                         // console.log(component.types[0]);
//                     }
//                 }
//             } else {
//                 console.log('No valid address');
//             }
//         }
//     );
// }