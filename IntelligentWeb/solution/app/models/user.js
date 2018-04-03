// ================ Middleware ================ \\

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require(`${appRoot}/config/nodemailer`);
const crypto = require("crypto");

// ================ User ================ \\

UserSchema = Schema({
    _id: {type: String},
    password: {type: String, required: true},
    privilegeLevel: {type: Number, default: 0},
    name: {
        first: {type: String, required: true},
        last: {type: String, required: true}
    },
    ageCategory: {type: Number, min: 0, max: 6},
    postcode: String,
    reviews: Array,
    displayImage: {type: String, unique: true},
    userRating: {type: Number, default: 0},
    restaurants: {
        created: [String],
        owned: [String]
    },
    verified: {
        flag: {type: Boolean, default: false},
        hash: {type: String}
    },
    updatedAt: Date
});

UserSchema.pre('save', function (next) {
    this.password = generateHash(this.password);

    //TODO unique check on verification hash?

    if (!this.verified.flag) {
        this.verified.hash = crypto.randomBytes(20).toString('hex');
        if (!dbRegen) {
            sendVerificationEmail(this);
        }
    }

    this.updatedAt = Date.now();
    next();
});

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

function sendVerificationEmail(user) {
    const to = user._id;
    const subject = 'Restaurant Critique User Verification';
    const body = `
        <p>${user.name.first} ${user.name.last},</p>
        <p>Please verify your new account with Restaurant Critique by clicking the link below</p>
        <p><a href='http://localhost:3000/verify-user/${user.verified.hash}'>https://restaurantcritique.com/verify-user/${user.verified.hash}</a></p>
    `;

    nodemailer.sendEmail(to, subject, body);
}


module.exports = mongoose.model('User', UserSchema);