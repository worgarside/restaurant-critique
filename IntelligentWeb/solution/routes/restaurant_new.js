const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoClientObject = require('mongodb').MongoClient;
const assert = require('assert');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/restaurant');
    },
    filename: function (req, file, callback) {
        var re = /(?:\.([^.]+))?$/;
        var extension = "." + re.exec(file.originalname)[1];
        callback(null, req.body.restaurantName.replace(/[^a-zA-Z]/g, "-") + extension);
    }
});

var upload = multer({storage: storage});

router.use(bodyParser.urlencoded({extended: true}));

// ---------------- Database ---------------- \\

var url = "mongodb://localhost:27017/";
const dbName = "restaurant_critique";
var db;

mongoClientObject.connect(url, function (err, client) {
    assert.equal(null, err);

    console.log("Connection established to", url);
    db = client.db(dbName);
});

router.post('/add_restaurant', upload.single('displayPicture'), function (req, res) {

    var postcode = req.body.postcode;

    var googleMaps = require('@google/maps').createClient({
        key: 'AIzaSyDlmGXTAyXPQy1GX02s8UDm1OLBNz6zia0'
    });

    var gmapsPromise = new Promise(function (resolve, reject) {
        googleMaps.geocode({
            address: postcode
        }, function (err, response) {
            if (err) {
                console.log("\n\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\nError: " + err);
                reject();
            } else {
                resolve(response.json.results[0].geometry.location);
            }
        })
    });

    gmapsPromise.then(function (location) {
        submitRestaurant(postcode, location, req.body)
    }).catch(function (error) {
        console.log('Error: ' + error);
    });

    res.redirect('/')
});

function submitRestaurant(postcode, location, body) {
    /**
     * @param {{monOpen:int, tueOpen:int, wedOpen:int, thuOpen:int, friOpen:int, satOpen:int, sunOpen:int,
         monClose:int, tueClose:int, wedClose:int, thuClose:int, friClose:int, satClose:int, sunClose:int,
         restaurantName: string, priceRange: string, outdoorseating: int}} body,
     */

    var openingTimes = [
        [body.monOpen, body.monClose],
        [body.tueOpen, body.tueClose],
        [body.wedOpen, body.wedClose],
        [body.thuOpen, body.thuClose],
        [body.friOpen, body.friClose],
        [body.satOpen, body.satClose],
        [body.sunOpen, body.sunClose]
    ];

    var latitude = location.lat;
    var longitude = location.lng;

    var newRestaurant = {
        name: body.restaurantName,
        address1: body.address1,
        address2: body.address2,
        city: body.city,
        postcode: postcode,
        url: body.url,
        phone: body.phone,
        menu: body.menu,
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

        latitude: latitude,
        longitude: longitude,

        published: true
    };

    // console.log("\n\n############################################\n\n");
    // console.log(newRestaurant);
    // console.log("\n\n############################################\n\n");

    var insertionPromise = db.collection("restaurants").insertOne(newRestaurant);

    insertionPromise.then(function () {
        console.log("Restaurant added to collection")
    }).catch(function () {
        console.log("Restaurant failed to add to collection")
    });
}

module.exports = router;
