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

console.log('Loaded layout.js');
