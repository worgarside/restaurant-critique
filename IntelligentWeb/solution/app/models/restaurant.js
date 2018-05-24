/**
 * Definition of the Restaurant mongoose Schema
 * A Restaurant is an object which holds all the data about a Restaurant to be shown on the website
 * Can be edited by Restaurant owners and administrators. Submitted by verified Users
 * @author Will Garside
 */

// ================ Middleware ================ \\

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');
const Category = mongoose.model('Category');
const CategorySchema = Category.schema;
const nodemailer = require(`${appRoot}/config/nodemailer`);

// ================ Restaurant Schema Definition ================ \\

RestaurantSchema = Schema({
    name: {type: String, required: true},
    address: {
        line1: {type: String, required: true},
        line2: {type: String, trim: true},
        city: {type: String, trim: true},
        postcode: {type: String, trim: true, required: true},
        formattedAddress: {type: String, searchable: true},
        latitude: {type: Number, min: -90, max: 90, default: 90},
        longitude: {type: Number, min: -180, max: 180, default: 180}
    },
    location: {
        type: {type: String},
        coordinates: [Number]
    },
    contact: {
        url: {type: String, trim: true},
        menu: {type: String, trim: true},
        phone: {type: String, trim: true}
    },
    localUrl: {type: String, unique: true},
    openingTimes: Array,
    description: {type: String, default: 'No description currently available.'},
    priceRange: {
        lower: Number,
        upper: Number,
        band: {
            type: Number,
            min: 0,
            max: 3
        }
    },
    categories: {type: [CategorySchema]},
    // Features are boolean attributes, with friendly names set with default values
    features: {
        alcohol: {name: {type: String, default: 'Alcohol'}, value: Boolean},
        americanExpress: {name: {type: String, default: 'Accepts Amex'}, value: Boolean},
        creditCard: {name: {type: String, default: 'Accepts Credit Cards'}, value: Boolean},
        delivery: {name: {type: String, default: 'Delivery'}, value: Boolean},
        highchairs: {name: {type: String, default: 'Highchairs Available'}, value: Boolean},
        glutenFree: {name: {type: String, default: 'Gluten Free Options'}, value: Boolean},
        mastercard: {name: {type: String, default: 'Accepts Mastercard'}, value: Boolean},
        outdoorSeating: {name: {type: String, default: 'Outdoor Seating'}, value: Boolean},
        parking: {name: {type: String, default: 'Dedicated Parking'}, value: Boolean},
        reservations: {name: {type: String, default: 'Reservations'}, value: Boolean},
        seating: {name: {type: String, default: 'Seating'}, value: Boolean},
        tableService: {name: {type: String, default: 'Table Service'}, value: Boolean},
        takeout: {name: {type: String, default: 'Takeout'}, value: Boolean},
        vegetarian: {name: {type: String, default: 'Vegetarian Options'}, value: Boolean},
        vegan: {name: {type: String, default: 'Vegan Options'}, value: Boolean},
        visa: {name: {type: String, default: 'Accepts Visa'}, value: Boolean},
        wheelchairAccessible: {name: {type: String, default: 'Wheelchair Accessible'}, value: Boolean},
        wifi: {name: {type: String, default: 'Free WiFi'}, value: Boolean}
    },
    creator: { // These are of type User, but only some fields - db is not relational
        _id: {type: String, required: true},
        name: {first: String, last: String},
    },
    owner: { // These are of type User, but only some fields - db is not relational
        _id: String,
        name: {first: String, last: String}
    },
    ownerMessage: {type: String},
    reviews: {type: [String], default: []},
    images: {type: [String], default: []},
    averageRating: {type: Number, min: 0, max: 5, default: 0},
    published: {type: Boolean, default: true},
    updatedAt: Date,
    // Searchable object used to improve search effectiveness
    searchable: {
        all: String,
        name: String,
        description: String,
        formattedAddress: String,
        categoryString: String
    }
});

RestaurantSchema.pre('save', function (next) {
    updateDetails(this);

    const imageDir = `./public/images/restaurants/${this._id}`;
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
    }

    // Don't send an email if the database is being generated to avoid spam
    if (!dbRegen) {
        emailCreator(this);
    }

    next();
});

RestaurantSchema.pre('findOneAndUpdate', function (next) {
    updateDetails(this._update);
    next();
});

/**
 * Send a confirmation email to the creator upon Restaurant creation. Uses nodemailer configuration template
 * @param {Restaurant} restaurant: the Restaurant object which has been created
 */
function emailCreator(restaurant) {
    const to = restaurant.creator._id;
    const subject = 'Restaurant creation confirmation';
    const body = `
        <p>${restaurant.creator.name.first} ${restaurant.creator.name.last},</p>
        <p>This is your confirmation email for creating ${restaurant.name} at ${restaurant.address.postcode} on <a href="www.restaurantcritique.com">Restaurant Critique.</a></p>
        <p>Thank you for contributing to the community!</p>
        <p>Please note your submission may take up to 24 hours to appear on the website, if you do not see it after this time <strong>do not</strong> re-submit it. Instead please contact us <a href="www.restaurantcritique.com/contact">here</a>.</p>
    `;
    nodemailer.sendEmail(to, subject, body);
}

// TODO: jsdoc
function updateDetails(restaurant) {
    if (restaurant.address) {
        if ((restaurant.address.latitude) && (restaurant.address.longitude)) {
            restaurant.location = {
                type: "Point",
                coordinates: [restaurant.address.longitude, restaurant.address.latitude] // long THEN lat, according to geoJSON standards
            };
        }

        // Format the address fields to site-wide standards, and create formattedAddress field for nicer outputs
        restaurant.address.postcode = restaurant.address.postcode.toUpperCase();
        restaurant.address.formattedAddress = '';
        const addressComponents = ['line1', 'line2', 'city', 'postcode'];
        Object.keys(restaurant.address).forEach((key, index, keys) => {
            const value = restaurant.address[key];
            if (value && addressComponents.includes(key)) {
                restaurant.address.formattedAddress += value;
                if (addressComponents.includes(keys[index + 1])) {
                    restaurant.address.formattedAddress += ', ';
                }
            }
        });

        if (restaurant.name) {
            restaurant.localUrl = `${restaurant.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}-${restaurant.address.postcode.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
        }

    }

    if (restaurant.categories) {
        // Save all new categories on creation - although this is currently only used on db_regen
        for (const category of restaurant.categories) {
            new Category(category).save().catch((err) => {
                if (!err.errmsg.includes('duplicate key')) {
                    console.log(err.errmsg);
                }
            })
        }
    }

    if (restaurant.name && restaurant.description && restaurant.address && restaurant.categories) {
        // TODO add stemming and stoplist
        // Searchable data has all special characters removed
        restaurant.searchable.name = restaurant.name.replace(/[^\w\s]/, '');
        restaurant.searchable.description = restaurant.description.replace(/[^\w\s]/, '');
        restaurant.searchable.formattedAddress = restaurant.address.formattedAddress.replace(/[^\w\s]/, '');
        restaurant.searchable.categoryString = '';
        for (const category of restaurant.categories) {
            restaurant.searchable.categoryString += `${category.name} `;
        }
        restaurant.searchable.all = `${restaurant.searchable.name} ${restaurant.searchable.description} ${restaurant.searchable.formattedAddress} ${restaurant.searchable.categoryString}`;
    }
    restaurant.updatedAt = Date.now();
}

module.exports = mongoose.model('Restaurant', RestaurantSchema);