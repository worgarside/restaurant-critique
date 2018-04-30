const editName = $('#edit-name');
const editPostcode = $('#edit-postcode');
const editPassword = $('#edit-password');
const editImage = $('#edit-image');

const confirmName = $('#confirm-name');
const confirmPostcode = $('#confirm-postcode');
const confirmPassword = $('#confirm-password');
const confirmImage = $('#confirm-image');

const cancelName = $('#cancel-name');
const cancelPostcode = $('#cancel-postcode');
const cancelPassword = $('#cancel-password');
const cancelImage = $('#cancel-image');

const detailsName = $('#details-name');
const detailsEmail = $('#details-email');
const detailsPostcode = $('#details-postcode');
const detailsPassword = $('#details-password');
const detailsImage = $('#details-image');

const user = JSON.parse(userVar);

// ================ Name ================ \\

editName.click(() => {
    detailsName.find('.current').hide();
    detailsName.find('.new').css('display', 'flex');
    cancelPostcode.click();
    cancelPassword.click();
    cancelImage.click();
});

confirmName.click(() => {
    const data = JSON.stringify(
        {
            _id: user._id,
            name: {
                first: $('#first').val(),
                last: $('#last').val()
            }
        }
    );

    $.ajax({
        url: '/user/update_name',
        data: data,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (newName) => {
            if (newName) {
                $('#name-p').text(`Name: ${newName.first} ${newName.last}`);
                detailsName.find('.new').hide();
                detailsName.find('.current').css('display', 'flex');
            } else {
                console.log('Unable to change postcode');
                // TODO: name change failure handling
            }
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
});

cancelName.click(() => {
    detailsName.find('.current').css('display', 'flex');
    detailsName.find('.new').hide();
});

// ================ Postcode ================ \\

editPostcode.click(() => {
    detailsPostcode.find('.current').hide();
    detailsPostcode.find('.new').css('display', 'flex');
    cancelName.click();
    cancelPassword.click();
    cancelImage.click();
});

confirmPostcode.click(() => {
    const data = JSON.stringify(
        {
            _id: user._id,
            postcode: $('#postcode').val()
        }
    );

    $.ajax({
        url: '/user/update_postcode',
        data: data,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (newPostcode) => {
            if (newPostcode) {
                $('#postcode-p').text(`Postcode: ${newPostcode}`);
                detailsPostcode.find('.current').css('display', 'flex');
                detailsPostcode.find('.new').hide();
            } else {
                console.log('Unable to change postcode');
                // TODO: postcode change failure handling
            }
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
});

cancelPostcode.click(() => {
    detailsPostcode.find('.current').css('display', 'flex');
    detailsPostcode.find('.new').hide();
});

// ================ Password ================ \\

editPassword.click(() => {
    detailsPassword.find('.current').hide();
    detailsPassword.find('.new').css('display', 'flex');
    cancelName.click();
    cancelPostcode.click();
    cancelImage.click();
});

jQuery.validator.addMethod("notEqual", function(value, element, param) {
    return this.optional(element) || value !==  $(param).val();
});

$('#change-password-form').validate({
    rules: {
        'new-password': {
            minlength: 8,
            notEqual: '#old-password'
        },
        'new-password-confirm': {
            minlength: 8,
            equalTo: "#new-password"
        }
    },
    messages: {
        'new-password': {
            notEqual: 'New password must be different'
        },
        'new-password-confirm': {
            equalTo: 'Passwords do not match'
        },
    }
});

confirmPassword.click(() => {
    const data = JSON.stringify(
        {
            _id: user._id,
            password: {
                old: $('#old-password').val(),
                new: $('#new-password').val(),
            }
        }
    );

    $.ajax({
        url: '/user/update_password',
        data: data,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (result) => {
            if (result === '0') {
                // Incorrect ol
                console.log('Incorrect old password');
                $('#incorrect-old-password').css('display', 'inline-block');
            } else if (result === '1') {
                console.log('Password success');
                $('#password-p').text('Password: Successfully changed');
                detailsPassword.find('.current').css('display', 'flex');
                detailsPassword.find('.new').hide();
            } else if (result === '2') {
                //unable to save doc
                console.log('Error updating db');
            }
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
});

cancelPassword.click(() => {
    detailsPassword.find('.current').css('display', 'flex');
    detailsPassword.find('.new').hide();
});

console.log('Loaded user_management.js');