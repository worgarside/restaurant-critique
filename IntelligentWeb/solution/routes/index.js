var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/contact', function (req, res, next) {
    res.render('contact', {title: 'Express'});
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'Express'});
});

router.get('/search', function (req, res, next) {
    res.render('search', {title: 'Express'});
});

router.get('/about', function (req, res, next) {
    res.render('about', {title: 'Express'});
});

router.get('/accessibility', function (req, res, next) {
    res.render('accessibility', {title: 'Express'});
});

module.exports = router;
