const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoClientObject = require('mongodb').MongoClient;
const assert = require('assert');
router.use(bodyParser.urlencoded({extended: true}));

// -------- Database -------- \\

var url = "mongodb://localhost:27017/";
const dbName = "restaurant_critique";
var db;

mongoClientObject.connect(url, function (err, client) {
    assert.equal(null, err);

    if (err) return console.log(err);
    if (!client) {
        console.error("Error! Database connection failed.");
        process.exit(1);
    } else {
        console.log("Connection established to", url);
        db = client.db(dbName);
    }
});


router.post('/add_user', function (req, res) {
    console.log('This is here');
    var username = req.body.forename;
    console.log(username);
    res.render('index', {title: 'COM3504'});
    db.collection("categories").insertOne({name: username}, function (err, res) {
        if (err) return console.log(err);
    });
});

module.exports = router;
