/**
 * Route management for the index of the site
 * this covers the majority of the site with the GET requests. POST request and more complex functions are located in
 * each pages specific routing file
 * @author WIll Garside, Rufus Cope, Greta Ramaneckaite
 */

// ================================ Middleware ================================ \\

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

let restaurantRefresh, topRestaurants, allCategories;

// ================================ Helper Functions ================================ \\

/**
 * Finds the top 5 Restaurants according to their average ratings and adds them to global var topRestaurants
 * @returns {Promise} - promise object of Restaurant lookup query
 */
function refreshTopRestaurants() {
    restaurantRefresh = new Date();
    console.log('\x1b[33m%s\x1b[0m', 'refreshTopRestaurants()');

    return Restaurant.find({published: true}).sort({averageRating: -1}).limit(5).select({
        'name': 1,
        'address.formattedAddress': 1,
        'description': 1,
        'categories': 1,
        'images': 1,
        'averageRating': 1,
        'localUrl': 1,
    })
        .exec()
        .then((restaurants) => {
            topRestaurants = restaurants;
        })
        .catch((err) => {
            console.log(err);
        });
}

/**
 * gets all categories in DB and adds them to array var
 * @returns {Promise} - promise object of Category lookup query
 */
function getAllCategories() {
    if (allCategories){
        return Promise.resolve();
    }

    console.log('\x1b[33m%s\x1b[0m', 'getAllCategories()');
    return Category.find({})
        .select('name _id')
        .then((categories) => {
            allCategories = categories;
        })
        .catch((err) => {
            console.log(err);
        });
}

// ================================ GET Statements ================================ \\




router.get('/', (req, res) => {
    // If the list hasn't been initialised or it's over a week old, refresh it  w604800000 d86400000 min60000
    if ((!restaurantRefresh) || (new Date() - restaurantRefresh > 60000)) {
        Promise.all([refreshTopRestaurants(), getAllCategories()])
            .then(() => {
                renderPage();
            })
            .catch((err) => {
                console.log(`CATCH ${err}`);
            });
    } else {
        getAllCategories()
            .then(() => {
                renderPage();
            })
            .catch((err) => {
                console.log(`CATCH ${err}`);
            });
    }

    function renderPage() {
        res.render('index', {
            title: title,
            user: req.user,
            indexPage: true,
            restaurants: topRestaurants,
            allCategories: allCategories
        });
    }
});

router.get('/no-login', (req, res) => {
    // If the list hasn't been initialised or it's over a week old, refresh it  w604800000 d86400000 min60000
    if ((!restaurantRefresh) || (new Date() - restaurantRefresh > 60000)) {
        Promise.all([refreshTopRestaurants(), getAllCategories()])
            .then(() => {
                renderPage();
            })
            .catch((err) => {
                console.log(`CATCH ${err}`);
            });
    } else {
        getAllCategories()
            .then(() => {
                renderPage();
            })
            .catch((err) => {
                console.log(`CATCH ${err}`);
            });
    }

    function renderPage() {
        res.render('index', {
            title: title,
            user: req.user,
            indexPage: true,
            restaurants: topRestaurants,
            allCategories: allCategories,
            denied: true
        });
    }
});

router.get('/about', (req, res) => {
    res.render('about', {title: title, user: req.user});
});

router.get('/accessibility', (req, res) => {
    res.render('accessibility', {title: title, user: req.user});
});

router.get('/offline', (req, res) => {
    res.render('errors/offline', {title: title, user: req.user});
});

router.get('/contact', (req, res) => {
    res.render('contact', {title: title, user: req.user});
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('back');
});

/**
 * Send the list of Category objects to the new restaurant page to add options to the Category picker
 * @param {Object} req  The client request object containing the body of info
 * @param {Object} res The client response object to be sent with render info
 * @function loadNewRestaurantPage
 */
router.get('/restaurant/new', (req, res) => {
    if (!allCategories) {
        getAllCategories()
            .then(() => {
                renderPage();
            })
            .catch((err) => {
                res.render('errors/500', {title: title, user: req.user});
                console.log(err);
            })
    } else {
        renderPage();
    }

    function renderPage() {
        const tempRestaurant = new Restaurant;
        res.render('restaurant_new', {
            title: title,
            user: req.user,
            allCategories: JSON.stringify(allCategories),
            features: tempRestaurant.features
        });
    }

});

/**
 * Get the Restaurant object from the DB and send all attributes to client for displaying and editing
 * @param {Object} req The client request object containing the body of info
 * @param {Object} res The client response object to be sent with render info
 * @function loadEditRestaurantPage
 */
router.get('/restaurant/edit/:_id', (req, res) => {
    Restaurant.findById(req.params._id)
        .lean()
        .exec()
        .then((restaurant) => {
            if (!allCategories) {
                getAllCategories()
                    .then(() => {
                        renderIfUser(restaurant);
                    })
                    .catch((err) => {
                        res.render('errors/500', {title: title, user: req.user});
                        console.log(err);
                    });
            } else {
                renderIfUser(restaurant);
            }
        })
        .catch((err) => {
            res.render('errors/500', {title: title, user: req.user});
            console.log(err);
        });

    /**
     * Check the user is logged in/authorised and then render the page
     * @param restaurant - the restaurant object being edited
     */
    function renderIfUser(restaurant) {
        if (req.user && restaurant.creator._id === req.user._id) {
            res.render('restaurant_edit', {
                title: title,
                user: req.user,
                restaurant: restaurant,
                allCategories: JSON.stringify(allCategories)
            });
        } else {
            res.render('errors/403', {title: title, user: req.user});
        }
    }
});

