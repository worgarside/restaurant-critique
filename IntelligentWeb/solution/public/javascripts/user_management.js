const editName = $('#edit-name');
const editEmail = $('#edit-email');
const editPostcode = $('#edit-postcode');
const editPassword = $('#edit-password');
const editImage = $('#edit-image');

const confirmName = $('#confirm-name');
const confirmEmail = $('#confirm-email');
const confirmPostcode = $('#confirm-postcode');
const confirmPassword = $('#confirm-password');
const confirmImage = $('#confirm-image');

const detailsName = $('#details-name');
const detailsEmail = $('#details-email');
const detailsPostcode = $('#details-postcode');
const detailsPassword = $('#details-password');
const detailsImage = $('#details-image');

const user = JSON.parse(userVar);

editName.click(() => {
    detailsName.find('.current').hide();
    detailsName.find('.new').css('display', 'flex');
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
            $('#name').text(`Name: ${newName.first} ${newName.last}`);
            detailsName.find('.new').hide();
            detailsName.find('.current').css('display', 'flex');
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
});

editEmail.click(() => {
    detailsEmail.find('.current').hide();
    detailsEmail.find('.new').css('display', 'flex');
});

confirmEmail.click(() => {
    detailsEmail.find('.current').css('display', 'flex');
    detailsEmail.find('.new').hide();
});

editPostcode.click(() => {
    detailsPostcode.find('.current').hide();
    detailsPostcode.find('.new').css('display', 'flex');
});

confirmPostcode.click(() => {
    detailsPostcode.find('.current').css('display', 'flex');
    detailsPostcode.find('.new').hide();
});

editPassword.click(() => {
    detailsPassword.find('.current').hide();
    detailsPassword.find('.new').css('display', 'flex');
});

confirmPassword.click(() => {
    detailsPassword.find('.current').css('display', 'flex');
    detailsPassword.find('.new').hide();
});

console.log('Loaded user_management.js');