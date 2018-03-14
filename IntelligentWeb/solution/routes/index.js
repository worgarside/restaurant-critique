const express = require('express');
const router = express.Router();
const title = 'Restaurant Critique';
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));

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
