/**
 * layout.js
 * Client-side JS
 * @author Will Garside
 * @param {Boolean} userLoggedIn login flag passed from server
 */

$(() => {
    if (!userLoggedIn) {
        setLoginFormPosition();
    }
});

// ----------- Login Form ----------- \\


$('#btn-login').on('click', () => {
    $('#login-form').fadeToggle();
});

if (!userLoggedIn) {

    $(document)
        .mousedown((e) => {
            const form = $('#login-form');
            const btn = $('#btn-login');
            const loginWarning = $('#login-warning');

            // check mouse loc isn't form, button or descendant of form
            if (!form.is(e.target) && !btn.is(e.target) && !loginWarning.is(e.target) && form.has(e.target).length === 0) {
                form.fadeOut();
            }

        })
        .keydown((e) => {
            if (!userLoggedIn) {
                if (e.keyCode === 27) { // escape key maps to keycode `27`
                    $('#login-form').fadeOut();
                }
            }
        });
}

/**
 * Sets the location of the floating login form relative to the login button's location
 */
function setLoginFormPosition() {
    const form = $('#login-form');
    const btn = $('#btn-login');
    const btn_width = btn.outerWidth(true);
    const btn_left = btn.position()['left'];
    const btn_right = btn_left + btn_width;
    const form_width = form.outerWidth(true);

    const form_right = $(document).width() - (btn_right + ((form_width - btn_width) / 2));

    form.css({right: form_right});
}

console.log('Loaded layout.js');

// ================ Input Formatting ================ \\

/**
 * Automatically applies Title Case to inputs with the class '.title-case'
 * @function autoTitleCase
 */
$('.title-case').keyup(function () {
    const inputString = $(this).val().split(" ");
    for (let i = 0; i < inputString.length; i++) {
        const j = inputString[i].charAt(0).toUpperCase();
        inputString[i] = j + inputString[i].substr(1);
    }
    $(this).val(inputString.join(' '));
});

/**
 * Automatically changes input value to uppercase
 * @function autoCapitalise
 */
$('.upper-case').keyup(function () {
    $(this).val($(this).val().toUpperCase());
});