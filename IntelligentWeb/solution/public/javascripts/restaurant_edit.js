/**
 * restaurant_edit.js
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

    allCategories = categoryVar;
    prePickedCategories = JSON.parse(restaurantCategories);

    for (const category of prePickedCategories) {
        selectCategory(category);
    }
});

$('#new-restaurant-form').on('keyup keypress', function (e) {
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
            const dayInput = $('#days-of-week');
            // noinspection JSValidateTypes
            const dayString = dayInput.children('option').filter(':selected').text();
            const dayValue = dayInput.val();
            const selectedTimes = $("#selected-opening-times");

            const newHTML = `
                <div class='form-row' id='selected-day-${dayString}'>
                    <div class='col-3 text-center'>
                        <p class='mb-2'>${dayString}</p>
                    </div>
                    <div class='col-6 text-center'>
                        <p class='mb-2'>${openTimeString} - ${closeTimeString} </p>
                    </div>
                    <div class='col-3 text-center'>
                        <a onclick='removeSelectedDay(this);' href='javascript:void(0);' id=${dayString} style='padding:4px'>Remove</a> 
                    </div>
               </div>
            `;

            dayInput.find(`option[value=${dayValue}]`).remove();
            $('#selected-times-row').prop({hidden: false});
            // noinspection JSValidateTypes
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

let allCategories, prePickedCategories;
let formattedAddress = '';
let selectedCategories = [];

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

    for (const category of allCategories) {
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

    allCategories.push(category);
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

// ================ Create Restaurant ================ \\

const imageInput = $('#image-upload');
const imageList = $('#uploaded-images');
const imageClicker = $('#image-upload-link');
const fileCountInput = $('#file-count');

imageClicker.click(() => {
    imageInput.click();
});

imageInput.change(function () {
    imageList.empty();
    imageList.append('<hr/>');
    for (let i = 0; i < this.files.length; i++) {
        let newFile = {
            name: this.files[i].name,
            url: window.URL.createObjectURL(this.files[i])
        };

        imageList.append(`
            <div class="row">
              <div class="col-10">
                <div class="vert-center-parent">
                  <div class="vert-center-child">
                    <p class="mb-0">${newFile.name}</p>
                  </div>
                </div>
              </div>
              <div class="col-2">
                <div class="vert-center-parent">
                  <div class="vert-center-child"><span class="oi oi-image d-inline"><img src='${newFile.url}'/></span></div>
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

// ================ Create Restaurant ================ \\

/**
 * Submits the Restaurant immediately after setting the verification and publish flag to False on button click
 * @function saveRestaurant
 */
$('#save-restaurant').click(() => {
    $('#verified-flag').prop('checked', false);
    $('#publish-flag').prop('checked', false);
    $('#restaurant-id').val(restaurantId);
    $('#existing-restaurant-images').val(restaurantImages);
    $('#submit').click();

});

/**
 * Submits the Restaurant immediately after setting the verification and publish flag to True on button click
 * @function publishRestaurant
 */
$('#publish-restaurant').click(() => {
    $('#verified-flag').prop('checked', true);
    $('#publish-flag').prop('checked', true);
    $('#restaurant-id').val(restaurantId);
    $('#existing-restaurant-images').val(restaurantImages);
    $('#submit').click();
});

$('#verify-email').click(() => {
    $.ajax({
        url: '/verify_email',
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (response) => {
            if (response) {
                alert('Verification email sent, it should arrive within the next 24 hours. If not, please check your spam folder or contact us.');
            } else {
                alert('Sorry, we are unable to process your request at this time. PLease try again later.');
            }
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
});

console.log('Loaded restaurant_edit.js');
