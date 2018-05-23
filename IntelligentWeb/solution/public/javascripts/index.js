/**
 * index.js
 * Client-side JS
 * @author Will Garside, Rufus Cope
 */

$(() => {
    checkNavPos();
});

// ----------- Logo ----------- \\

/**
 * Checks the vertical position of the NavBar for the mini logo animation
 */
function checkNavPos() {
    const elementOffset = $('.navbar').offset().top;
    const topOfWindow = $(window).scrollTop();
    const distance = (elementOffset - topOfWindow);
    const showLogo = distance < 1;

    if (showLogo) {
        $("#first-nav-item").stop().animate({'margin-left': '60px'});
        $("#nav-logo-anim").stop().fadeIn();
    } else {
        $("#nav-logo-anim").stop().fadeOut();
        $("#first-nav-item").stop().animate({'margin-left': '0'});
    }
}

$(window).scroll(() => {
    checkNavPos();
});

$("#search-button").click((e) => {
    e.preventDefault();
    sessionStorage.setItem('query', $('#search-input').val());
    window.location.replace('/search');
});

console.log('Loaded index.js');