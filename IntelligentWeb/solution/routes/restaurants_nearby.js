// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const Restaurant = mongoose.model('Restaurant');
router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Method ================ \\

//AJAX POSTs to '/restaurants-nearby', so relatively '/'
router.post('/', (req, res) => {

    // TODO: pass this in with pagination??
    const pageNum = 0;
    const restaurantsPerPage = 10;

    Restaurant.aggregate([{
        "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": [req.body.lng, req.body.lat]
            },
            "spherical": true,
            "distanceField": "distance"
            // "maxDistance": 10000
        }
    },
        {"$skip": pageNum * restaurantsPerPage},
        {"$limit": restaurantsPerPage}
    ], (err, restaurants) => {
        if (err) {
            console.log(`Error: ${err}`);
        }

        if (restaurants.length > 0) {
            let returnList = [];
            console.log(`Returning: ${restaurants.length}`);

            for (let restaurant of restaurants) {
                const files = fs.readdirSync(`./public/images/restaurants/${restaurant._id}`);
                const keepPosition = files.indexOf(".keep");
                files.splice(keepPosition, 1);

                const tempRestaurant = new Restaurant(restaurant);
                tempRestaurant.images = files;
                returnList.push(tempRestaurant)
            }

            res.send(returnList);
        } else {
            console.log(`Error: restaurants is ${restaurants}`);
        }
    }).catch((err) => {
        console.log(`Restaurant aggregation failed: ${err}`);
    });
});

module.exports = router;
