/**
 * search.js
 * Client-side JS
 * @author Rufus Cope, Will Garside
 */

let pageCount = 0;
let queryMatches = [];
let selectedCategories = [];
let selectedFeatures = [];
let displayFlags = [];
let resultSortField = $('#sort-by');
let resultSortOrder = $('#sort-order');
let currentPage = 1;
const searchResultsDiv = $('#search-results')[0];
const paginationLinksDiv = $('#pagination-links')[0];
const advancedSearchDiv = $('#advanced-search-collapsible');
const searchResultsHeader = $('#search-results-header');
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

const notFoundRestaurantHTML = `
            <div class='row'>
                <div class='col offset-1'>
                    <small>If you have not found the restaurant you are searching for, click <a href='/restaurant/new'>here</a> to add it to the site.</small>
                </div>
            </div>
        `;
const noResultsHTML = `
            <div class='row'>
                <div class='col-10 offset-1'>
                    <h4> No results found, please search again</h4>
                    <p>If you would like to add a new restaurant to the site, click <a href='/restaurant/new'>here</a>.</p>
                </div>
            </div>
        `;

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
    const catID = sessionStorage.getItem('catID');
    if (catID) {
        $(`#${catID}`).click();
        sessionStorage.removeItem('catID');
    }
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
            queryMatches = restaurants;
            displayFlags = Array(queryMatches.length).fill(true);
            updateDisplayFlags();
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
}

ratingSlider.on('input', () => {
    ratingSliderValue.text((ratingSlider.val() / 10).toString().padEnd(3, '.0'));
    updateDisplayFlags();
});

distanceSlider.on('input', () => {
    distanceSliderValue.text(`${distanceSlider.val()}km`);
    updateDisplayFlags();
});

priceRangeSlider.on('input', () => {
    priceRangeSliderValue.text(priceRanges[priceRangeSlider.val()]);
    updateDisplayFlags();
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
    updateDisplayFlags();
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
    updateDisplayFlags();
});

resultSortField.change(() => {
    sortResults();
});

resultSortOrder.change(() => {
    sortResults();
});

// TODO jsdoc
function sortResults() {
    switch (resultSortOrder.find("option:selected").attr('value')) {
        case 'descending':
            switch (resultSortField.find("option:selected").attr('value')) {
                case 'name':
                    queryMatches.sort((a, b) => {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        return 0;
                    });
                    break;
                case 'rating':
                    queryMatches.sort((a, b) => {
                        return b.averageRating - a.averageRating;
                    });
                    break;
                case 'relevance':
                    queryMatches.sort((a, b) => {
                        return b.weight - a.weight;
                    });
                    break;
            }
            break;
        case 'ascending':
            switch (resultSortField.find("option:selected").attr('value')) {
                case 'name':
                    queryMatches.sort((a, b) => {
                        if (a.name < b.name) return 1;
                        if (a.name > b.name) return -1;
                        return 0;
                    });
                    break;
                case 'rating':
                    queryMatches.sort((a, b) => {
                        return a.averageRating - b.averageRating;
                    });
                    break;
                case 'relevance':
                    queryMatches.sort((a, b) => {
                        return a.weight - b.weight;
                    });
                    break;
            }
            break;
    }
    $('#page-link-1').find('a.page-link').click();
    displaySearchResults();
}

// ================================ Results HTML Management ================================ \\

// TODO jsdoc
function updateDisplayFlags() {
    for (const [index, restaurant] of queryMatches.entries()) {
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
        displayFlags[index] = (
            (restaurant.averageRating >= ratingSlider.val() / 10) &&
            (restaurant.priceRange.band <= priceRangeSlider.val()) &&
            categoryMatch &&
            featureMatch);
    }
    displaySearchResults();
}

/**
 * Displays the list of search results on the page
 */
