/**
 * Returns a list of nearby restaurant to the client when a GMaps marker is dropped
 * @author Will Garside
 */

// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');
router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Method ================ \\

/**
 * Uses AJAX to receive the location chosen on the GMap and then aggregates the nearest restaurants by using geojson
 * indexing. Returns the list in order of ascending distance
 * AJAX POSTs to '/restaurants-nearby', so relatively '/'
 * @function getNearbyRestaurants
 */
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
