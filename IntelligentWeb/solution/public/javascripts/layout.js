/**
 * layout.js
 * Client-side JS
 * @author Will Garside
 * @param {Boolean} userLoggedIn login flag passed from server
 */

$(() => {
    if (!userLoggedIn) {
        setLoginFormPosition();
        console.log('No user logged in');
    } else {
        const user = JSON.parse(layoutUser);
        console.log(`${user.name.first} ${user.name.last} (${user._id}) logged in`);
    }
});

// ================================ Login Form ================================ \\

const loginForm = $('#login-form');
const loginBtn = $('#btn-login');
const loginWarning = $('#login-warning');

loginBtn.on('click', () => {
    $('#login-form').fadeToggle();
});

if (!userLoggedIn) {
    $(document)
        .mousedown((e) => {
            // check mouse loc isn't form, button or descendant of form
            if (!loginForm.is(e.target) && !loginBtn.is(e.target) && !loginWarning.is(e.target) && loginForm.has(e.target).length === 0) {
                loginForm.fadeOut();
            }
        })
        .keydown((e) => {
            if (!userLoggedIn) {
                if (e.keyCode === 27) { // escape key maps to keycode `27`
                    loginForm.fadeOut();
                }
            }
        });

    $(window).scroll(() => {
        loginForm.fadeOut();
    });
}

/**
 * Sets the location of the floating login form relative to the login button's location
 */
function setLoginFormPosition() {
    const btn_width = loginBtn.outerWidth(true);
    const btn_left = loginBtn.position()['left'];
    const btn_right = btn_left + btn_width;
    const form_width = loginForm.outerWidth(true);

    const form_right = $(document).width() - (btn_right + ((form_width - btn_width) / 2));

    loginForm.css({right: form_right});
}

// ================================ Input Formatting ================================ \\

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

// ================================ Hamburger Menu ================================ \\

const burgerButton = $('#burger-btn');
const burgerLinks = $('#burger-links');
const burgerLoginLink = $('#burger-login-link');
const burgerLoginForm = $('#burger-login');

burgerButton.click(() => {
    burgerButton.toggleClass('active');
});

burgerButton.find(burgerLinks).click((e) => {
    e.stopPropagation();
});

burgerLoginLink.click(() => {
    burgerLoginForm.toggle(200);
});

console.log('Loaded layout.js');

const navbarSearchBtn = $('#navbar-search-button');
const navbarSearchInput = $('#navbar-search-input');
navbarSearchBtn.click(() => {
    if (!navbarSearchInput.hasClass('active')) {
        navbarSearchInput.addClass('active');
        navbarSearchBtn.addClass('active');
    } else {
        sessionStorage.setItem('query', $('#navbar-search-input').val());
        window.location.replace('/search');
    }
});

navbarSearchInput.keypress((e) => {
    if (e.which === 13) {
        sessionStorage.setItem('query', $('#navbar-search-input').val());
        window.location.replace('/search');
    }
});

