// ================ Middleware ================ \\

const LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

// ================ Passport ================ \\

module.exports = function (passport) {

    passport.use('login-local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({'email': email}, function (err, user) {
                    if (err) {
                        console.log("Error1: " + err);
                        return done(err);
                    }

                    if (!user) {
                        console.log("Error2 - user = " + user);
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
        function (req, email, password, done) {
            process.nextTick(function () {
                if (!req.user) {
                    User.findOne({'email': email}, function (err, user) {
                        if (err){
                            console.log(err);
                            return done(err);
                        }

                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {
                            var re = /(?:\.([^.]+))?$/;
                            var imgExtension = "." + re.exec(req.file.originalname)[1];

                            var newUser = new User();

                            newUser._id = email.toLowerCase();
                            newUser.email = email.toLowerCase();
                            newUser.password = password;
                            newUser.privilege_level = 1;
                            newUser.forename = req.body.forename;
                            newUser.surname = req.body.surname;
                            newUser.password = req.body.password;
                            newUser.ageCategory = req.body.age;
                            newUser.county = req.body.county;
                            newUser.reviews = [];
                            newUser.display_img_filename = req.body.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, "-") + imgExtension;
                            newUser.user_rating = 0;
                            newUser.restaurants = [];

                            newUser.save(function (err) {
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

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};

