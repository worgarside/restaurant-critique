var express = require('express');
var router = express.Router();
var title = 'Restaurant Critique';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: title});
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

module.exports = router;
