const editName = $('#edit-name');
const editEmail = $('#edit-email');
const editPostcode = $('#edit-postcode');
const editPassword = $('#edit-password');
const editImage = $('#edit-image');

const detailsName = $('#details-name');
const detailsEmail = $('#details-email');
const detailsPostcode = $('#details-postcode');
const detailsPassword = $('#details-password');
const detailsImage = $('#details-image');

editName.click(() => {
    detailsName.find('.current').hide();
    detailsName.find('.new').show();
});

editEmail.click(() => {
    detailsEmail.hide();
});

editPostcode.click(() => {
    detailsPostcode.hide();
});

editPassword.click(() => {
    detailsPassword.hide();
});

console.log('Loaded user_management.js');