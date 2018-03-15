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
    console.log('pppp');
    var resName = req.body.name;
    var resSuburb = req.body.suburb;
    var resAddress1 = req.body.address1;
    var resAddress2 = req.body.address2;
    var resCity = req.body.city;
    var userAge = req.body.age;
    var userCounty = req.body.county;

    var new_user = {
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
        reviews: resReviews,
        images: resImages,
        owner_message: resOwner_message,
        average_rating: resAverage_rating,
        menu: resMenu,
        url: resURL,
        alcohol: resAlcohol,
        owner: resOwner
    };

    db.collection("restaurants").insertOne(new_restaurant, function (err, res) {
        if (err) return console.log(err);
    });
    res.redirect('/')
});

module.exports = router;
