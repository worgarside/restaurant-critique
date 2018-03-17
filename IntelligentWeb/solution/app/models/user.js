const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

UserSchema = Schema({
    _id: {type: String},
    email: String,
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

// UserSchema.virtual('email').get(function () {
//     return this._id;
// });

UserSchema.pre('save', function (next) {
    var user = this;
    user.password = generateHash(user.password);
    next();
});

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};



module.exports = mongoose.model('User', UserSchema);