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
                resolve(response.json.results[0].geometry.location);
            }
        })
    });

    gmapsPromise.then((location) => {
        submitRestaurant(postcode, location, req.body)
    }).catch((err) => {
        console.log(`Error: ${err}`);
    });

    res.redirect('/')
});

function submitRestaurant(postcode, location, body) {
    /**
     * @param {{monOpen:int, tueOpen:int, wedOpen:int, thuOpen:int, friOpen:int, satOpen:int, sunOpen:int,
         monClose:int, tueClose:int, wedClose:int, thuClose:int, friClose:int, satClose:int, sunClose:int,
         restaurantName: string, priceRange: string, outdoorseating: int}} body,
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

    const latitude = location.lat;
    const longitude = location.lng;

    new Restaurant({
        name: body.restaurantName,
        address1: body.address1,
        address2: body.address2,
        city: body.city,
        postcode: postcode,
        latitude: latitude,
        longitude: longitude,
        url: body.url,
        menu: body.menu,
        phone: body.phone,
        opening_times: openingTimes,
        description: body.description,
        price_range: parseInt(body.priceRange),
        category: [body.category],
        parking: body.parking === 1,
        wifi: body.wifi === 1,
        takeout: body.takeout === 1,
        delivery: body.delivery === 1,
        outdoor_seating: body.outdoorseating === 1,
        reservations: body.reservations === 1,
        alcohol: body.alcohol === 1,
        owner_id: null,
        owner_message: null,
        reviews: [],
        average_rating: [],
        published: true
    }).save().then(() => {
        console.log("Restaurant added to collection")
    }).catch((err) => {
        console.log(`Restaurant failed to add to collection: ${err}`)
    });

    // console.log("\n\n############################################\n\n");
    // console.log(newRestaurant);
    // console.log("\n\n############################################\n\n");

    /*
        FOR ADDING A NEW REVIEW
        const dateFormat = require('dateformat');
        var now = dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss");

        USE AS IMAGE FILENAME
     */
}

module.exports = router;
