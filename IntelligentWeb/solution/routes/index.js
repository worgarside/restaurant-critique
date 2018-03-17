const express = require('express');
const router = express.Router();
const title = 'Restaurant Critique';
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
var Account = require('../app/models/account');
var passport = require('passport');

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});























/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: title, user : req.user });
});

router.get('/contact', function (req, res, next) {
    res.render('contact', {title: title});
});

router.get('/signup', function (req, res, next) {
    res.render('signup', {title: title});
});

router.get('/search', function (req, res, next) {
    res.render('search', {title: title});
});

router.get('/about', function (req, res, next) {
    res.render('about', {title: title});
});

router.get('/accessibility', function (req, res, next) {
    res.render('accessibility', {title: title});
});

router.get('/restaurant/new', function (req, res, next) {
    res.render('restaurant_new', {title: title});
});

module.exports = router;
