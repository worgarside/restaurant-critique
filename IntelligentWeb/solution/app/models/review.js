// ================ Middleware ================ \\

const mongoose = require('mongoose'), Schema = mongoose.Schema;

// ================ Review ================ \\

ReviewSchema = Schema({
    restaurant_id: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    author_id: {type: String, required: true},
    images: {type: [String], default: []},
    restaurant_rating: {type: Number, min: 0, max: 5, required: true},
    review_rating: {type: Number, default: 0},
    updated_at: Date
});

ReviewSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Review', ReviewSchema);