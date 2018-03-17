const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

mongoose.model('User', UserSchema);