function displaySearchResults() {
    searchResultsDiv.innerHTML = null;
    let searchResultsHTML = '';
    const pageLength = 4;
    let displayCount = 0;
    pageCount = 0;

    if (queryMatches.length > 0) {
        searchResultsHeader.css('display', 'block');
        for (const [index, restaurant] of queryMatches.entries()) {
            if (displayFlags[index]) {
                if (displayCount % pageLength === 0) {
                    if (pageCount === 0) {
                        searchResultsHTML += `
                       <div class='search-results-page' id='search-results-page-${pageCount + 1}'>
                   `;
                    } else {
                        // hide other pages
                        searchResultsHTML += `
                           <div class='search-results-page' id='search-results-page-${pageCount + 1}' style='display: none;'>
                       `;
                    }
                    pageCount++;
                }

                searchResultsHTML += getRestaurantDiv(restaurant, index);

                if ((displayCount + 1) % pageLength === 0) {
                    searchResultsHTML += '</div>';
                }
                displayCount++;
            }

            // If the page hasn't already been ended, end it here
            if (((displayCount + 1) % pageLength !== 0) && (index === queryMatches.length)) {
                searchResultsHTML += '</div>';
            }
        }
        searchResultsHTML += notFoundRestaurantHTML;

        searchResultsHeader.find('h4').text(`Search Results - ${displayCount} found`);

        createPaginationLinks();
    } else {
        searchResultsHeader.css('display', 'none');
        searchResultsHTML = noResultsHTML;
    }

    let searchResultContent = document.createElement('div');
    searchResultContent.innerHTML = searchResultsHTML;
    searchResultsDiv.appendChild(searchResultContent);

    // JS functionality must be added AFTER the content is added to the page
    for (let i = 0; i < queryMatches.length; i++) {
        initSlideshow(i);
    }
    updateJQueryClickables();
}

