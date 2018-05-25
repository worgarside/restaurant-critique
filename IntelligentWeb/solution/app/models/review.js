/**
 * Definition of the Restaurant mongoose Schema
 * A Restaurant is an object which holds all the data about a Restaurant to be shown on the website
 * Can be edited by Restaurant owners and administrators. Submitted by verified Users
 * @author Will Garside, Greta Ramaneckaite
 */

// ================ Middleware ================ \\

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Restaurant = mongoose.model('Restaurant');

// ================ Review Schema Definition ================ \\

ReviewSchema = Schema({
    restaurant: {
        _id: {type: String, required: true},
        name: {type: String},
        localUrl: {type: String}
    },
    title: {type: String, required: true},
    body: {type: String, required: true},
    author: {
        forename: String,
        surname: String,
        reducedID: String
    },
    images: {type: [String], default: []},
    restaurantRating: {type: Number, min: 0, max: 5, required: true},
    reviewRating: {type: Number, default: 0},
    updatedAt: Date
});

ReviewSchema.pre('save', function (next) {
    Restaurant.findOne({_id: this.restaurant._id})
        .then((restaurant) => {
            this.restaurant.name = restaurant.name;
            this.restaurant.localUrl = restaurant.localUrl;
            this.updatedAt = Date.now();
            next();
        })
        .catch((err) => {
            console.log(`Unable to get Restaurant (ID ${this.restaurant._id}) details: ${err}`);
            this.updatedAt = Date.now();
            next();
        });
});

module.exports = mongoose.model('Review', ReviewSchema);