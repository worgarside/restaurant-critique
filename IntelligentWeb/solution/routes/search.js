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
    const searchQueryData = req.body.searchQueryData.replace(/[^\w\s]/, ''); // remove special chars
    const regexQuery = `^(?=.*${searchQueryData.replace(new RegExp(' ', 'g'), ')(?=.*')}).*$`; // split for regex AND
    const re = new RegExp(regexQuery, 'i'); // turn to regex, case insensitive
    console.log(`Searching with ${re}`);

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
                    'searchable': 1,
                    'score': 1
                }
            }
        ], (err, restaurants) => {
            if (err) {
                console.log(`Error: ${err}`);
            }

            const weightedRestaurants = applyWeightings(restaurants, searchQueryData);

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

function applyWeightings(restaurants, query) {
    /*
    * In the name +8
    * In the description +4
    * Matched category +2
    * In Address +1
    */

    for (let restaurant of restaurants) {
        let score = 0;

        for (let word of query.split(' ')) {
            if (word === '') continue;

            if (restaurant.searchable.name.toLowerCase().includes(word.toLowerCase())) score += 8;

            if (restaurant.searchable.description.toLowerCase().includes(word.toLowerCase())) score += 4;

            for (const category of restaurant.categories) {
                if (category.name.toLowerCase().includes(word.toLowerCase())) score += 2;
            }

            if (restaurant.searchable.formattedAddress.toLowerCase().includes(word.toLowerCase())) score += 1;
        }

        restaurant.score = score;
    }

    return restaurants.sort(compare);
}

function compare(a, b) {
    const scoreA = a.score;
    const scoreB = b.score;

    if (scoreA < scoreB) {
        return 1;
    } else if (scoreA > scoreB) {
        return -1;
    } else {
        return 0;
    }
}


module.exports = router;
