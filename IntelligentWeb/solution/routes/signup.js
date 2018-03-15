const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoClientObject = require('mongodb').MongoClient;
const assert = require('assert');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/displayPictures');
    },
    filename: function (req, file, callback) {
        var re = /(?:\.([^.]+))?$/;
        var extension = "." + re.exec(file.originalname)[1];
        callback(null, req.body.email.replace(/[^a-zA-Z]/g, "-") + extension);
    }
});

var upload = multer({storage: storage});

router.use(bodyParser.urlencoded({extended: true}));

// -------- Database -------- \\

var url = "mongodb://localhost:27017/";
const dbName = "restaurant_critique";
var db, client;

mongoClientObject.connect(url, function (err, client) {
    assert.equal(null, err);

    console.log("Connection established to", url);
    db = client.db(dbName);
});

router.post('/add_user', upload.single('displayPicture'), function (req, res) {
    var userForename = req.body.forename;
    var userSurname = req.body.surname;
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    var userPhone = req.body.phone;
    var userAge = req.body.age;
    var userCounty = req.body.county;

    var re = /(?:\.([^.]+))?$/;
    var extension = "." + re.exec(req.file.originalname)[1];

    var new_user = {
        _id: userEmail,
        forename: userForename,
        surname: userSurname,
        password: userPassword,
        phone: userPhone,
        age: userAge,
        county: userCounty,
        privilege_level: 1,
        display_img_filename: req.body.email.replace(/[^a-zA-Z]/g, "-") + extension
    };

    var userPromise = db.collection("users").insertOne(new_user, function (err) {
        if (err) return console.log(err);
    });

    Promise.all([userPromise]).then(function () {
        // TODO: client.close()
    });
    res.redirect('/')
});

module.exports = router;
