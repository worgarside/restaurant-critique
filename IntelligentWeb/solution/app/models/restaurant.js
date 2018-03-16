var mongoose = require('mongoose'), Schema = mongoose.Schema;

RestaurantSchema = Schema({
    name: {type: String, required: true},
    address1: {type: String, required: true},
    address2: {type: String, trim: true},
    city: {type: String, trim: true},
    postcode: {type: String, trim: true},
    latitude: Number,
    longitude: Number,
    category: Array,
    reviews: Array,
    images: Array,
    average_rating: Number,
    price_range: Number,
    menu_path: {type: String, trim: true},
    description: {type: String, trim: true},
    opening_times: Array,
    url: {type: String, trim: true},
    phone: {type: String, trim: true},
    published: {type: Boolean, required: true},
    delivery: Boolean,
    takeout: Boolean,
    parking: Boolean,
    alcohol: Boolean,
    wifi: Boolean,
    outdoor_seating: Boolean,
    reservations: Boolean,
    owner: {type: String, trim: true},
    owner_message: {type: String, trim: true}
});

RestaurantSchema.virtual('location').get(function () {
    return [this.latitude, this.longitude];
});

mongoose.model('Restaurant', RestaurantSchema);