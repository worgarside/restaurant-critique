// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const Restaurant = mongoose.model('Restaurant');
router.use(bodyParser.urlencoded({extended: true}));
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/restaurant');
    },
    filename: (req, file, callback) => {
        const re = /(?:\.([^.]+))?$/;
        const extension = `.${re.exec(file.originalname)[1]}`;
        callback(null, req.body.restaurantName.replace(/[^a-zA-Z]/g, "-") + extension);
    }
});

const upload = multer({storage: storage});

// ================ POST Method ================ \\

router.post('/add_restaurant', upload.single('displayPicture'), (req, res) => {
    console.log("Geocoding postcode...");

    const postcode = req.body.postcode;

    const googleMaps = require('@google/maps').createClient({
        key: 'AIzaSyDlmGXTAyXPQy1GX02s8UDm1OLBNz6zia0'
    });

    let gmapsPromise = new Promise((resolve, reject) => {
        googleMaps.geocode({
            address: postcode
        }, (err, response) => {
            if (err) {
                console.log(`Geocode Error: ${err}`);
                reject();
            } else {
                const locationData = response.json.results[0].geometry.location;
                resolve(locationData);
            }
        })
    });

    let timeoutPromise = new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            reject('Geocode request timed out.')
        }, 10000)
    });

    Promise.race([gmapsPromise, timeoutPromise])
        .then((location) => {
            submitRestaurant(postcode, location, req.body);
        })
        .catch((err) => {
            console.log(`Error: ${err} Submitting null location`);
            submitRestaurant(postcode, null, req.body);
        });

    res.redirect('/')
});

function submitRestaurant(postcode, location, body) {
    /**
     * @param {{monOpen:int, tueOpen:int, wedOpen:int, thuOpen:int, friOpen:int, satOpen:int, sunOpen:int,
         monClose:int, tueClose:int, wedClose:int, thuClose:int, friClose:int, satClose:int, sunClose:int,
         restaurantName: string, priceRange: string, outdoorseating: string}} body,
     */

    const openingTimes = [
        [body.monOpen, body.monClose],
        [body.tueOpen, body.tueClose],
        [body.wedOpen, body.wedClose],
        [body.thuOpen, body.thuClose],
        [body.friOpen, body.friClose],
        [body.satOpen, body.satClose],
        [body.sunOpen, body.sunClose]
    ];

    let lat, lng, priceRange, parking, wifi, takeout, delivery, outdoorseating, reservations, alcohol, vegetarian, vegan;

    if (location) {
        lat = location.lat;
        lng = location.lng;
    }

    if (body.priceRange) {
        priceRange = parseInt(body.priceRange);
    }

    // TODO: find a way of condensing these for loops

    if (body.parking === '0') {
        parking = false
    } else if (body.parking === '1') {
        parking = true
    }

    if (body.wifi === '0') {
        wifi = false
    } else if (body.wifi === '1') {
        wifi = true
    }

    if (body.takeout === '0') {
        takeout = false
    } else if (body.takeout === '1') {
        takeout = true
    }

    if (body.delivery === '0') {
        delivery = false
    } else if (body.delivery === '1') {
        delivery = true
    }

    if (body.outdoorseating === '0') {
        outdoorseating = false
    } else if (body.outdoorseating === '1') {
        outdoorseating = true
    }

    if (body.reservations === '0') {
        reservations = false
    } else if (body.reservations === '1') {
        reservations = true
    }

    if (body.alcohol === '0') {
        alcohol = false
    } else if (body.alcohol === '1') {
        alcohol = true
    }

    if (body.vegetarian === '0') {
        vegetarian = false
    } else if (body.vegetarian === '1') {
        vegetarian = true
    }

    if (body.vegan === '0') {
        vegan = false
    } else if (body.vegan === '1') {
        vegan = true
    }

    new Restaurant({
        name: body.restaurantName,
        address: {
            line1: body.address1,
            line2: body.address2,
            city: body.city,
            postcode: postcode
        },
        latitude: lat,
        longitude: lng,
        url: body.url,
        menu: body.menu,
        phone: body.phone,
        opening_times: openingTimes,
        description: body.description,
        price_range: priceRange,
        // categories: [body.category],
        features: {
            parking: parking,
            wifi: wifi,
            takeout: takeout,
            delivery: delivery,
            outdoor_seating: outdoorseating,
            reservations: reservations,
            alcohol: alcohol,
            vegetarian: vegetarian,
            vegan: vegan
        },
        published: true //TODO: add published flag
    }).save().then(() => {
        console.log("Restaurant added to collection")
    }).catch((err) => {
        console.log(`Restaurant failed to add to collection: ${err}`)
    });

    /*
        FOR ADDING A NEW REVIEW
        const dateFormat = require('dateformat');
        var now = dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss");

        USE AS IMAGE FILENAME
     */
}



module.exports = router;
