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

$("#searchbutton").click(function(e) {
    $.ajax({
        url: '/search',
        data: text_query,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (result) => {
            console.log('AJAX Succeeded');
            processData(result);
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
}

console.log('Loaded index.js');
