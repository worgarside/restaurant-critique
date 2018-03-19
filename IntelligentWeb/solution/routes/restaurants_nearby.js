// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Restaurant = mongoose.model('Restaurant');
router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Method ================ \\

//AJAX POSTs to '/restaurants-nearby', so relatively '/'
router.post('/', (req, res) => {
    console.log('Aggregating restaurants');

    // TODO: pass this in with pagination
    const pageNum = 0;

    Restaurant.aggregate([{
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [req.body.lng, req.body.lat]
                },
                "spherical": true,
                "distanceField": "dis"
                // "maxDistance": 10000
            }
        },
            {"$skip": pageNum * 10},
            {"$limit": 10}
        ],
        (err, restaurants) => {
            if (err) throw err;
            //console.log( restaurants );

            restaurants = restaurants.map((x) => {
                delete x.dis;
                return new Restaurant(x);
            });

            // TODO: figure out what population is and handle promise
            Restaurant.populate(restaurants, {path: "info"}, (err, docs) => {
                if (err) throw err;
                console.log(JSON.stringify(docs, undefined, 4));
            });
        }
    ).then(() => {
        res.send(JSON.stringify({lat: req.body.lat, lng: req.body.lng})); //TODO change this!!!
    }).catch((err) => {
        console.log('Restaurant aggregation failed: ' + err);
    });
});

module.exports = router;
