$(function() {
    checkNavPos();
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
        $("#nav-logo-anim").stop().fadeIn();
    } else {
        $("#nav-logo-anim").stop().fadeOut();
        $("#first-nav-item").stop().animate({'margin-left': '0'});
    }
}

// if the image in the window of browser when scrolling the page, show that image
$(window).scroll(function () {
    checkNavPos();
});

console.log('Loaded index.js');
