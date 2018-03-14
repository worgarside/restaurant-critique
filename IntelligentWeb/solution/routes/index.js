var express = require('express');
var router = express.Router();
var title = 'Restaurant Critique';
var bodyParser = require('body-parser');
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

router.post('/login', function (req, res) {
    console.log('This is here');
    var username = req.body.username;
    console.log(username);
    if (username === 'Paulo') {
        res.render('welcome', {title: 'Paulo'});
    } else {
        res.render('index', {title: 'COM3504', login_is_correct: false});
    }
});

module.exports = router;
