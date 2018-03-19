// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const passport = require('passport');

const User = mongoose.model('User');
router.use(bodyParser.urlencoded({extended: true}));
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/displayPictures');
    },
    filename: (req, file, callback) => {
        const re = /(?:\.([^.]+))?$/;
        const extension = `.${re.exec(file.originalname)[1]}`;
        callback(null, req.body.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-") + extension);
    }
});

const upload = multer({storage: storage});

// ================ POST Method ================ \\

router.post('/add_user', upload.single('displayPicture'), passport.authenticate('signup-local', {
    successRedirect: '/',
    failureRedirect: '/signup'
}));

module.exports = router;
