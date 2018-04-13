/**
 * Definition of the User mongoose Schema
 * User is a user of the website, with basic profile information. They can be owners or creators of restaurants,
 * or administrators (or all three)
 * @author Will Garside
 */

// ================ Middleware ================ \\

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require(`${appRoot}/config/nodemailer`);
const crypto = require('crypto');

// ================ User Schema Definition ================ \\

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
    // Passwords are salted and hashed before saving
    this.password = generateHash(this.password);

    // For user verification, a hash value is generated and email to the user for them to confirm their email legitimacy
    if (!this.verified.flag) {
        this.verified.hash = crypto.randomBytes(20).toString('hex');
        if (!dbRegen) {
            sendVerificationEmail(this);
        }
    }

    this.updatedAt = Date.now();
    next();
});

/**
 * A function to validate the user password when they are logging in or changing their password
 * @param password The plaintext password that has been entered for validation
 * @returns {*} Boolean value for password validity
 */
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Uses the bcrypt middleware to slat and hash the User's password
 * @param password Plaintext password to be salted and hashed
 * @returns {*} The salted and hashed value of the password
 */
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

/**
 * Sends a verification email to the user when they sign up to ensure email legitimacy and remove span
 * Again, uses nodemailer configuration template
 * @param user The User who has requested or requires a verification email
 */
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