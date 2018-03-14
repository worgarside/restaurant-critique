console.log('Loaded signup.js');

$("#display-picture").click(function (e) {
    $("#display-picture-upload").click();
});

function fasterPreview(upload_form) {
    if (upload_form.files && upload_form.files[0]) {
        var img_url = window.URL.createObjectURL(upload_form.files[0]);
        $('#display-picture').attr('src', img_url);
    }
}

$("#display-picture-upload").change(function () {
    fasterPreview(this);
});
