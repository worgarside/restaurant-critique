const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoClientObject = require('mongodb').MongoClient;
const assert = require('assert');

router.use(bodyParser.urlencoded({extended: true}));


// -------- Database -------- \\

var url = "mongodb://localhost:27017/";
const dbName = "restaurant_critique";
var db;

mongoClientObject.connect(url, function (err, client) {
    assert.equal(null, err);

    console.log("Connection established to", url);
    db = client.db(dbName);
});


router.post('/add_restaurant', function (req, res) {
    var resName = req.body.name;
    var resSuburb = req.body.suburb;
    var resAddress1 = req.body.address1;
    var resAddress2 = req.body.address2;
    var resCity = req.body.city;
    var resPostcode = req.body.postcode;
    var resLatitude = 11111111111.2222; //CONNECT TO GOOGLE MAPS
    var resLongitude = 22222222222.33333; //CONNECT TO GOOGLE MAPS
    var resPrice_range = req.body.price_range;
    var resDescription = req.body.description;
    var resOpening_times = [0,0,0,0,0]; // SOME COMPLICATED MATHS
    var resPhone = req.body.phone;
    var resPublished = true;
    var resDelivery = req.body.delivery;
    var resTakeout = req.body.takeout;
    var resParking = req.body.parking;
    var resWifi = req.body.wifi;
    var resOutdoor_seating = req.body.outdoor_seating;
    var resReservations = req.body.reservations;
    var resCategory = req.body.category;
    var resImages = req.body.images;
    var resAverage_rating = 1.0000000001;
    var resMenu = req.body.menu;
    var resURL = req.body.url;
    var resAlcohol = req.body.wifi;


    var new_restaurant = {
        name: resName,
        suburb: resSuburb,
        address1: resAddress1,
        address2: resAddress2,
        city: resCity,
        postcode: resPostcode,
        latitude:resLatitude,
        longitude:resLongitude,
        price_range: resPrice_range,
        description: resDescription,
        opening_times: resOpening_times,
        phone: resPhone,
        published: resPublished,
        delivery: resDelivery,
        takeout: resTakeout,
        parking: resParking,
        wifi: resWifi,
        outdoor_seating: resOutdoor_seating,
        reservations: resReservations,
        category: resCategory,
        images: resImages,
        average_rating: resAverage_rating,
        menu: resMenu,
        url: resURL,
        alcohol: resAlcohol
    };
    console.log("this is a restaurant");
    console.log(new_restaurant);

    db.collection("restaurants").insertOne(new_restaurant, function (err, res) {
        if (err) return console.log(err);
    });
    res.redirect('/')
});

module.exports = router;
