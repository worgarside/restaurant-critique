/**
 * User signup management, uses passport configuration file
 * @author Will Garside
 */

// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const passport = require('passport');
const User = mongoose.model('User');

router.use(bodyParser.urlencoded({extended: true}));

/**
 * Uses multer to manage the User's display image
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/userImages');
    },
    filename: (req, file, callback) => {
        const re = /(?:\.([^.]+))?$/;
        const extension = `.${re.exec(file.originalname)[1]}`;
        callback(null, req.body.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-") + extension);
    }
});

const upload = multer({storage: storage});

// ================ POST Method ================ \\

/**
 * Uses passport to authenticate user and sign them in
 *
 * @function upload.single,
 *      Uploads a single image with multer
 * @function passport.authenticate
 *      Uses passport middleware to authenticate the user and create a user session
 *      @see config/passport.js
 */
router.post('/add_user', upload.single('displayPicture'), passport.authenticate('signup-local', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

module.exports = router;
