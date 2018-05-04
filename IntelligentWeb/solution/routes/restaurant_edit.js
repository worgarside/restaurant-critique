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
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyDlmGXTAyXPQy1GX02s8UDm1OLBNz6zia0'
});

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
  * }} body The values from the input form used in setting the attributes of the Restaurant
 * @function addNewRestaurant
 */
router.post('/submit_edit', upload.array('images', 10), (req, res) => {
    const body = req.body;

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

    const tempRestaurant = new Restaurant

    let features = tempRestaurant.features;
    for (let key of Object.keys(tempRestaurant.features)) {
        if (parseInt(body[key]) !== 1) {
            features[key].value = parseInt(body[key]) === 2;
        }
    }

    let latitude = 0;
    let longitude = 0;

    googleMapsClient.geocode({'address': `${body.postcode}, UK`}, (err, response) => {
        if (!err) {
            latitude = response.json.results[0].geometry.location.lat();
            longitude = response.json.results[0].geometry.location.lng();
            console.log(`Lat: ${latitude} & Lng: ${longitude}`);
        } else {
            console.log('Invalid postcode on edit submission. Please try again.');
        }
    });

    const newImageArray = processImages(req.files, req.body.restaurantId);
    const totalImageArray = JSON.parse(body.restaurantImages);
    totalImageArray.push(...newImageArray);

    Restaurant.findByIdAndUpdate(req.body.restaurantId, {
        name: body.restaurantName,
        address: {
            line1: body.address1,
            line2: body.address2,
            city: body.city,
            postcode: body.postcode,
            latitude: latitude,
            longitude: longitude,
        },
        contact: {
            url: body.url,
            menu: body.menu,
            phone: body.phone
        },
        openingTimes: openingTimes,
        description: body.description,
        priceRange: {lower: body.priceLower, upper: body.priceUpper, band: body.priceBand},
        features: features,
        images: totalImageArray,
        categories: categoryList,
        published: published
    }, {new: true})
        .exec()
        .then((restaurant) => {
            if (published) {
                res.redirect(`/restaurant/${restaurant.localUrl}`);
            } else {
                res.redirect(`/user/${req.user.reducedID}`);
            }
        })
        .catch((err) => {
            console.log(`Error: ${err}`);
            res.render('errors/500', {title: title, user: req.user});
        });
});

// TODO jsdoc
function processImages(images, restaurantId) {
    const imageDir = `./public/images/restaurants/${restaurantId}`;
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
    }

    const re = /(?:\.([^.]+))?$/;
    const now = dateFormat(new Date(), "yyyy-mm-dd HH-MM-ss");
    let imageCount = 0;
    let imageArray = [];

    images.forEach((image) => {
        const extension = `.${re.exec(image.path)[1]}`;
        const filename = `${now}_${imageCount}${extension}`;
        const destination = `${imageDir}/${filename}`;
        fs.rename(image.path, destination);
        imageCount++;
        imageArray.push(filename);
    });

    return imageArray;
}

module.exports = router;
