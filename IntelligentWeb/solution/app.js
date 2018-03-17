// ---------------- Middleware ---------------- \\

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');

require('./config/passport')(passport);

// ---------------- Database ---------------- \\

require('./app/models/user');
require('./app/models/category');
require('./app/models/restaurant');
require('./app/models/review');

const url = 'mongodb://localhost:27017';
const dbName = "restaurant_critique";

mongoose.connect(url + "/" + dbName).then(function () {
    console.log("Connected to " + url + "/" + dbName)
}).catch(function (err) {
    console.log("Failed to connect to DB: " + err)
});

// ---------------- View Engine ---------------- \\

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/scripts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/popper.js/dist/umd/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/open-iconic/')));

// ---------------- Routes ---------------- \\

var index = require('./routes/index');
var signup = require('./routes/signup');
var restaurantNew = require('./routes/restaurant_new');

app.use('/', index);
app.use('/signup', signup);
app.use('/restaurant/new', restaurantNew);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;