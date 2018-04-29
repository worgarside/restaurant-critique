const editName = $('#edit-name');
const editEmail = $('#edit-email');
const editPostcode = $('#edit-postcode');
const editPassword = $('#edit-password');
const editImage = $('#edit-image');

editName.click(() => {
    $('.details-name').hide();
});

editEmail.click(() => {
    $('.details-email').hide();

    const formName = `
        <input type='text'/>
    `;

});

editPostcode.click(() => {
    $('.details-postcode').hide();
});

editPassword.click(() => {
    $('.details-password').hide();
});



console.log('Loaded user_management.js');