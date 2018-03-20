const mongoose = require('mongoose'), Schema = mongoose.Schema;

ReviewSchema = Schema({
    restaurant_id: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    author_id: {type: String, required: true},
    datetime: {type: Date, required: true},
    images: Array,
    restaurant_rating: {type: Number, min:0, max: 5, required: true},
    review_rating: Number,
    updated_at: Date
});

ReviewSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

mongoose.model('Review', ReviewSchema);