/**
 * Dynamically load the Restaurant information when the URL is loaded
 * Send the Restaurant's Review objects to the client as well for dynamic display
 * @param {Object} req  The client request object containing the body of info
 * @param {Object} res The client response object to be sent with restaurant info
 * @function loadRestaurantPage
 */
router.get('/restaurant/:url', (req, res) => {
    Restaurant.findOne({localUrl: req.params.url})
        .lean()
        .exec()
        .then((restaurant) => {
            if (restaurant.published) {
                const reviewIdList = restaurant.reviews;
                let reviewList = [];
                let reviewPromises = [];

                for (id of reviewIdList) {
                    reviewPromises.push(Review.findOne({_id: id})
                        .then((review) => {
                            reviewList.push(review);
                        })
                        .catch((err) => {
                            console.log(`Error fetching review: ${err}`);
                        }));
                }

                Promise.all(reviewPromises)
                    .then(() => {
                        res.render('restaurant', {
                            title: title,
                            user: req.user,
                            restaurant: restaurant,
                            reviews: reviewList
                        });
                    })
                    .catch(() => {
                        res.render('errors/404', {title: title, user: req.user});
                    })
            } else {
                res.render('errors/404', {title: title, user: req.user});
            }
        })
        .catch((err) => {
            console.log(`Restaurant error: ${err}`);
            res.render('errors/404', {title: title, user: req.user});
        });
});

router.get('/restaurants-nearby', (req, res) => {
    res.render('restaurants_nearby', {title: title, user: req.user});
});

router.get('/search', (req, res) => {
    const tempRestaurant = new Restaurant;

    let featureArray = [];
    for (const key of Object.keys(tempRestaurant.features)) {
        let value = tempRestaurant.features[key].name;
        featureArray.push({id: key, name: value})
    }
    res.render('search', {
        title: title,
        user: req.user,
        allCategories: allCategories,
        features: featureArray,
        searchPage: true
    });
});

router.get('/signup', (req, res) => {
    res.render('signup', {title: title, user: req.user});
});

router.get('/user/:_id', (req, res) => {
    if ((req.user) && (req.user.reducedID === req.params._id)) {
        let restaurantList = [];
        let childrenPromises = [];
        let reviewList = [];

        for (id of req.user.restaurants.created) {
            childrenPromises.push(Restaurant.findOne({_id: id})
                .then((restaurant) => {
                    restaurantList.push(restaurant);
                })
                .catch((err) => {
                    console.log(`Error fetching restaurant: ${err}`);
                }));
        }

        for (id of req.user.reviews) {
            childrenPromises.push(Review.findOne({_id: id})
                .then((review) => {
                    reviewList.push(review);
                })
                .catch((err) => {
                    console.log(`Error fetching review: ${err}`);
                }));
        }

        Promise.all(childrenPromises)
            .then(() => {
                return res.render('user_manager', {
                    title: title,
                    user: req.user,
                    reviews: reviewList,
                    restaurants: restaurantList
                });
            })
            .catch((err) => {
                console.log(err);
                return res.render('errors/404', {title: title, user: req.user});
            });
    } else {
        res.render('errors/403', {title: title, user: req.user});
    }
});

/**
 * Dynamic URL routing for verifying Users when they click on the link in the verification email
 * Whe the page is loaded, the verification flag is updated in the database and the hash is removed from the User
 * If the hash is not in the database, the User is shown an error
 * @param {Object} req  The client request object containing the body of info
 * @param {Object} res The client response object to be sent with render info
 * @function verifyUser
 */
router.get('/verify-user/:hash', (req, res) => {
    User.findOne({'verified.hash': req.params.hash}, (err, user) => {
        if (err) {
            console.log(err);
        }

        if (!user) {
            console.log('No user');
            res.render('user-verification', {title: title, user: req.user, verified: false});
        } else {
            User.update({'verified.hash': req.params.hash}, {
                'verified.flag': true,
                'verified.hash': undefined
            }, (err) => {
                if (err) {
                    console.log(`Error: ${err}`);
                    res.render('user_verification', {title: title, user: req.user, verified: false});
                }
            });
            res.render('user_verification', {title: title, user: req.user, verified: true});
        }
    });
});

// ================================ POST Statements ================================ \\

/**
 * When the User attempts to log in, the Passport configuration ensures that their password is correct and starts a
 * User login session
 * @param {Object} req  The client request object containing the body of info
 * @param {Object} res The client response object to be sent with render info
 * @param {function} next The next step in running the server
 * @function userLogin
 */
router.post('/login', (req, res, next) => {
    passport.authenticate('login-local', (err, user) => {
        if (err) {
            console.log(err);
            next();
        }
        if (!user) {
            return res.redirect('/no-login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('back');
        });
    })(req, res, next);
});

/**
 * Sends a verification email to the User when a POST request is sent to /verify_email from any page
 * @param {Object} req  The client request object containing the body of info
 * @param {Object} res The client response object to be sent with render info
 * @function verifyEmail
 */
router.post('/verify_email', (req, res) => {
    // Check user is logged in in case session expires and then they click the link
    if (req.user) {
        User.findOne({_id: req.user._id}, (err, user) => {
            user.sendVerificationEmail();
            res.send(true);
        });
    }
});

refreshTopRestaurants().catch((err) => {
    console.log(err);
});
getAllCategories().catch((err) => {
    console.log(err);
});

module.exports = router;