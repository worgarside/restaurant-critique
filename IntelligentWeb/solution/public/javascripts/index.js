$(() => {
    checkNavPos();
});

// ----------- Logo ----------- \\

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

// if the image in the window of browser when scrolling the page, show that image
$(window).scroll(() => {
    checkNavPos();
});

$("#searchbutton").click((e) => {
    e.preventDefault();
    sessionStorage.setItem("query", $('#search-input').val());
    window.location.replace("/search");
});

console.log('Loaded index.js');