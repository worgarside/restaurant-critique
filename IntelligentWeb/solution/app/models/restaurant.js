// ================ Middleware ================ \\

const mongoose = require('mongoose'), Schema = mongoose.Schema;
const fs = require('fs');
const CategorySchema = mongoose.model('Category').schema;

// ================ Restaurant ================ \\

RestaurantSchema = Schema({
    name: {type: String, required: true, index: true},
    address: {
        line1: {type: String, required: true},
        line2: {type: String, trim: true},
        city: {type: String, trim: true},
        postcode: {type: String, trim: true, required: true},
        formattedAddress: String
    },
    location: {
        type: {type: String},
        coordinates: [Number]
    },
    latitude: {type: Number, min: -90, max: 90, default: 90},
    longitude: {type: Number, min: -180, max: 180, default: 180},
    url: {type: String, trim: true},
    menu: {type: String, trim: true},
    phone: {type: String, trim: true}, //TODO: restaurant email address for contact purposes as well as phone??
    opening_times: Array,
    description: {type: String, trim: true, default: 'No description currently available.'},
    price_range: Number,
    categories: [CategorySchema],
    features: {
        parking: Boolean,
        wifi: Boolean,
        takeout: Boolean,
        delivery: Boolean,
        outdoor_seating: Boolean,
        reservations: Boolean,
        alcohol: Boolean,
        vegetarian: Boolean,
        vegan: Boolean,
    },
    owner_id: {type: String, trim: true},
    owner_message: {type: String, trim: true},
    reviews: {type: [String], default: []},
    images: {type: [String], default: []}, //TODO: only show top 5 images on nearby page?
    average_rating: {type: Number, min: 0, max: 5},
    published: {type: Boolean, default: true},
    updated_at: Date
});

RestaurantSchema.pre('save', function (next) {
    if ((this.latitude) && (this.longitude)) {
        this.location = {
            "type": "Point",
            "coordinates": [this.longitude, this.latitude] // long THEN lat, according to geoJSON standards
        };
    }
    this.updated_at = Date.now();

    const imageDir = `./public/images/restaurants/${this._id}`;

    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
    }

    this.address.postcode = this.address.postcode.toUpperCase();

    this.address.formattedAddress = '';
    const restaurant = this.toJSON();
    Object.values(restaurant.address).forEach((element, index, objectValues) => {
        if (element) {
            this.address.formattedAddress += element;
            if (objectValues[index + 1]) {
                this.address.formattedAddress += ', ';
            }
        }
    });

    next();
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);