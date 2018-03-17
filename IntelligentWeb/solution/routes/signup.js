// ---------------- Middleware ---------------- \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const passport = require('passport');

const User = mongoose.model('User');
router.use(bodyParser.urlencoded({extended: true}));
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images/displayPictures');
    },
    filename: function (req, file, callback) {
        var re = /(?:\.([^.]+))?$/;
        var extension = "." + re.exec(file.originalname)[1];
        callback(null, req.body.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-") + extension);
    }
});

const upload = multer({storage: storage});

// ---------------- POST Method ---------------- \\

router.post('/add_user', upload.single('displayPicture'), passport.authenticate('signup-local', {
    successRedirect: '/about', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// router.post('/add_user', upload.single('displayPicture'), function (req, res) {
//     var re = /(?:\.([^.]+))?$/;
//     var imgExtension = "." + re.exec(req.file.originalname)[1];
//
//     // passwordConfirm: req.body.passwordConfirm,
//
//     var insertionPromise = new User({
//         _id: req.body.email,
//         forename: req.body.forename,
//         surname: req.body.surname,
//         password: req.body.password,
//         age: req.body.age,
//         county: req.body.county,
//         privilege_level: 1,
//         display_img_filename: req.body.email.replace(/[^a-zA-Z]/g, "-") + imgExtension
//     }).save();
//
//
//
//     insertionPromise.then(function () {
//         console.log("User added to collection")
//     }).catch(function (err) {
//         console.log("User failed to add to collection: " + err)
//     });
//
//     res.redirect('/')
// });

module.exports = router;
