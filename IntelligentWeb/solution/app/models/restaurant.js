const mongoose = require('mongoose'), Schema = mongoose.Schema;
const fs = require('fs');

RestaurantSchema = Schema({
    name: {type: String, required: true, index: true},
    wholeAddress: String,
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
    distance: Number,
    url: {type: String, trim: true},
    menu: {type: String, trim: true},
    phone: {type: String, trim: true},
    opening_times: Array,
    description: {type: String, trim: true},
    price_range: Number,
    categories: {type: [String], default: []}, //TODO: turn this into type: [Category] so we can display the name, not the ID
    features: {
        parking: Boolean,
        wifi: Boolean,
        takeout: Boolean,
        delivery: Boolean,
        outdoor_seating: Boolean,
        reservations: Boolean,
        alcohol: Boolean,
    },
    owner_id: {type: String, trim: true},
    owner_message: {type: String, trim: true},
    reviews: {type: [String], default: []},
    images: {type: [String], default: []},
    average_rating: {type: Number, min: 0, max: 5},
    published: {type: Boolean, required: true},
    updated_at: Date
});

// RestaurantSchema.virtual('formattedAddress').get(function () {
//     return  ;
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

    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
        fs.closeSync(fs.openSync(`${imageDir}/.keep`, 'w'));
    }


    // TODO: loop through address object instead
    this.address.formattedAddress = '';

    if (this.address.line1){
        this.address.formattedAddress += this.address.line1;
    }

    if (this.address.line2){
        this.address.formattedAddress += ', ';
        this.address.formattedAddress += this.address.line2;
    }

    if (this.address.city){
        this.address.formattedAddress += ', ';
        this.address.formattedAddress += this.address.city;
    }

    if (this.address.postcode){
        this.address.formattedAddress += ', ';
        this.address.formattedAddress += this.address.postcode;
    }

    next();
});

mongoose.model('Restaurant', RestaurantSchema);