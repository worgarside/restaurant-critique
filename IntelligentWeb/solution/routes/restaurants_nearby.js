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
    console.log('hello');
    console.log(req.body);
    res.send(JSON.stringify({lat: 69, lng:420}));
});

module.exports = router;
