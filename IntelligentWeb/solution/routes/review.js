// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
// const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Review = mongoose.model('Review');

router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Method ================ \\

console.log('review route file loaded');

router.post('/add_review', (req, res) => {

    let newReview = new Review({
        // restaurant: {
        //     _id: ,
        //     name: ,
        // },
        author: {
            forename: req.user.name.first,
            surname: req.user.name.last,
            reducedID: req.user.reducedID,
        },
        reviewRating: 0,
        title: req.body.title,
        body: req.body.body,
        restaurantRating: req.body.star,
    });

    newReview.save().then(() => {
        console.log("Review added to collection");

        // Add the Review ID to the User's attribute
        User.findByIdAndUpdate(
            creator._id,
            {$push: {'reviews.created': newReview._id}},
            (err) => {
                if (err) {
                    console.log(`Error: ${err}`);
                }
            });

    }).catch((err) => {
        console.log(`Review failed to add to collection: ${err}`);
        res.render('/errors/review_new_fail')
    });

    // res.redirect(`/restaurant/${req.body.restaurant.localUrl}`);
    res.redirect(`/`);
});

module.exports = router;