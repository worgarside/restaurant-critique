// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Restaurant = mongoose.model('Restaurant');
const Category = mongoose.model('Category');

const multer = require('multer');
router.use(bodyParser.urlencoded({extended: true}));
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

// noinspection JSUnresolvedFunction
router.post('/add_restaurant', upload.single('displayPicture'), (req, res) => {
    /**
     * @param {{monOpen:int, tueOpen:int, wedOpen:int, thuOpen:int, friOpen:int, satOpen:int, sunOpen:int,
         monClose:int, tueClose:int, wedClose:int, thuClose:int, friClose:int, satClose:int, sunClose:int,
         restaurantName: string, priceRange: string, outdoorseating: string}} body,
     */

    const body = req.body;
    const creator = JSON.parse(body.user);



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

    if (body.categories){
        for (const category of JSON.parse(body.categories)) {
            categoryList.push(category);
        }
    }


    let newRestaurant = new Restaurant({
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
        published: true //TODO: add published flag
    });

    for (let key of Object.keys(newRestaurant.features)){
        if (body[key] !== '1'){
            newRestaurant.features[key].value = body[key] === '2'
        }
    }

    newRestaurant.save().then(() => {
        console.log("Restaurant added to collection")
    }).catch((err) => {
        console.log(`Restaurant failed to add to collection: ${err}`)
    });

    /*
        FOR ADDING A NEW REVIEW
        const dateFormat = require('dateformat');
        var now = dateFormat(new Date(), "yyyy-mm-dd HH-MM-ss");

        USE AS IMAGE FILENAME
     */
    res.redirect('/')
});

module.exports = router;
