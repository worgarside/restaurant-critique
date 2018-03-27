// ================ Middleware ================ \\

const mongoose = require('mongoose'), Schema = mongoose.Schema;

// ================ Review ================ \\

ReviewSchema = Schema({
    restaurantID: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    authorID: {type: String, required: true},
    images: {type: [String], default: []},
    restaurantRating: {type: Number, min: 0, max: 5, required: true},
    reviewRating: {type: Number, default: 0},
    updatedAt: Date
});

ReviewSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Review', ReviewSchema);