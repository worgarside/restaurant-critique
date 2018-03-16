var mongoose = require('mongoose'), Schema = mongoose.Schema;

UserSchema = Schema({
    _id: {type: String},
    password: {type: String, required: true},
    privilege_level: {type: Number, required: true},
    forename: {type: String, required: true},
    surname: {type: String, required: true},
    ageCategory: Number,
    county: String,
    reviews: Array,
    display_img_filename: {type: String, unique: true},
    user_rating: Number
});

UserSchema.virtual('email').get(function () {
    return this._id;
});

mongoose.model('User', UserSchema);