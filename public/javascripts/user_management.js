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
const detailsPostcode = $('#details-postcode');
const detailsPassword = $('#details-password');
const detailsImage = $('#details-image');

const user = JSON.parse(userVar);
let imageURL = '';

// ================================ Button Alignment ================================ \\

$(window).resize(() => {
    if ($(window).width() < 1080) {
        $('.btn-group').addClass('btn-group-vertical');
    } else {
        $('.btn-group').removeClass('btn-group-vertical');
    }
});


// ================================ Name ================================ \\

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
                alert('Your name has been successfully updated');
            } else {
                alert('We are unable to change your name at this time. Please try again later.');
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

// ================================ Email ================================ \\

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

// ================================ Postcode ================================ \\

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
                alert('Your postcode has been successfully updated');
            } else {
                alert('We are unable to change your postcode at this time. Please try again later.');
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

// ================================ Password ================================ \\

editPassword.click(() => {
    detailsPassword.find('.current').hide();
    detailsPassword.find('.new').css('display', 'flex');
    cancelName.click();
    cancelPostcode.click();
    cancelImage.click();
});

jQuery.validator.addMethod('notEqual', function (value, element, param) {
    return this.optional(element) || value !== $(param).val();
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
                alert('Your password has been successfully updated');
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

// ================================ Image ================================ \\

$('#display-picture').click(() => {
    $("#display-picture-upload").click();
});

$('#display-picture-upload').change(function () {
    if (this.files && this.files[0]) {
        imageURL = window.URL.createObjectURL(this.files[0]);
        $('#display-picture').attr('src', imageURL);
    }
});

editImage.click(() => {
    detailsImage.find('.current').hide();
    detailsImage.find('.new').css('display', 'flex');
    cancelName.click();
    cancelPostcode.click();
    cancelPassword.click();
});

$('#change-image-form').submit(function () {
    $(this).ajaxSubmit({
        error: (err) => {
            alert('Unable to change your profile image at this time. Please try again later.');
            console.log(`AJAX Error: ${err.status}`);
        },
        success: () => {
            // Force a GET request by adding timestamp param to refresh the image source
            $('#user-profile-image').attr('src', `/images/userImages/${user.reducedID}?` + new Date().getTime());
            detailsImage.find('.current').css('display', 'flex');
            detailsImage.find('.new').hide();
            alert('Your profile picture has been successfully updated');
        }
    });

    return false; // Blocks the form's default behaviour
});

cancelImage.click(() => {
    detailsImage.find('.current').css('display', 'flex');
    detailsImage.find('.new').hide();
});

// ================================ Review Controls ================================ \\

$('.publish-restaurant').click(function () {
    const restaurantID = this.id.split('-').pop();
    if (confirm('Are you sure you want to publish this restaurant?')) {
        const data = JSON.stringify({restaurantID: restaurantID});

        $.ajax({
            url: '/user/publish_restaurant',
            data: data,
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            success: (result) => {
                if (result.success) {
                    alert('Restaurant published successfully!');
                } else {
                    alert('There has been an error. please try again later');
                }
                window.location.href = result.url;
            },
            error: (err) => {
                alert('There has been an error. please try again later');
                console.log(`Error: ${JSON.stringify(err)}`);
            }
        });
    }
});

$('.delete-restaurant').click(function () {
    const restaurantID = this.id.split('-').pop();
    if (confirm('Are you sure you want to delete this restaurant?')) {
        const data = JSON.stringify({restaurantID: restaurantID});

        $.ajax({
            url: '/user/delete_restaurant',
            data: data,
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            success: (result) => {
                if (result.success) {
                    alert('Restaurant deleted successfully!');
                    $(`#row-${restaurantID}`).hide();
                } else {
                    alert('There has been an error. please try again later');
                }
            },
            error: (err) => {
                alert('There has been an error. please try again later');
                console.log(`Error: ${JSON.stringify(err)}`);
            }
        });
    }
});

// ================================ Review Controls ================================ \\

$('.delete-review').click(function () {
    const reviewID = this.id.split('-').pop();
    if (confirm('Are you sure you want to delete your review?')) {
        const data = JSON.stringify({reviewID: reviewID});

        $.ajax({
            url: '/user/delete_review',
            data: data,
            contentType: 'application/json; charset=utf-8',
            type: 'POST',
            success: (result) => {
                if (result) {
                    $(`#row-${reviewID}`).hide();
                    alert('Review deleted successfully!');
                }
            },
            error: (err) => {
                alert('There has been an error. please try again later');
                console.log(`Error: ${JSON.stringify(err)}`);
            }
        });
    }
});

console.log('Loaded user_management.js');

