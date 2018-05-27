/**
 * User signup management, uses passport configuration file
 * @author Will Garside
 */

// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const User = mongoose.model('User');
const Review = mongoose.model('Review');
const Restaurant = mongoose.model('Restaurant');
const multer = require('multer');

router.use(bodyParser.urlencoded({extended: true}));

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/userImages');
    },
    filename: (req, file, callback) => {
        callback(null, req.user.reducedID);
    }
});
const upload = multer({storage: storage});

// ================================ User Details ================================ \\

router.post('/update_name', (req, res) => {
    User.findByIdAndUpdate(req.user._id, {name: req.body.name}, {new: true})
        .then((user) => {
            console.log(`Name updated successfully: '${user.name.first} ${user.name.last}'`);
            res.send(user.name);
        })
        .catch((err) => {
            console.log(err);
            res.send(false);
        });
});

router.post('/update_postcode', (req, res) => {
    User.findByIdAndUpdate(req.user._id, {postcode: req.body.postcode}, {new: true})
        .then(() => {
            console.log(`Postcode updated successfully: '${user.postcode}'`);
            res.send(user.postcode);
        })
        .catch(() => {
            console.log(err);
            res.send(false);
        });
});

router.post('/update_password', (req, res) => {
    User.findOne({_id: req.user._id})
        .then((user) => {
            user.comparePassword(req.body.password.old, (err, matched) => {
                if (err) {
                    console.log(`Error: ${err}`);
                    res.send('0');
                }

                if (matched) {
                    user.password = req.body.password.new;
                    user.save()
                        .then(() => {
                            res.send('1');
                        })
                        .catch((err) => {
                            console.log(`Unable to save user: ${err}`);
                            res.send('2');
                        })
                } else {
                    console.log('oldPassword <> user.password');
                    res.send('0');
                }
            });
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
            res.send('0');
        });
});

router.post('/update_image', upload.single('displayImage'), (req, res) => {
    res.send('');
});

// ================================ Restaurant Controls ================================ \\

router.post('/publish_restaurant', (req, res) => {
    Restaurant.findByIdAndUpdate(req.body.restaurantID, {
        published: true
    }, {new: true})
        .exec()
        .then((restaurant) => {
            const result = {
                success: true,
                url: `/restaurant/${restaurant.localUrl}`
            };
            res.send(result);
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
            const result = {
                success: false,
                url: 'errors/500'
            };

            res.send(result);
        });
});

router.post('/delete_restaurant', (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                'restaurants.created': req.body.restaurantID
            }
        }
    )
        .exec()
        .then(() => {
            Restaurant.findByIdAndRemove(req.body.restaurantID)
                .then(() => {
                    res.send({success: true});
                })
                .catch((err) => {
                    res.send({success: false});
                    console.log(`Restaurant delete error: ${err}`);
                });
        })
        .catch((err) => {
            res.send({success: false});
            console.log(`User $pull error: ${err}`);
        });

});

// ================================ Review Controls ================================ \\

router.post('/delete_review', (req, res) => {
    console.log(`Deleting review ${req.body.reviewID} by ${req.user.reducedID}`);

    Review.findOne({
        _id: req.body.reviewID,
        'author.reducedID': req.user.reducedID
    })
        .then((review) => {
            const restaurantPromise = Restaurant.findByIdAndUpdate(
                review.restaurant._id,
                {
                    $pull: {
                        images: {$in: review.images},
                        reviews: review._id
                    }
                }
            ).exec();

            const userPromise = User.findOneAndUpdate(
                {reducedID: review.author.reducedID},
                {
                    $pull: {
                        reviews: review._id
                    }
                }
            ).exec();

            Promise.all([restaurantPromise, userPromise])
                .then(() => {
                    deleteImages(review.restaurant._id, review.images);

                    review.remove()
                        .then(() => {
                            console.log('Review deleted successfully');
                            res.send(true);
                        }).catch((err) => {
                        console.log(`Review deletion failed: ${err}`);
                        res.send(false);
                    });
                })
                .catch((err) => {
                    console.log(`Document updates failed: ${err}`);
                    res.send(false);
                });
        })
        .catch((err) => {
            console.log(`Review lookup failed: ${err}`);
            res.send(false);
        });
});

// TODO jsdoc
function deleteImages(restaurant, images) {
    const directory = `./public/images/restaurants/${restaurant}/`;

    for (const image of images) {
        const imagePath = directory + image;
        console.log(`Deleting ${imagePath}`);
        fs.unlinkSync(imagePath);
    }
}

module.exports = router;
