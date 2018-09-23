/**
 * restaurant_edit.js
 * Client-side JS
 * @author Will Garside
 * @param {Array} categoryVar Array of categories passed from server
 */

let allCategories, prePickedCategories;
let formattedAddress = '';
let selectedCategories = [];

$(() => {
    allCategories = categoryVar;
    prePickedCategories = JSON.parse(restaurantCategories);

    for (const category of prePickedCategories) {
        selectCategory(category, false);
    }
    checkCategoryPicker();
    categorySelected.css('border-color', '#ced4da');
});

$('#new-restaurant-form').on('keyup keypress', function (e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
});

// ================================ Category Picker ================================ \\

/**
 * When a User clicks on a Category in the picker, it is selected and added to a list for submission
 * This function adds the selected Category to a hidden input, and move it to the selected box o the page
 * @param {String} category The selected Category's name
 * @param {Boolean} focus flag to set user focus on input after selecting category
 */
function selectCategory(category, focus = true) {
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

    focus && categoryPicker.focus();
}

// ================================ Image Upload ================================ \\

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
                            <span class="oi oi-image d-inline">
                                <img src='${newFile.url}'/>
                            </span>
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

console.log('Loaded restaurant_edit.js');