/**
 * search.js
 * Client-side JS
 * @author Rufus Cope, Will Garside
 */

let matchedRestaurants = [];
let selectedCategories = [];
let selectedFeatures = [];

const advancedSearchDiv = $('#advanced-search-collapsible');
const searchInput = $('#search-input');
const searchButton = $("#search-button");
const ratingSlider = $('#rating-slider');
const ratingSliderValue = $('#rating-slider-value');
const distanceSlider = $('#distance-slider');
const distanceSliderValue = $('#distance-slider-value');
const priceRangeSlider = $('#price-range-slider');
const priceRangeSliderValue = $('#price-range-slider-value');
const priceRanges = ['Inexpensive', 'Medium', 'Above Average', 'Premium'];
const catNoneCheckbox = $('#cat-check-none');
const catAllCheckbox = $('#cat-check-all');
const featureNoneCheckbox = $('#feature-check-none');
const featureAllCheckbox = $('#feature-check-all');

searchButton.click((e) => {
    e.preventDefault();
    search(searchInput.val());
});

$(() => {
    const query = sessionStorage.getItem('query');
    if (query) {
        search(query);
        searchInput.val(query);
        sessionStorage.removeItem('query');
    }

    // for (const category of categories) {
    //     selectedCategories.push(category);
    // }
});

/**
 * Sends an AJAX POST request to the server to get the User's search results
 * @param {String} query The User's search query
 * @see routes/search.js
 */
