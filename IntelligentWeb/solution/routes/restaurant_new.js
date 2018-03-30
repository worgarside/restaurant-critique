// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');
const Category = mongoose.model('Category');

const multer = require('multer');
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

// noinspection JSUnresolvedFunction
router.post('/add_restaurant', upload.single('displayPicture'), (req, res) => {
    /**
     * @param {{monOpen:int, tueOpen:int, wedOpen:int, thuOpen:int, friOpen:int, satOpen:int, sunOpen:int,
         monClose:int, tueClose:int, wedClose:int, thuClose:int, friClose:int, satClose:int, sunClose:int,
         restaurantName: string, priceRange: string, outdoorseating: string}} body,
     */

    const body = req.body;

    const openingTimes = [
        [body.monOpen, body.monClose],
        [body.tueOpen, body.tueClose],
        [body.wedOpen, body.wedClose],
        [body.thuOpen, body.thuClose],
        [body.friOpen, body.friClose],
        [body.satOpen, body.satClose],
        [body.sunOpen, body.sunClose]
    ];

    let priceRange, parking, wifi, takeout, delivery, outdoorseating, reservations, alcohol, vegetarian, vegan;

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

    let categoryList = [];

    for (const category of JSON.parse(body.categories)){
        categoryList.push(category);
    }


    new Restaurant({
        name: body.restaurantName,
        address: {
            line1: body.address1,
            line2: body.address2,
            city: body.city,
            postcode: body.postcode
        },
        latitude: body.lat,
        longitude: body.lng,
        url: body.url,
        menu: body.menu,
        phone: body.phone,
        opening_times: openingTimes,
        description: body.description,
        price_range: priceRange,
        categories: categoryList,
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

    res.redirect('/')
});

module.exports = router;
