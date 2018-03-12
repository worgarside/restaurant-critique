$(document).ready(function () {
    setLoginFormPosition();
    checkNavPos();
});



// ----------- Login Form ----------- \\

function setLoginFormPosition(){
    var form = $('#login-form');
    var btn = $('#btn-login');
    var btn_width = btn.outerWidth(true);
    var btn_left = btn.position()['left'];
    var btn_right = btn_left + btn_width;
    var form_width = form.outerWidth(true);

    var form_right = $(document).width() - (btn_right + ((form_width - btn_width) / 2));

    form.css({right: form_right});
}

$('#btn-login').on('click', function () {
    $('#login-form').fadeToggle();
});

$(document).mouseup(function (e) {
    var form = $('#login-form');
    var btn = $('#btn-login');

    // check mouse loc isn't form, button or descendant of form
    if (!form.is(e.target) && !btn.is(e.target) && form.has(e.target).length === 0) {
        form.fadeOut();
    }
});

$(document).keydown(function (e) {
    if (e.keyCode === 27) { // escape key maps to keycode `27`
        $('#login-form').fadeOut();
    }
});

// ----------- Logo ----------- \\

function checkNavPos() {
    var elementOffset = $('.navbar').offset().top;
    var topOfWindow = $(window).scrollTop();
    var distance = (elementOffset - topOfWindow);
    var showLogo;

    showLogo = distance < 1;

    if (showLogo) {
        $("#first-nav-item").stop().animate({'margin-left': '60px'});
        $("#nav-logo").stop().fadeIn();
    } else {
        $("#nav-logo").stop().fadeOut();
        $("#first-nav-item").stop().animate({'margin-left': '0'});
    }
}


// if the image in the window of browser when scrolling the page, show that image
$(window).scroll(function () {
    checkNavPos();
});


console.log('Loaded layout.js');
