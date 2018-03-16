var mongoose = require('mongoose'), Schema = mongoose.Schema;

ReviewSchema = Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    author: {type: String, required: true},
    datetime: {type: Date, required: true},
    images: Array,
    restaurant_rating: {type: Number, required: true},
    review_rating: Number
});

mongoose.model('Review', ReviewSchema);