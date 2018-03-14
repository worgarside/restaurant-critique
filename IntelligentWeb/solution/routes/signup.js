const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoClientObject = require('mongodb').MongoClient;
const assert = require('assert');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});

var upload = multer({storage: storage}).single('myFile');


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

router.post('/add_user', function (req, res, next) {

    console.log("\n\n#########################################");
    console.log(req.body);
    console.log("-----------------------------------------");
    console.log(req.file);
    console.log(req.files);
    console.log("#########################################\n\n");

    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading");
        }
        // res.end("Success");
        console.log("AMAZING WELL DONE");
    });

    res.redirect('/')
});


// router.post('/add_user', function (req, res) {
//     var userForename = req.body.forename;
//     var userSurname = req.body.surname;
//     var userEmail = req.body.email;
//     var userPassword = req.body.password;
//     var userPhone = req.body.phone;
//     var userAge = req.body.age;
//     var userCounty = req.body.county;
//
//     console.log("\n\n#########################################");
//     console.log(req.files);
//     console.log("-----------------------------------------");
//     console.log(req.file);
//     console.log("#########################################\n\n");
//
//
//
//     var new_user = {
//         forename: userForename,
//         surname: userSurname,
//         email: userEmail,
//         password: userPassword,
//         phone: userPhone,
//         age: userAge,
//         county: userCounty,
//         privilege_level: 1
//     };
//
//     db.collection("users").insertOne(new_user, function (err, res) {
//         if (err) return console.log(err);
//     });
//     res.redirect('/')
// });

module.exports = router;
