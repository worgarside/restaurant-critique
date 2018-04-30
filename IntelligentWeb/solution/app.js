/**
 * Partially generated file for running app
 * @author Will Garside, Rufus Cope, Greta Ramaneckaite
 */

// ================ Middleware ================ \\

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const flash = require('connect-flash');
global.appRoot = path.resolve(__dirname);
global.dbRegen = false;

require('./config/passport')(passport);
const database = require('./config/database');

// ================ Database ================ \\

require('./app/models/user');
require('./app/models/category');
require('./app/models/restaurant');
require('./app/models/review');

database.connect();

// ================ View Engine ================ \\

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
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
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery-timepicker/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery-validation/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/open-iconic/')));

// ================ Routes ================ \\

const index = require('./routes/index');
const signup = require('./routes/signup');
const restaurantNew = require('./routes/restaurant_new');
const restaurantsNearby = require('./routes/restaurants_nearby');
const contact = require('./routes/contact');
const search = require('./routes/search');
const user_management = require('./routes/user_management');

app.use('/', index);
app.use('/signup', signup);
app.use('/restaurant/new', restaurantNew);
app.use('/restaurants-nearby', restaurantsNearby);
app.use('/contact', contact);
app.use('/search', search);
app.use('/user', user_management);

// catch 404 and forward to error handler
app.use((req, res) => {
    res.render('error');
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

console.log('\033c'); //Clears terminal
console.log('\x1b[32m%s\x1b[0m', `App Started @ ${appRoot}`);
module.exports = app;