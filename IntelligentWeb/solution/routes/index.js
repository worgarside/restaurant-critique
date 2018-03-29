// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const title = 'Restaurant Critique';
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');


router.use(bodyParser.urlencoded({extended: true}));

// ================ GET Statements ================ \\

router.get('/', (req, res) => {
    res.render('index', {title: title, user: req.user, animateLogo: true});
});

router.get('/contact', (req, res) => {
    res.render('contact', {title: title, user: req.user});
});

router.get('/signup', (req, res) => {
    res.render('signup', {title: title, user: req.user});
});

router.get('/search', (req, res) => {
    res.render('search', {title: title, user: req.user});
});

router.get('/about', (req, res) => {
    res.render('about', {title: title, user: req.user});
});

router.get('/accessibility', (req, res) => {
    res.render('accessibility', {title: title, user: req.user});
});

router.get('/restaurant/new', (req, res) => {
    res.render('restaurant_new', {title: title, user: req.user});
});

router.get('/restaurants-nearby', (req, res) => {
    res.render('restaurants_nearby', {title: title, user: req.user});
});

router.get('/restaurant', (req, res) => {
    res.render('restaurant', {title: title, user: req.user});
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/restaurant/:url', (req, res) => {
    return Restaurant.findOne({ localUrl: req.params.url },  (err, result) => {
        if (err) { throw(err); }
        return res.render('restaurant', {title: title, restaurant: result});
    });
});

// ================ POST Statements ================ \\

router.post('/search', (req, res) => {
    console.log(`POST received ${JSON.stringify(req.body)}`);
    Restaurant.find({$text: {$search: req.body.text_query}})
        .skip(20)
        .limit(10)
        .exec(function(err, docs) { console.log("results");
                                    console.log(docs);
        });

    console.log("you did an AJAX m9");
    return res.redirect('/search');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('login-local', (err, user) => {
        if (err) {
            console.log(err);
            next();
        }
        if (!user) {
            return res.redirect('/');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;
