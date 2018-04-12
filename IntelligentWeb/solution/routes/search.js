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

//AJAX POSTs to '/search', so relatively '/'
router.post('/', (req, res) => {
    console.log(`AJAX POST received: ${JSON.stringify(req.body)}`);

    const searchQueryData = req.body.searchQueryData;
    console.log(`Searching for ${searchQueryData}`);

    //{description: {$regex: "/"+searchQueryData+"/i"}}
    // Restaurant.find({ description : { $regex: '/'+se archQueryData+'/', $options: 'i' } })
    //     .exec()
    //     .then((restaurants) => {
    //         console.log(`RESULTS: ${restaurants.length}`);
    //         res.send(restaurants);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });


    const re = new RegExp(searchQueryData, 'i');

    // Restaurant.find().or([{name: {$regex: re}}, {description: {$regex: re}}])
    //     .exec()
    //     .then((restaurants) => {
    //         console.log(`RESULTS: ${restaurants.length}`);
    //         res.send(restaurants);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    const restaurantPromise = Restaurant.aggregate(
        [
            {
                "$match": {
                    "$or": [
                        // TODO make this more flexible (e.g. '187 west street' instead of '187, west street')
                        {name: {$regex: re}},
                        {description: {$regex: re}},
                        {'address.formattedAddress': {$regex: re}},
                        // {formattedAddress: {$regex: re}}
                    ]
                }
            },
            {
                "$project": {
                    'name': 1,
                    'address': {'formattedAddress': 1},
                    'description': 1,
                    'categories': 1,
                    'images': 1,
                    'averageRating': 1,
                }
            },
            {"$sort": {"score": -1}}
        ], (err, restaurants) => {
            if (err) {
                console.log(`Error: ${err}`);
            }

            const weightedRestaurants = applyWeightings(restaurants);

            res.send(weightedRestaurants);
        }
    );


    restaurantPromise
        .then(() => {
            console.log('Return successful');
        })
        .catch((err) => {
            console.log(`Restaurant aggregation failed: ${err}`);
        });


});

function applyWeightings(restaurants){
    // TODO: apply weighting: e.g. name = 5, description = 4, category = 3, formattedAddress = 3
    return restaurants;
}

module.exports = router;
