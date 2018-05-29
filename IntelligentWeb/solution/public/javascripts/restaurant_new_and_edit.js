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
});

// ================================ Opening Times ================================ \\

const addTimesBtn = $('#add-times');

// Forces time input to resolve prior to submission
addTimesBtn.mouseenter(() => {
    $('#opening-time').blur();
    $('#closing-time').blur();
});

/**
 * Displays the selected opening hours on the page when the User clicks the 'Add Times' button
 * Appends a form-row with html to display times and 'remove' button
 * Also updates the values of hidden inputs for submission to the server
 * @function addTimes
 */
addTimesBtn.click(function () {
    const openTimeString = $("#opening-time").val();
    const closeTimeString = $("#closing-time").val();

    if ((openTimeString !== "") && (closeTimeString !== "")) {
        const openTimeInt = (openTimeString.split(':')[0] * 60) + parseInt(openTimeString.split(':')[1]);
        const closeTimeInt = (closeTimeString.split(':')[0] * 60) + parseInt(closeTimeString.split(':')[1]);

        if (openTimeInt < closeTimeInt) {
            const dayInput = $('#days-of-week');
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
            console.log('Invalid time choice');
        }
    } else {
        console.log('Empty time(s)');
    }
});

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

// ================================ Category Picker ================================ \\

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

// ================================ Helper Functions ================================ \\

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

console.log('Loaded restaurant_new_and_edit.js');