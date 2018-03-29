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
    console.log(`AJAX POST received ${JSON.stringify(req.body)}`);

    const searchQueryData = req.body.searchQueryData;
    console.log(`Searching for ${searchQueryData}`);

    Restaurant.find({$text: {$search: searchQueryData}})
        .skip(20)
        .limit(10)
        .exec((err, docs) => {
            console.log(err);
            console.log(docs);
        });
});

module.exports = router;
