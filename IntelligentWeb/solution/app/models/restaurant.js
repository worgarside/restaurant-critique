const mongoose = require('mongoose'), Schema = mongoose.Schema;
const fs = require('fs');

RestaurantSchema = Schema({
    name: {type: String, required: true, index: true},
    address1: {type: String, required: true},
    address2: {type: String, trim: true},
    city: {type: String, trim: true},
    postcode: {type: String, trim: true},
    location: {
        type: {type: String},
        coordinates: [Number]
    },
    latitude: {type: Number, min: -90, max: 90, default: 90},
    longitude: {type: Number, min: -180, max: 180, default: 180},
    url: {type: String, trim: true},
    menu: {type: String, trim: true},
    phone: {type: String, trim: true},
    opening_times: Array,
    description: {type: String, trim: true},
    price_range: Number,
    category: [String],
    parking: Boolean,
    wifi: Boolean,
    takeout: Boolean,
    delivery: Boolean,
    outdoor_seating: Boolean,
    reservations: Boolean,
    alcohol: Boolean,
    owner_id: {type: String, trim: true},
    owner_message: {type: String, trim: true},
    reviews: [String],
    images: [String],
    average_rating: {type: Number, min: 0, max: 5},
    published: {type: Boolean, required: true},
    updated_at: Date
});

// RestaurantSchema.virtual('location').get(function () {
//     return [this.latitude, this.longitude];
// });

RestaurantSchema.pre('save', function (next) {
    if ((this.latitude) && (this.longitude)) {
        this.location = {
            "type": "Point",
            "coordinates": [this.longitude, this.latitude] // long THEN lat, according to geoJSON standards
        };
    }
    this.updated_at = Date.now();

    const imageDir = `./public/images/restaurants/${this._id}`;

    if (!fs.existsSync(imageDir)){
        fs.mkdirSync(imageDir);
        fs.closeSync(fs.openSync(`${imageDir}/.keep`, 'w'));
    }

    next();
});

mongoose.model('Restaurant', RestaurantSchema);