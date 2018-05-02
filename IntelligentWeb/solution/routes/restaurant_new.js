/**
 * Routing file for new Restaurants
 * Manages the insertion of a new Restaurant to the database, as well as saving any images to the correct
 * directory
 * @author Will Garside, Rufus Cope
 * @param req.body.restaurantName the name of the Restaurant added, used in setting the name of the image
 */

// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');

const multer = require('multer');
router.use(bodyParser.urlencoded({extended: true}));

/**
 * Use multer middleware to save the Restaurant's images to the correct directory
 * Also sets the images' filenames
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/restaurant');
    },
    filename: (req, file, callback) => {
        const re = /(?:\.([^.]+))?$/;
        const extension = `.${re.exec(file.originalname)[1]}`;
        callback(null, req.body.restaurantName.replace(/[^a-zA-Z]/g, "-") + extension);
    }
});

const upload = multer({storage: storage});

// ================ POST Method ================ \\


/**
 * Configures and adds a new Restaurant object to the database when a formis submitted
 * Also adds the Restaurant ID to the creator's restaurants attribute
 *
 * @param {{monOpen:int, tueOpen:int, wedOpen:int, thuOpen:int, friOpen:int, satOpen:int, sunOpen:int, monClose:int,
  * tueClose:int, wedClose:int, thuClose:int, friClose:int, satClose:int, sunClose:int, restaurantName: string,
  * priceRange: string, address1:String, address2:String, priceLower:int, priceUpper:int, priceBand:int
  * }} body The values from the input form used in setting the attributes of the Restaurant
 *
 * @function addNewRestaurant
 */
router.post('/add_restaurant', upload.single('displayPicture'), (req, res) => {
    const body = req.body;
    const creator = JSON.parse(body.user);
    let published = false;

    if (body.verified) {
        published = !!body.published;
    }

    const openingTimes = [
        [body.monOpen, body.monClose],
        [body.tueOpen, body.tueClose],
        [body.wedOpen, body.wedClose],
        [body.thuOpen, body.thuClose],
        [body.friOpen, body.friClose],
        [body.satOpen, body.satClose],
        [body.sunOpen, body.sunClose]
    ];

    let categoryList = [];

    if (body.categories) {
        for (const category of JSON.parse(body.categories)) {
            categoryList.push(category);
        }
    }

    let newRestaurant = new Restaurant({
        _id: mongoose.Types.ObjectId(),
        name: body.restaurantName,
        address: {
            line1: body.address1,
            line2: body.address2,
            city: body.city,
            postcode: body.postcode,
            latitude: body.lat,
            longitude: body.lng,
        },
        url: body.url,
        menu: body.menu,
        phone: body.phone,
        openingTimes: openingTimes,
        description: body.description,
        priceRange: {lower: body.priceLower, upper: body.priceUpper, band: body.priceBand},
        categories: categoryList,
        creator: creator,
        published: published
    });

    for (let key of Object.keys(newRestaurant.features)) {
        if (parseInt(body[key]) !== 1) {
            newRestaurant.features[key].value = parseInt(body[key]) === 2;
        }
    }

    newRestaurant.save().then(() => {
        console.log("Restaurant added to collection");

        // Add the Restaurant ID to the User's attribute
        User.findByIdAndUpdate(
            creator._id,
            {$push: {'restaurants.created': newRestaurant._id}},
            (err) => {
                if (err) {
                    console.log(`Error: ${err}`);
                }

            });
    }).catch((err) => {
        console.log(`Restaurant failed to add to collection: ${err}`);
    });

    res.redirect('/')
});

router.post('/verify_email', (req, res) => {
    User.findOne({_id: req.user._id}, (err, user) => {
        user.sendVerificationEmail();
        res.send(true);
    });
});

module.exports = router;
