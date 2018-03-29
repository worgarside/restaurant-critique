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
    Restaurant.find({$text: {$search: "Sheffield"}})
        .skip(20)
        .limit(10)
        .exec(function(err, docs) { console.log(docs);  });
    console.log("you did an AJAX m9");

});

module.exports = router;
