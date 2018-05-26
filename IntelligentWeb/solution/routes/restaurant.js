/**
 * Routing file for new Review upload on restaurant page
 * Management of inserting new Review to the database and rerouting back to the page with review displayed
 * @author Greta Ramaneckaite, Rufus Cope
 */

// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const dateFormat = require('dateformat');
const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Review = mongoose.model('Review');

router.use(bodyParser.urlencoded({extended: true}));

// ================================ POST Method ================================ \\



// TODO jsdoc
function processImages(imageArray, restaurantId) {
    const now = dateFormat(new Date(), 'yyyy-mm-dd HH-MM-ss');
    const targetDirectory = `./public/images/restaurants/${restaurantId}/`;

    if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory);
    }

    let imageNames = [];

    for (let i = 0; i < imageArray.length - 1; i++) {
        let image = imageArray[i];
        // strip off the data: url prefix to get just the base64-encoded bytes
        let imageBlob = image.replace(/^data:image\/\w+;base64,/, '');
        let buf = new Buffer(imageBlob, 'base64');
        const imageName = `${now}_${i}.png`;
        const filePath = targetDirectory + imageName;

        fs.writeFile(filePath, buf, (err) => {
            if (err) throw err;
        });

        imageNames.push(imageName);
    }

    console.log(`Saved ${imageNames.length} images`);
    return imageNames;
}

 const returnFunction = function (io) {
    // io.on('connection', (socket) => {
    //     socket.on('chat message', (msg) => {
    //         console.log(`Message received: ${msg}`);
    //         io.emit('chat message', msg);
    //     });
    // });

     router.post('/submit_review', (req, res) => {
         console.log(`Review:
    Title: ${req.body.title}
    Rating: ${req.body.rating}
    Body: ${req.body.body}
    Restaurant: ${req.body.restaurantId}  
    User: ${req.user._id}
    imageBlob.length: ${req.body['imageBlob[]'].length}
    `);

         let review = new Review({
             restaurant: {
                 _id: req.body.restaurantId
             },
             title: req.body.title,
             body: req.body.body,
             author: {
                 forename: req.user.name.first,
                 surname: req.user.name.last,
                 reducedID: req.user.reducedID
             },
             restaurantRating: req.body.rating,
         });

         const reviewImages = processImages(req.body['imageBlob[]'], req.body.restaurantId);
         review.images = reviewImages;

         review.save()
             .then(() => {
                 console.log('Review added to collection');

                 // Add the Restaurant ID to the User's attribute
                 User.findByIdAndUpdate(
                     req.user._id,
                     {$push: {reviews: review._id.toString()}},
                     (err) => {
                         if (err) {
                             console.log(`User error: ${err}`);
                         } else {
                             console.log('User fields updated');
                         }
                     });
                 Restaurant.findOne({_id: req.body.restaurantId})
                     .then((restaurant) => {
                         const reviewCount = restaurant.reviews.length;
                         const oldRating = restaurant.averageRating;
                         const newRating = ((oldRating * reviewCount) + review.restaurantRating) / (reviewCount + 1);

                         Restaurant.findByIdAndUpdate(
                             req.body.restaurantId,
                             {
                                 $push: {images: {$each: reviewImages}, reviews: review._id.toString()},
                                 $set: {averageRating: newRating}
                             },
                             (err) => {
                                 if (err) {
                                     console.log(`Restaurant update error: ${err}`);
                                 } else {
                                     console.log('Restaurant fields updated');
                                 }
                             });
                         io.emit('review', review);
                         res.send({success: true});
                     })
                     .catch((err) => {
                         console.log(`Restaurant lookup error: ${err}`);
                     });
             })
             .catch((err) => {
                 console.log(`Error saving review: ${err}`);
                 res.end();
             });
     });

    return router;
};

module.exports = returnFunction;