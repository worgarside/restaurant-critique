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

    const searchQueryData = req.body.searchQueryData.replace(/[^\w\s]/, '');
    console.log(`Searching for ${searchQueryData}`);

    const regexQuery = `^(?=.*${searchQueryData.replace(new RegExp(' ', 'g'), ')(?=.*')}).*$`;
    const re = new RegExp(regexQuery, 'i');

    console.log(`RegExp: ${re}`);

    const restaurantPromise = Restaurant.aggregate(
        [
            {
                "$match": {'searchable.all': {$regex: re}},
            },
            {
                "$project": {
                    'name': 1,
                    'address': {'formattedAddress': 1},
                    'description': 1,
                    'categories': 1,
                    'images': 1,
                    'averageRating': 1,
                    'localUrl': 1,
                    'score': {
                        '$add': [
                            {'$cond': [{'$in': [searchQueryData, {$split: ['$searchable.all', ' ']}]}, 5, 0]},
                            // {'$cond': [{'$in': ['$description', {$split :[searchQueryData, ' ']}]}, 2, 0]},
                            // {'$cond': [{'$in': ['$address.formattedAddress', {$split :[searchQueryData, ' ']}]}, 1, 0]}
                        ]
                    }
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

function applyWeightings(restaurants) {
    // TODO: apply weighting: e.g. name = 5, description = 4, category = 3, formattedAddress = 3
    return restaurants;
}

module.exports = router;
