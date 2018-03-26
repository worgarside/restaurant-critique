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

let returnList;

//AJAX POSTs to '/search', so relatively '/'
router.post('/', (req, res) => {
    console.log(`POST received ${JSON.stringify(req.body)}`);

    returnList = [];

    restaurantPromise
        .then(() => {
            console.log(`Returned ${returnList.length}`);
        })
        .catch((err) => {
            console.log(`Restaurant aggregation failed: ${err}`);
        });
});

module.exports = router;
