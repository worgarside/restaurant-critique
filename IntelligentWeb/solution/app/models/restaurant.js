var mongoose = require('mongoose'), Schema = mongoose.Schema;

RestaurantSchema = Schema({
    name: {type: String, required: true, index: true},
    address1: {type: String, required: true},
    address2: {type: String, trim: true},
    city: {type: String, trim: true},
    postcode: {type: String, trim: true},
    location: {
        type: {type: String},
        coordinates: [Number],
    },
    latitude: {type: Number, min: -90, max: 90, required: true},
    longitude: {type: Number, min: -180, max: 180, required: true},
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
    average_rating: {type: Number, min: 0, max: 5},
    published: {type: Boolean, required: true}
});

// RestaurantSchema.virtual('location').get(function () {
//     return [this.latitude, this.longitude];
// });

RestaurantSchema.pre('save', function (next) {
    var restaurant = this;

    restaurant.location = {
        "type": "Point",
        "coordinates": [this.longitude, this.latitude] // long THEN lat, according to geoJSON standards
    };

    next();
});

mongoose.model('Restaurant', RestaurantSchema);