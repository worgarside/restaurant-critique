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
    var openingTimes = [
        [req.body.monOpen, req.body.monClose],
        [req.body.tueOpen, req.body.tueClose],
        [req.body.wedOpen, req.body.wedClose],
        [req.body.thuOpen, req.body.thuClose],
        [req.body.friOpen, req.body.friClose],
        [req.body.satOpen, req.body.satClose],
        [req.body.sunOpen, req.body.sunClose]
    ];

    var newRestaurant = {
        name: req.body.restaurantName,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        postcode: req.body.postcode,
        url: req.body.url,
        phone: req.body.phone,
        menu: req.body.menu,
        opening_times: openingTimes,
        description: req.body.description,
        price_range: parseInt(req.body.priceRange),
        category: [req.body.category],

        parking: req.body.parking === 1,
        wifi: req.body.wifi === 1,
        takeout :req.body.takeout === 1,
        delivery:req.body.delivery === 1,
        outdoor_seating: req.body.outdoorseating === 1,
        reservations: req.body.reservations === 1,
        alcohol:req.body.alcohol === 1,

        latitude: 4.20,
        longitude: 6.9,

        published: true
    };

    console.log("\n\n#################################################\n\n");
    console.log(newRestaurant);
    console.log("\n\n#################################################\n\n");

    Promise.all([db.collection("restaurants").insertOne(newRestaurant, function (err) {
        if (err) return console.log(err);
    })])
        .then(function () {
            console.log("Restaurant added to collection")
        })
        .catch(function () {
            console.log("Restaurant failed to add to collection")
        });
    res.redirect('/')
});

module.exports = router;
