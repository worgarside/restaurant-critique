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
    reducedID: {type: String, unique: true},
    userRating: {type: Number, default: 0},
    restaurants: {
        created: [String],
        owned: [String]
    },
    verified: {
        flag: {type: Boolean, default: false},
        hash: {type: String}
    },
    supportRequests: {type: [{reference: Number, content: String}]},
    updatedAt: Date
});

UserSchema.pre('save', function (next) {
    this.increment();

    // Passwords are salted and hashed before saving
    this.password = generateHash(this.password);

    // For user verification, a hash value is generated and email to the user for them to confirm their email legitimacy
    if (!this.verified.flag && (this.__v === 0 || this.__v === undefined)) {
        if (!this.verified.hash){
            this.verified.hash = crypto.randomBytes(20).toString('hex');
        }
        if (!dbRegen) {
            this.sendVerificationEmail();
        }
    }

    this.updatedAt = Date.now();
    next();
});

/**
 * A function to validate the user password when they are logging in or changing their password
 * @param password {String} The plaintext password that has been entered for validation
 * @returns {Boolean} Boolean value for password validity
 * @function validPassword
 */
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

/**
 * Uses the bcrypt middleware to slat and hash the User's password
 * @param {String} password Plaintext password to be salted and hashed
 * @returns {String} The salted and hashed value of the password
 */
function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

/**
 * Sends a verification email to the user when they sign up to ensure email legitimacy and remove span
 * Again, uses nodemailer configuration template
 * @param {User} user The User who has requested or requires a verification email
 */
UserSchema.methods.sendVerificationEmail = function () {
    const to = this._id;
    const subject = 'Restaurant Critique User Verification';
    const body = `
        <p>${this.name.first} ${this.name.last},</p>
        <p>Please verify your new account with Restaurant Critique by clicking the link below</p>
        <p><a href='https://localhost:3000/verify-user/${this.verified.hash}'>https://restaurantcritique.com/verify-user/${this.verified.hash}</a></p>
    `;

    nodemailer.sendEmail(to, subject, body);
};

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);