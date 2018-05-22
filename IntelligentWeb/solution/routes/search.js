/**
 * Adds search functionality to site by aggregating Restaurant objects
 * @author Will Garside, Rufus Cope
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
 * Uses regex to search the Restaurants' 'searchable' attribute objects
 * Once matches have been found, the usable fields are projected to the client
 * Also adds a weight attribute for useful ordering
 * @param {object} req Client request object with body of info
 * @param {object} res Client response object to be sent with array of restaurants
 * @function submitSearchQuery
 */
router.post('/', (req, res) => {
    const searchQueryData = req.body.searchQueryData.replace(/[^\w\\S ]/, ''); // remove special chars
    const regexQuery = `^(?=.*${searchQueryData.replace(new RegExp(' ', 'g'), ')(?=.*')}).*$`; // split for regex AND
    const re = new RegExp(regexQuery, 'i'); // turn to regex, case insensitive
    console.log(`Searching with ${re}`);

    Restaurant.aggregate(
        [
            {
                "$match": {'published': true, 'searchable.all': {$regex: re}},
            },
            {
                "$project": {
                    'name': 1,
                    'address': {'formattedAddress': 1},
                    'location.coordinates': 1,
                    'description': 1,
                    'priceRange.band': 1,
                    'categories': 1,
                    'images': 1,
                    'averageRating': 1,
                    'localUrl': 1,
                    'searchable': 1,
                    'weight': 1
                }
            }
        ], (err, restaurants) => {
            if (err) {
                console.log(`Error: ${err}`);
            }
            res.send(applyWeightings(restaurants, searchQueryData));
        }
    )
        .then(() => {
            console.log('Return successful');
        })
        .catch((err) => {
            console.log(`Restaurant aggregation failed: ${err}`);
        });
});

/**
 * Applies a weighting to each Restaurant by evaluating the similarity between the search query and the Restaurant data
 * Weight is added as such: Query word in the name +8; word in the description +4; Matched category +2; In Address +1
 * @param {Array} restaurants Returned list of search-matched restaurants
 * @param {String} query The User's search query
 */
function applyWeightings(restaurants, query) {
    for (let restaurant of restaurants) {
        let weight = 0;
        for (let word of query.split(' ')) {
            // The split function returns empty strings if there are leading/trailing spaces
            if (word === '') continue;

            if (restaurant.searchable.name.toLowerCase().includes(word.toLowerCase())) weight += 8;

            if (restaurant.searchable.description.toLowerCase().includes(word.toLowerCase())) weight += 4;

            // Evaluate each Category in turn
            for (const category of restaurant.categories) {
                if (category.name.toLowerCase().includes(word.toLowerCase())) weight += 2;
            }

            if (restaurant.searchable.formattedAddress.toLowerCase().includes(word.toLowerCase())) weight += 1;
        }

        restaurant.weight = weight;
    }
    return restaurants.sort(compareRestaurants);
}

/**
 * Comparison method for the restaurants, called by the sort method
 * @param a {Restaurant} The first Restaurant to be compared
 * @param b {Restaurant} The second Restaurant to be compared
 * @returns {number} An integer indicative of the comparison, allows correct sorting
 */
function compareRestaurants(a, b) {
    const weightA = a.weight;
    const weightB = b.weight;

    if (weightA < weightB) {
        return 1;
    } else if (weightA > weightB) {
        return -1;
    } else {
        return 0;
    }
}


module.exports = router;
