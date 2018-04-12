function displaySearchResults(results) {
    const restaurantListDOM = $('#restaurant-list')[0];
    restaurantListDOM.innerHTML = null;

    if (results.length > 0) {
        console.log(results.length);
        for (const [index, restaurant] of results.entries()) {
            let restaurantContainer = document.createElement('div');
            console.log(restaurant.name);
            restaurantContainer.innerHTML = getRestaurantDiv(restaurant, index);
            restaurantListDOM.appendChild(restaurantContainer);
            initSlideshow(index);
        }
    } else {
        let restaurantContainer = document.createElement('div');
        restaurantContainer.innerHTML = displayNoResultsFound();
        restaurantListDOM.appendChild(restaurantContainer);
    }

    console.log('HTML Updated');
}

function displayNoResultsFound(){
    return `
        <div class="row">
                <div class="col">
                    <h2> No Results Found, Please Search Again</h2>
                </div>
        </div> `;
}

function getRestaurantDiv(restaurant, index) {
    console.log(`Getting restaurant ${restaurant.name} info @ index ${index}...`);
    console.log(restaurant);
    const htmlStart = `
        <div class="container nearby-restaurant" id="restaurant-container-${index}">
            <div class="row">
                <div class="col-8">
                    <div class="vert-center-parent">
                        <div class="vert-center-child">
                            <div class="row">
                               <div class="col"><a href='restaurant/${restaurant.localUrl}' class="restaurant-title d-inline">${restaurant.name}</a>
    `;

    let htmlStars = '';

    if (restaurant.averageRating) {
        const starRating = Math.round(restaurant.averageRating);

        htmlStars = `
            <div class="restaurant-stars">
        `;

        for (let i = 0; i < starRating; i++) {
            htmlStars += `<span aria-hidden="true" style="color: #e69200;" class="oi oi-check oi-star"></span>`;
        }

        for (let i = 0; i < (5 - starRating); i++) {
            htmlStars += `<span aria-hidden="true" class="oi oi-check oi-star"></span>`;
        }

        htmlStars += `</div>`;
    }

    const htmlAddress = `
          </div>
      </div>
      <div class="row">
          <div class="col">
              <p class="restaurant-address">${restaurant.address.formattedAddress}</p>
          </div>
      </div>
    `;

    let htmlCategories = `
        <div class="row">
            <div style="margin: -5px" class="col">
    `;

    if (restaurant.categories.length > 0) {
        for (const category of restaurant.categories) {
            htmlCategories += `<p class="restaurant-category">${category.name}</p>`;
        }
    }

    htmlCategories += `     
            </div>
        </div>
    `;

    let htmlDescription = '';

    if (restaurant.description !== 'No description currently available.') {
        htmlDescription = `
            <div class="row">
                <div class="col">
                    <p class="restaurant-description">${restaurant.description}</p>
                </div>
            </div>
        `;
    }

    let htmlSlideshow = `
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="vert-center-parent">
                    <div class="vert-center-child">
                    <div class="row">
                        <div class="col">
                            <div class="float-right">
                                <div class="slideshow-wrapper">
                                    <div class="slideshow">
        `;

    let imageCount = 0;

    if (restaurant.images.length > 0) {
        for (const image of restaurant.images) {
            htmlSlideshow += `<img src="images/restaurants/${restaurant._id}/${image}" class="slide-${index}"/>`;
            imageCount += 1;
        }
    }

    htmlSlideshow += "</div>";

    if (imageCount > 1) {
        htmlSlideshow += `
                <div id="button-prev-${index}" class="slideshow-prev">
                    <span aria-hidden="true" class="oi oi-check oi-chevron-left"></span>
                </div>
                <div id="button-next-${index}" class="slideshow-next">
                    <span aria-hidden="true" class="oi oi-check oi-chevron-right"></span>
                </div>
        `;
    }

    htmlSlideshow += "</div>";

    const htmlEnd = `</div></div></div></div></div></div></div></div>`;

    return htmlStart + htmlStars + htmlAddress + htmlCategories + htmlDescription + htmlSlideshow + htmlEnd;
}

function initSlideshow(value) {
    const btnNext = $(`#button-next-${value}`);
    const btnPrev = $(`#button-prev-${value}`);

    $(`.slide-${value}`).first().addClass(`current-${value}`);
    $(`.slide-${value}`).hide();
    $(`.current-${value}`).show();

    // noinspection JSJQueryEfficiency
    btnNext.click(() => {
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        if ($(`.previous-${value}`).is(':last-child')) {
            $(`.slide-${value}`).first().addClass(`current-${value}`);
        }
        else {
            $(`.previous-${value}`).next().addClass(`current-${value}`);
        }
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        $(`.slide-${value}`).fadeOut();
        $(`.current-${value}`).fadeIn();
    });

    btnPrev.click(() => {
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        if ($(`.previous-${value}`).is(':first-child')) {
            $(`.slide-${value}`).last().addClass(`current-${value}`);
        }
        else {
            $(`.previous-${value}`).prev().addClass(`current-${value}`);
        }
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        $(`.slide-${value}`).fadeOut();
        $(`.current-${value}`).fadeIn();
    });
}


$(function() {
    const query = sessionStorage.getItem("query");
    if (query!= null ){
        search(query);
        $('#search-input').val(query);
        sessionStorage.removeItem("query");
}});

function search(query){
    const searchQueryData = JSON.stringify({searchQueryData: query});
    $.ajax({
        url: '/search',
        data: searchQueryData,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (result) => {
            console.log('AJAX Succeeded');
            displaySearchResults(result)

        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
}



$("#searchbutton").click((e) => {
    e.preventDefault();
    console.log($('#search-input').val());
    const query = $('#search-input').val();
    search(query);
});