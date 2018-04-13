/**
 * Configuration for the Passport middleware
 * Manages the user login sessions and verification
 * @author Will Garside
 */

// ================ Middleware ================ \\

const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/user');

// ================ Passport ================ \\

module.exports = function (passport) {
    passport.use('login-local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            process.nextTick(() => {
                User.findOne({'_id': email}, (err, user) => {
                    if (err) {
                        console.log(`Error1: ${err}`);
                        return done(err);
                    }

                    if (!user) {
                        console.log(`Error2 user = ${user}`);
                        return done(null, false, req.flash('loginMessage', 'No user found.'));
                    }

                    if (!user.validPassword(password)) {
                        console.log("Invalid password");
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }

                    console.log("User verified, logging in");
                    return done(null, user);
                });
            });
        }));

    passport.use('signup-local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, email, password, done) => {
            process.nextTick(() => {
                if (!req.user) {
                    User.findOne({'_id': email}, (err, user) => {
                        if (err) {
                            console.log(err);
                            return done(err);
                        }

                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.')); // TODO implement this
                        } else {
                            const newUser = new User();

                            if (req.file.originalname){
                                const re = /(?:\.([^.]+))?$/;
                                const imgExtension = `.${re.exec(req.file.originalname)[1]}`;
                                newUser.displayImage = req.body.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-") + imgExtension;
                            }

                            newUser._id = email.toLowerCase();
                            newUser.password = password;
                            newUser.privilege_level = 1;
                            newUser.name.first = req.body.forename;
                            newUser.name.last = req.body.surname;
                            newUser.password = req.body.password;
                            newUser.ageCategory = req.body.age;
                            newUser.county = req.body.county;
                            newUser.reviews = [];

                            newUser.user_rating = 0;

                            newUser.save((err) => {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });
                } else {
                    return done(null, req.user);
                }
            });
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