function createPaginationLinks() {
    paginationLinksDiv.innerHTML = null;
    let paginationHTML = '';

    if (pageCount > 1) {
        paginationHTML = `
            <nav>
                <ul class='pagination justify-content-center'>
                    <li class='page-item disabled' id='page-link-prev'><a href='javascript:void(0)' class='page-link'><span class='oi oi-caret-left'></span></a></li>
        `;

        for (let p = 1; p < pageCount + 1; p++) {
            paginationHTML += `<li class='page-item' id='page-link-${p}'><a href='javascript:void(0)' class='page-link'>${p}</a></li>`;
        }

        paginationHTML += `
                    <li class='page-item' id='page-link-next'><a href='javascript:void(0)' class='page-link'><span class='oi oi-caret-right'></span></a></li>
                </ul>
            </nav>
        `;
    }

    let paginationDivContent = document.createElement('div');
    paginationDivContent.innerHTML = paginationHTML;
    paginationLinksDiv.appendChild(paginationDivContent);

    $(`#page-link-${currentPage}`).addClass('active');

    $('.page-link').click(function () {
        let page = $(this).parent().attr('id').split('-').pop();

        let currentPageLink = $(`#page-link-${currentPage}`);
        let newPageLink = $(`#page-link-${page}`);
        let currentPageDiv = $(`#search-results-page-${currentPage}`);
        let newPageDiv = $(`#search-results-page-${page}`);

        switch (page) {
            case 'prev':
                currentPageLink.removeClass('active');
                $(`#page-link-${currentPage - 1}`).addClass('active');
                currentPageDiv.css('display', 'none');
                $(`#search-results-page-${currentPage - 1}`).css('display', 'block');
                currentPage -= 1;
                break;
            case 'next':
                currentPageLink.removeClass('active');
                $(`#page-link-${currentPage + 1}`).addClass('active');
                currentPageDiv.css('display', 'none');
                $(`#search-results-page-${currentPage + 1}`).css('display', 'block');
                currentPage += 1;
                break;
            default:
                currentPageLink.removeClass('active');
                newPageLink.addClass('active');
                currentPageDiv.css('display', 'none');
                newPageDiv.css('display', 'block');
                currentPage = parseInt(page);
                break;
        }

        if (currentPage === 1) {
            $('#page-link-prev').addClass('disabled');
            $('#page-link-next').removeClass('disabled');
        } else if (currentPage === pageCount) {
            $('#page-link-prev').removeClass('disabled');
            $('#page-link-next').addClass('disabled');
        } else {
            $('#page-link-prev').removeClass('disabled');
            $('#page-link-next').removeClass('disabled');
        }
    });
    console.log('Created pagination links');
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
        <div class='container restaurant-card' id='restaurant-container-${index}'>
            <div class='row'>
                <div class='col-12 col-lg-8'>
                    <div class='vert-center-parent'>
                        <div class='vert-center-child'>
                            <div class='row'>
                               <div class='col'><a href='restaurant/${restaurant.localUrl}' class='restaurant-title d-inline'>${restaurant.name}</a>
    `;

    let htmlStars = '';

    if (restaurant.reviews.length > 0) {
        const starRating = Math.round(restaurant.averageRating);

        htmlStars = `
            <div class='restaurant-stars'>
        `;

        for (let i = 0; i < starRating; i++) {
            htmlStars += `<span class='oi oi-star star-highlight'></span>`;
        }

        for (let i = 0; i < (5 - starRating); i++) {
            htmlStars += `<span class='oi oi-star'></span>`;
        }

        htmlStars += `</div>`;
    }

    const htmlAddress = `
          </div>
      </div>
      <div class='row'>
          <div class='col'>
              <p class='restaurant-address'>${restaurant.address.formattedAddress}</p>
          </div>
      </div>
    `;

    let htmlCategories = `
        <div class='row'>
            <div class='col'>
    `;

    if (restaurant.categories.length > 0) {
        let catCount = 0;
        for (const category of restaurant.categories) {
            htmlCategories += `<p class='restaurant-category'>${category.name}</p>`;
            catCount++;
            if (catCount > 6) {
                break;
            }
        }
    }

    htmlCategories += `     
            </div>
        </div>
    `;

    let htmlDescription = '';

    if (restaurant.description !== 'No description currently available.') {
        htmlDescription = `
            <div class='row'>
                <div class='col'>
                    <p class='restaurant-description'>${restaurant.description}</p>
                </div>
            </div>
        `;
    }

    let htmlSlideshow = `
                    </div>
                </div>
            </div>
            <div class='col-12 col-lg-4'>
                <div class='row'>
                    <div class='col'>
                        <div class='restaurant-nearby-images'>
                            <div class='slideshow-wrapper'>
        `;

    let imageCount = 0;

    if (restaurant.images.length > 0) {
        htmlSlideshow += "<div class='slideshow'>";
        for (const image of restaurant.images) {
            htmlSlideshow += `<img src='images/restaurants/${restaurant._id}/${image}' class='slide-${index}'/>`;
            imageCount += 1;
            if (imageCount >= 3) {
                // only show first 3 images
                break;
            }
        }
        htmlSlideshow += '</div>';
    }

    if (imageCount > 1) {
        htmlSlideshow += `
                <div id='button-prev-${index}' class='slideshow-prev'>
                    <span class='oi oi-chevron-left'></span>
                </div>
                <div id='button-next-${index}' class='slideshow-next'>
                    <span class='oi oi-chevron-right'></span>
                </div>
        `;
    }
    htmlSlideshow += '</div>';

    const htmlEnd = '</div></div></div></div></div></div>';
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

    // noinspection JSJQueryEfficiency
    $(`.slide-${value}`).first().addClass(`current-${value}`);
    // noinspection JSJQueryEfficiency
    $(`.slide-${value}`).hide();
    $(`.current-${value}`).show();

    btnNext.click(() => {
        // noinspection JSJQueryEfficiency
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        // noinspection JSJQueryEfficiency
        if ($(`.previous-${value}`).is(':last-child')) {
            $(`.slide-${value}`).first().addClass(`current-${value}`);
        } else {
            $(`.previous-${value}`).next().addClass(`current-${value}`);
        }
        // noinspection JSJQueryEfficiency
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        // noinspection JSJQueryEfficiency
        $(`.slide-${value}`).fadeOut();
        // noinspection JSJQueryEfficiency
        $(`.current-${value}`).fadeIn();
    });

    btnPrev.click(() => {
        // noinspection JSJQueryEfficiency
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        // noinspection JSJQueryEfficiency
        if ($(`.previous-${value}`).is(':first-child')) {
            $(`.slide-${value}`).last().addClass(`current-${value}`);
        } else {
            $(`.previous-${value}`).prev().addClass(`current-${value}`);
        }
        // noinspection JSJQueryEfficiency
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        // noinspection JSJQueryEfficiency
        $(`.slide-${value}`).fadeOut();
        // noinspection JSJQueryEfficiency
        $(`.current-${value}`).fadeIn();
    });
}

console.log('Loaded search.js');