// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const title = 'Restaurant Critique';
const bodyParser = require('body-parser');
const passport = require('passport');

router.use(bodyParser.urlencoded({extended: true}));

// ================ GET Statements ================ \\

router.get('/', function (req, res) {
    res.render('index', {title: title, user: req.user, animateLogo: true});
});

router.get('/contact', function (req, res) {
    res.render('contact', {title: title, user: req.user});
});

router.get('/signup', function (req, res) {
    res.render('signup', {title: title, user: req.user});
});

router.get('/search', function (req, res) {
    res.render('search', {title: title, user: req.user});
});

router.get('/about', function (req, res) {
    res.render('about', {title: title, user: req.user});
});

router.get('/accessibility', function (req, res) {
    res.render('accessibility', {title: title, user: req.user});
});

router.get('/restaurant/new', function (req, res) {
    res.render('restaurant_new', {title: title, user: req.user});
});

router.get('/restaurants-nearby', function (req, res) {
    res.render('restaurants_nearby', {title: title, user: req.user});
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

// ================ POST Statements ================ \\

router.post('/login', function (req, res, next) {
    passport.authenticate('login-local', function (err, user) {
        if (err) {
            console.log(err);
            next();
        }
        if (!user) {
            return res.redirect('/');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;
