// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Restaurant = mongoose.model('Restaurant');
router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Method ================ \\

//AJAX POSTs to '/restaurants-nearby', so relatively '/'
router.post('/', function (req, res) {
    console.log('Aggregating restaurants');

    var pageNum = 0;

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
        function (err, shapes) {
            if (err) throw err;
            //console.log( shapes );

            shapes = shapes.map(function (x) {
                delete x.dis;
                return new Restaurant(x);
            });

            Restaurant.populate(shapes, {path: "info"}, function (err, docs) {
                if (err) throw err;
                console.log(JSON.stringify(docs, undefined, 4));
            });
        }
    ).then(function () {
        res.send(JSON.stringify({lat: req.body.lat, lng: req.body.lng})); //TODO change this!!!
    }).catch(function (err) {
        console.log('Restaurant aggregation failed: ' + err);
    });


});

module.exports = router;
