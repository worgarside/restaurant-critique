/**
 * signup.js
 * Client-side JS
 * @author Will Garside
 */

$('#display-picture').click(() => {
    $("#display-picture-upload").click();
});

/**
 * Shows a preview of the User's display image on the page after it is uploaded
 * @param {HTMLElement} imageInput The HTML element which allows image submission
 */
function previewImage(imageInput) {
    if (imageInput.files && imageInput.files[0]) {
        const imageURL = window.URL.createObjectURL(imageInput.files[0]);
        $('#display-picture').attr('src', imageURL);
    }
}

$('#display-picture-upload').change(function () {
    previewImage(this);
});

/**
 * Uses JS Validation to validate the User's form pre-submission
 * @function validateSignUpForm
 */
$('#signup-form').validate({
    rules: {
        password: {
            minlength: 8
        },
        'password-confirm': {
            minlength: 8,
            equalTo: "#password"
        }
    },
    messages: {
        'password-confirm': {
            equalTo: 'Passwords do not match'
        }
    }
});

console.log('Loaded signup.js');
