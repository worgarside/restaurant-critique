// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const title = 'Restaurant Critique';
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');
const Category = mongoose.model('Category');
const Review = mongoose.model('Review');
const User = mongoose.model('User');

router.use(bodyParser.urlencoded({extended: true}));

// ================ GET Statements ================ \\

router.get('/', (req, res) => {
    res.render('index', {title: title, user: req.user, animateLogo: true});
});

router.get('/about', (req, res) => {
    res.render('about', {title: title, user: req.user});
});

router.get('/accessibility', (req, res) => {
    res.render('accessibility', {title: title, user: req.user});
});

router.get('/contact', (req, res) => {
    res.render('contact', {title: title, user: req.user});
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('back');
});

router.get('/restaurant/new', (req, res) => {
    const tempRestaurant = new Restaurant;

    Category.find({}).select('name _id').then((categories) => {
        res.render('restaurant_new', {
            title: title,
            user: req.user,
            categories: JSON.stringify(categories),
            features: tempRestaurant.features
        });
    }).catch((err) => {
        if (err.errmsg) {
            console.log(err.errmsg);
        } else {
            console.log(err);
        }
    });
});

router.get('/restaurant/:url', (req, res) => {
    return Restaurant.findOne({localUrl: req.params.url}, (err, restaurant) => {
        if (err) {
            throw(err);
        }

        const reviewIdList = restaurant.reviews;
        let reviewList = [];
        let reviewPromises = [];

        for (id of reviewIdList) {
            reviewPromises.push(Review.findOne({_id: id}).then((review) => {
                reviewList.push(review);
                console.log(`Pushed review #${review.title}`);
            }).catch((err) => {
                console.log(`Error fetching review: ${err}`);
            }));
        }

        Promise.all(reviewPromises).then(() => {
            return res.render('restaurant', {title: title, restaurant: restaurant, reviews: reviewList});
        }).catch(() => {
            return res.render('/error');
        })
    });
});

router.get('/restaurants-nearby', (req, res) => {
    res.render('restaurants_nearby', {title: title, user: req.user});
});

router.get('/search', (req, res) => {
    res.render('search', {title: title, user: req.user});
});

router.get('/signup', (req, res) => {
    res.render('signup', {title: title, user: req.user});
});

router.get('/verify-user/:hash', (req, res) => {


    User.findOne({'verified.hash': req.params.hash}, (err, user) => {
        if (err) {
            console.log(err);
        }

        if (!user) {
            console.log('No user');
            res.render('user-verification', {title: title, verified: false});
        } else {
            User.update({'verified.hash': req.params.hash}, {
                'verified.flag': true,
                'verified.hash': undefined
            }, (err) => {
                if (err) {
                    console.log(`Error: ${err}`);
                    res.render('user-verification', {title: title, verified: false});
                }
            });

            res.render('user-verification', {title: title, verified: true});
        }
    });
});

// ================ POST Statements ================ \\

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
            return res.redirect('back');
        });
    })(req, res, next);
});

module.exports = router;
