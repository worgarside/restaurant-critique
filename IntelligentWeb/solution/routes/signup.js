// ---------------- Middleware ---------------- \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const User = mongoose.model('User');
router.use(bodyParser.urlencoded({extended: true}));
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/displayPictures');
    },
    filename: function (req, file, callback) {
        var re = /(?:\.([^.]+))?$/;
        var extension = "." + re.exec(file.originalname)[1];
        callback(null, req.body.email.replace(/[^a-zA-Z]/g, "-") + extension);
    }
});

const upload = multer({storage: storage});

// ---------------- POST Method ---------------- \\

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

    var insertionPromise = new User({
        _id: userEmail,
        forename: userForename,
        surname: userSurname,
        password: userPassword,
        phone: userPhone,
        age: userAge,
        county: userCounty,
        privilege_level: 1,
        display_img_filename: req.body.email.replace(/[^a-zA-Z]/g, "-") + extension
    }).save();

    insertionPromise.then(function () {
        console.log("User added to collection")
    }).catch(function (err) {
        console.log("User failed to add to collection: " + err)
    });

    res.redirect('/')
});

module.exports = router;
