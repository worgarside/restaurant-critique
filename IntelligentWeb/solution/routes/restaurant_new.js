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
const crypto = require('crypto');
const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const fs = require('fs');
const dateFormat = require('dateformat');
const title = 'Restaurant Critique';

const multer = require('multer');
router.use(bodyParser.urlencoded({extended: true}));

/**
 * Use multer middleware to save the Restaurant's images to the correct directory
 * Also sets the images' filenames
 */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/images/temp_images');
    },
    filename: (req, file, callback) => {
        const re = /(?:\.([^.]+))?$/;
        const extension = `.${re.exec(file.originalname)[1]}`;
        const filename = crypto.randomBytes(20).toString('hex');
        callback(null, filename + extension);
    }
});

const upload = multer({storage: storage});

// ================ POST Method ================ \\


/**
 * Configures and adds a new Restaurant object to the database when a form is submitted
 * Also adds the Restaurant ID to the creator's restaurants attribute
 *
 * @param {{monOpen:int, tueOpen:int, wedOpen:int, thuOpen:int, friOpen:int, satOpen:int, sunOpen:int, monClose:int,
  * tueClose:int, wedClose:int, thuClose:int, friClose:int, satClose:int, sunClose:int, restaurantName: string,
  * priceRange: string, address1:String, address2:String, priceLower:int, priceUpper:int, priceBand:int
  * }} body. The values from the input form used in setting the attributes of the Restaurant
 * @function addNewRestaurant
 */
router.post('/add_restaurant', upload.array('images', 10), (req, res) => {
    const body = req.body;
    const creator = req.user;
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

    // Process the images before the restaurant is saved to add their paths to the objects attributes
    processImages(req.files, newRestaurant);

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

        if (newRestaurant.published){
            const localUrl = `${newRestaurant.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}-${newRestaurant.address.postcode.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
            res.redirect(`/restaurant/${localUrl}`);
        }else{
            res.redirect(`/user/${req.user._id}`);
        }
    }).catch((err) => {
        console.log(`Error in saving restaurant: ${err}`);
        res.render('errors/restaurant_new_fail', {title: title, user: req.user});
    });
});

// TODO check this is used and jsdoc
router.post('/verify_email', (req, res) => {
    User.findOne({_id: req.user._id}, (err, user) => {
        user.sendVerificationEmail();
        res.send(true);
    });
});

// TODO jsdoc
function processImages(images, newRestaurant){
    const imageDir = `./public/images/restaurants/${newRestaurant._id}`;
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
    }

    const re = /(?:\.([^.]+))?$/;
    const now = dateFormat(new Date(), "yyyy-mm-dd HH-MM-ss");
    let imageCount = 0;
    let imageArray = [];

    images.forEach((image)=>{
        const extension = `.${re.exec(image.path)[1]}`;
        const filename = `${now}_${imageCount}${extension}`;
        const destination = `${imageDir}/${filename}`;
        fs.rename(image.path, destination);
        imageCount ++;
        imageArray.push(filename);
    });

    newRestaurant.images = imageArray;
}

module.exports = router;
