$(() => {
    setLoginFormPosition();
});

// ----------- Login Form ----------- \\

function setLoginFormPosition() {
    if (!userLoggedIn) {
        const form = $('#login-form');
        const btn = $('#btn-login');
        const btn_width = btn.outerWidth(true);
        const btn_left = btn.position()['left'];
        const btn_right = btn_left + btn_width;
        const form_width = form.outerWidth(true);

        const form_right = $(document).width() - (btn_right + ((form_width - btn_width) / 2));

        form.css({right: form_right});
    }
}

$('#btn-login').on('click', () => {
    $('#login-form').fadeToggle();
});

$(document).mouseup((e) => {
    if (!userLoggedIn) {
        const form = $('#login-form');
        const btn = $('#btn-login');

        // check mouse loc isn't form, button or descendant of form
        if (!form.is(e.target) && !btn.is(e.target) && form.has(e.target).length === 0) {
            form.fadeOut();
        }
    }
});

$(document).keydown((e) => {
    if (!userLoggedIn) {
        if (e.keyCode === 27) { // escape key maps to keycode `27`
            $('#login-form').fadeOut();
        }
    }
});

console.log('Loaded layout.js');
