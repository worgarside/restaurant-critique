/**
 * Definition of the Restaurant mongoose Schema
 * A Restaurant is an object which holds all the data about a Restaurant to be shown on the website
 * Can be edited by Restaurant owners and administrators. Submitted by verified Users
 * @author Will Garside, Greta Ramaneckaite
 */

// ================ Middleware ================ \\

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ================ Review Schema Definition ================ \\

ReviewSchema = Schema({
    restaurantID: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    author: {
        forename: String,
        surname: String,
        displayImage: String
    },
    images: {type: [String], default: []},
    restaurantRating: {type: Number, min: 0, max: 5, required: true},
    reviewRating: {type: Number, default: 0},
    updatedAt: Date
});

ReviewSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Review', ReviewSchema);