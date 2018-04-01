// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const Restaurant = mongoose.model('Restaurant');
const async = require('async');
router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Method ================ \\

//AJAX POSTs to '/restaurants-nearby', so relatively '/'
router.post('/', (req, res) => {
    console.log(`POST received ${JSON.stringify(req.body)}`);

    const point = {
        type: "Point",
        coordinates: [req.body.lng, req.body.lat]
    };

    const restaurantPromise = Restaurant.aggregate(
        [
            {
                "$geoNear": {
                    "near": point,
                    "spherical": true,
                    "distanceField": "distance",
                    "maxDistance": 10000
                }
            }
        ], (err, restaurants) => {
            if (err) {
                console.log(`Error: ${err}`);
            }

            res.send(restaurants);
        });

    restaurantPromise
        .then(() => {
            console.log('Return successful');
        })
        .catch((err) => {
            console.log(`Restaurant aggregation failed: ${err}`);
        });
});

module.exports = router;