function search(query) {
    const searchQueryData = JSON.stringify({searchQueryData: query});
    $.ajax({
        url: '/search',
        data: searchQueryData,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (restaurants) => {
            matchedRestaurants = restaurants;
            displaySearchResults();
            updateDisplayedRestaurants();
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
}

ratingSlider.on('input', () => {
    ratingSliderValue.text((ratingSlider.val() / 10).toString().padEnd(3, '.0'));
    updateDisplayedRestaurants();
});

distanceSlider.on('input', () => {
    distanceSliderValue.text(`${distanceSlider.val()}km`);
    updateDisplayedRestaurants();
});

priceRangeSlider.on('input', () => {
    priceRangeSliderValue.text(priceRanges[priceRangeSlider.val()]);
    updateDisplayedRestaurants();
});

// TODO jsdoc
advancedSearchDiv.find('#categories input[type=checkbox]').change(function () {
    if ((this.id !== 'cat-check-all') && (this.id !== 'cat-check-none')) {
        if (this.checked) {
            const categoryIndex = categories.map((cat) => {
                return cat._id;
            }).indexOf(this.id);
            const objectFound = categories[categoryIndex];
            selectedCategories.push(objectFound);
        } else {
            for (let i = 0; i < selectedCategories.length; i++) {
                if (selectedCategories[i]._id === this.id) {
                    selectedCategories.splice(i, 1);
                }
            }
        }

        if (selectedCategories.length === 0) {
            catNoneCheckbox.prop('checked', true);
            catAllCheckbox.prop('checked', false);
        } else if (selectedCategories.length === categories.length) {
            catNoneCheckbox.prop('checked', false);
            catAllCheckbox.prop('checked', true);
        } else {
            catNoneCheckbox.prop('checked', false);
            catAllCheckbox.prop('checked', false);
        }
    } else if (this.id === 'cat-check-all') {
        selectedCategories = [];
        for (const category of categories) {
            $(`#${category._id}`).prop('checked', true);
            const categoryIndex = categories.map((cat) => {
                return cat._id;
            }).indexOf(category._id);
            const objectFound = categories[categoryIndex];
            selectedCategories.push(objectFound);
        }
        catNoneCheckbox.prop('checked', false);
    } else if (this.id === 'cat-check-none') {
        for (const category of categories) {
            $(`#${category._id}`).prop('checked', false);
        }
        selectedCategories = [];
        catAllCheckbox.prop('checked', false);
    }
    updateDisplayedRestaurants();
});

// TODO jsdoc
advancedSearchDiv.find('#features input[type=checkbox]').change(function () {
    if ((this.id !== 'feature-check-all') && (this.id !== 'feature-check-none')) {
        if (this.checked) {
            const featureIndex = features.map((feature) => {
                return feature.id;
            }).indexOf(this.id);
            const objectFound = features[featureIndex];
            selectedFeatures.push(objectFound);
        } else {
            for (let i = 0; i < selectedFeatures.length; i++) {
                if (selectedFeatures[i].id === this.id) {
                    selectedFeatures.splice(i, 1);
                }
            }
        }

        if (selectedFeatures.length === 0) {
            featureNoneCheckbox.prop('checked', true);
            featureAllCheckbox.prop('checked', false);
        } else if (selectedFeatures.length === features.length) {
            featureNoneCheckbox.prop('checked', false);
            featureAllCheckbox.prop('checked', true);
        } else {
            featureNoneCheckbox.prop('checked', false);
            featureAllCheckbox.prop('checked', false);
        }
    } else if (this.id === 'feature-check-all') {
        selectedFeatures = [];
        for (const feature of features) {
            $(`#${feature.id}`).prop('checked', true);
            const featureIndex = features.map((feature) => {
                return feature.id;
            }).indexOf(feature.id);
            const objectFound = features[featureIndex];
            selectedFeatures.push(objectFound);
        }
        featureNoneCheckbox.prop('checked', false);
    } else if (this.id === 'feature-check-none') {
        for (const feature of features) {
            $(`#${feature.id}`).prop('checked', false);
        }
        selectedFeatures = [];
        featureAllCheckbox.prop('checked', false);
    }
    updateDisplayedRestaurants();
});

// ================================ Results HTML Management ================================ \\

// TODO jsdoc
function updateDisplayedRestaurants() {
    for (const [index, restaurant] of matchedRestaurants.entries()) {

        let categoryMatch = true;
        if (!catNoneCheckbox.is(':checked')) {
            for (const category of selectedCategories) {
                for (const restaurantCategory of restaurant.categories) {
                    categoryMatch = (category._id === restaurantCategory._id);
                    if (categoryMatch) {
                        // selected category has been found in restaurant, so move on to next selected category
                        break;
                    }
                }
                if (!categoryMatch) {
                    // selected category hasn't been found, so break the loop and the restaurant will be hidden
                    break;
                }
            }
        }

        let featureMatch = true;
        if (!featureNoneCheckbox.is(':checked')) {
            for (const feature of selectedFeatures) {
                featureMatch = (restaurant.features[feature.id].value);
                if (!featureMatch) {
                    break;
                }
            }
        }

        // noinspection EqualityComparisonWithCoercionJS
        if (
            ( // no average rating, so only display when rating slider is 0 || rating is greater than the slider value
                (!restaurant.averageRating && ratingSlider.val() == 0) ||
                (restaurant.averageRating >= ratingSlider.val() / 10)
            ) &&
            (restaurant.priceRange.band <= priceRangeSlider.val()) &&
            categoryMatch &&
            featureMatch
        ) {
            $(`#restaurant-container-${index}`).css('display', 'block');
        } else {
            // noinspection EqualityComparisonWithCoercionJS
            console.log(`Hiding ${restaurant.name}: ${(!restaurant.averageRating && ratingSlider.val() == 0) || (restaurant.averageRating >= ratingSlider.val() / 10)} + ${restaurant.priceRange.band <= priceRangeSlider.val()} + ${categoryMatch} + ${featureMatch}`);
            $(`#restaurant-container-${index}`).css('display', 'none');
        }
    }
}

/**
 * Displays the list of search results on the page
 */
function displaySearchResults() {
    const restaurantListDOM = $('#restaurant-list')[0];
    restaurantListDOM.innerHTML = null;

    if (matchedRestaurants.length > 0) {
        console.log(`${matchedRestaurants.length} matched`);
        for (const [index, restaurant] of matchedRestaurants.entries()) {
            let restaurantContainer = document.createElement('div');
            restaurantContainer.innerHTML = getRestaurantDiv(restaurant, index);
            restaurantListDOM.appendChild(restaurantContainer);
            initSlideshow(index);
        }
    } else {
        let restaurantContainer = document.createElement('div');
        restaurantContainer.innerHTML = displayNoResultsFound();
        restaurantListDOM.appendChild(restaurantContainer);
    }
}

/**
 * Dynamically creates a Restaurant preview 'card' to add to the page from the Restaurant info
 * It checks each of the relevant Restaurant attributes and uses them to fill out a HTML template
 * @param {Restaurant} restaurant The Restaurant being previewed
 * @param {Number} index The number the Restaurant is on the page, used for setting button IDs
 * @returns {string} The generated HTML to be appended to the page
 * @author Will Garside
 */
function getRestaurantDiv(restaurant, index) {
    const htmlStart = `
        <div class="container nearby-restaurant" id="restaurant-container-${index}">
            <div class="row">
                <div class="col-12 col-lg-8">
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
            htmlStars += `<span aria-hidden="true" class="oi oi-star star-highlight"></span>`;
        }

        for (let i = 0; i < (5 - starRating); i++) {
            htmlStars += `<span aria-hidden="true" class="oi oi-star"></span>`;
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
            <div class="col">
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
            <div class="col-12 col-lg-4">
                        <div class="row">
                            <div class="col">
                                <div class="restaurant-nearby-images">
                                    <div class="slideshow-wrapper">
        `;

    let imageCount = 0;

    if (restaurant.images.length > 0) {
        htmlSlideshow += '<div class="slideshow">';
        for (const image of restaurant.images) {
            htmlSlideshow += `<img src="images/restaurants/${restaurant._id}/${image}" class="slide-${index}"/>`;
            imageCount += 1;
            if (imageCount >= 3) {
                // only show first 3 images
                break;
            }
        }
        htmlSlideshow += "</div>";
    }

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

    const htmlEnd = `</div></div></div></div></div></div>`;
    return htmlStart + htmlStars + htmlAddress + htmlCategories + htmlDescription + htmlSlideshow + htmlEnd;
}

/**
 * Image slideshow navigation using buttons on page
 * JQuery selectors have to be re-used due to the changing classes of the images
 * @param {Number} value The index value of the slideshow, so multiple ones can be on the page simultaneously without controls
 * getting mixed up
 * @author Will Garside
 */
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

/**
 * Displays a 'No results found' message to the User
 * @returns {string} HTML to show no results were found
 */
function displayNoResultsFound() {
    // TODO add a restaurant here
    return `
        <div class="row">
                <div class="col">
                    <h2> No results found, please search again</h2>
                </div>
        </div> `;
}

console.log('Loaded search.js');