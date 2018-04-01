console.log('Loaded signup.js');


$('#display-picture').click(() => {
    $("#display-picture-upload").click();
});

function previewImage(imageInput) {
    if (imageInput.files && imageInput.files[0]) {
        const imageURL = window.URL.createObjectURL(imageInput.files[0]);
        $('#display-picture').attr('src', imageURL);
    }
}

$('#display-picture-upload').change(function () {
    previewImage(this);
});

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