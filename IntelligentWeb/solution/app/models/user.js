// ================ Middleware ================ \\

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// ================ User ================ \\

UserSchema = Schema({
    _id: {type: String},
    password: {type: String, required: true},
    privilegeLevel: {type: Number, default: 0},
    forename: {type: String, required: true},
    surname: {type: String, required: true},
    ageCategory: {type: Number, min: 0, max: 6},
    postcode: String,
    reviews: Array,
    displayImage: {type: String, unique: true},
    userRating: {type: Number, default: 0},
    restaurants: Array,
    updatedAt: Date
});

UserSchema.pre('save', function (next) {
    this.password = generateHash(this.password);
    this.updatedAt = Date.now();
    next();
});

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

module.exports = mongoose.model('User', UserSchema);