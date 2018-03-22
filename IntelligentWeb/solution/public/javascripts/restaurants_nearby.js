let lat, lng, map;
// noinspection JSJQueryEfficiency
$(() => {
    getUserLocation();
});

function getUserLocation() {
    const options = {
        enableHighAccuracy: true,
        timeout: 10000
        // maximumAge: 0
    };

    console.log("Tell me where you are");
    navigator.geolocation.getCurrentPosition(createMap, navigatorFallback, options);
}

function navigatorFallback() {
    console.log("Please tell me where you are :(");
    // TODO: fallback to postcode/send request for navigator
    /*
    TODO: actually, use postcode fist then have a button to ask user to give their currentLoc -
    this will stop locating violation and also solve navigator on localhost bug
    */
    createMap({coords: {latitude: 52, longitude: 0}})
}

function createMap(position) {
    console.log("Creating the map");
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    const currentLocation = {lat: lat, lng: lng};
    console.log(`@ ${currentLocation.lat}, ${currentLocation.lng}`);

    map = new google.maps.Map($('#nearby-map')[0], {
        zoom: 14,
        center: currentLocation
    });

    const marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: currentLocation
    });

    google.maps.event.addListener(marker, 'dragend', () => {
        lat = marker.getPosition().lat();
        lng = marker.getPosition().lng();
    });
}

// noinspection JSUnusedGlobalSymbols [IntelliJ]
function updateList() {
    let coordinates = JSON.stringify({lat: lat, lng: lng});

    // noinspection JSUnusedGlobalSymbols
    $.ajax({
        url: '/restaurants-nearby',
        data: coordinates,
        contentType: 'application/json; charset=utf-8',
        type: 'POST',
        success: (result) => {
            console.log(result);
            processData(result);
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
        }
    });
}

function processData(results) {
    const restaurantListDOM = $('#restaurant-list')[0];
    restaurantListDOM.innerHTML = null;

    // for (let result of results) {
    for (const [index, value] of results.entries()) {
        let newElement = document.createElement('div');
        newElement.innerHTML = getRestaurantDiv(value, index);
        restaurantListDOM.appendChild(newElement);
        initSlideshow(index);

        new google.maps.Marker({
            map: map,
            position: {lat: value.latitude, lng: value.longitude}
        });
    }
}

function getRestaurantDiv(restaurant, index) {
    console.log(restaurant.name);

    const htmlStart = `
<div class="container nearby-restaurant">
  <div class="row">
    <div class="col-8">
      <div class="vert-center-parent">
        <div class="vert-center-child">
          <div class="row">
            <div class="col"><a href="#" class="restaurant-title d-inline">${restaurant.name}</a>
`;

    const htmlStars = `
        <div class="restaurant-stars">
            <span aria-hidden="true" style="color: orange;" class="oi oi-check oi-star">
            </span><span aria-hidden="true" style="color: orange;" class="oi oi-check oi-star">
            </span><span aria-hidden="true" style="color: orange;" class="oi oi-check oi-star">
            </span><span aria-hidden="true" style="color: orange;" class="oi oi-check oi-star">
            </span><span aria-hidden="true" class="oi oi-check oi-star"></span>
        </div>
    `;
    const htmlAddress = `
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="restaurant-address">${restaurant.wholeAddress}</p>
        </div>
      </div>
    `;

    const htmlCategories = `
        <div class="row">
            <div style="margin: -5px" class="col">
              <p class="restaurant-category">Japanese</p>
              <p class="restaurant-category">Chicken</p>
              <p class="restaurant-category">Vegetarian</p>
              <p class="restaurant-category">Family Friendly</p>
            </div>
        </div>
    `;

    let htmlDescription;

    if (!restaurant.description) {
        htmlDescription = '';
    } else {
        htmlDescription = `
              <div class="row">
                <div class="col">
                  <p class="restaurant-description">${restaurant.description}</p>
                </div>
              </div>
    `;
    }


    const htmlSlideshow = `
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
                          <img src="images/displayPictures/greta-veronika-gmail-com.jpg" class="img-slides-${index}"/>
                          <img src="images/displayPictures/aslan-chicken-shop-com.jpg" class="img-slides-${index}"/>
                          <img src="images/displayPictures/copeyrufus-gmail-com.jpg" class="img-slides-${index}"/>
                          <img src="images/restaurants/5ab1677c521e5430fc7d2494/2018-03-20 20-09-01.jpg" class="img-slides-${index}"/>
                      </div>
                      <div id="button-prev-${index}">
                          <span aria-hidden="true" class="oi oi-check oi-chevron-left"></span>
                      </div>
                      <div id="button-next-${index}">
                          <span aria-hidden="true" class="oi oi-check oi-chevron-right"></span>
                      </div>
                    </div>
    `;

    const htmlEnd = `
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;

    return htmlStart + htmlStars + htmlAddress + htmlCategories + htmlDescription + htmlSlideshow + htmlEnd;
}

function initSlideshow(value) {
    const btnNext = $(`#button-next-${value}`);
    const btnPrev = $(`#button-prev-${value}`);

    $(`.img-slides-${value}`).first().addClass(`current-${value}`);
    $(`.img-slides-${value}`).hide();
    $(`.current-${value}`).show();

    // noinspection JSJQueryEfficiency
    btnNext.click(() => {
        console.log('next)');
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        if ($(`.previous-${value}`).is(':last-child')) {
            $(`.img-slides-${value}`).first().addClass(`current-${value}`);
        }
        else {
            $(`.previous-${value}`).next().addClass(`current-${value}`);
        }
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        $(`.img-slides-${value}`).fadeOut();
        $(`.current-${value}`).fadeIn();
    });

    btnPrev.click(() => {
        console.log('prev');
        $(`.current-${value}`).removeClass(`current-${value}`).addClass(`previous-${value}`);
        if ($(`.previous-${value}`).is(':first-child')) {
            $(`.img-slides-${value}`).last().addClass(`current-${value}`);
        }
        else {
            $(`.previous-${value}`).prev().addClass(`current-${value}`);
        }
        $(`.previous-${value}`).removeClass(`previous-${value}`);
        $(`.img-slides-${value}`).fadeOut();
        $(`.current-${value}`).fadeIn();
    });
}
