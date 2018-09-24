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
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
app.io = require('socket.io')();

const https_redirect = function(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        } else {
            return next();
        }
    } else {
        return next();
    }
};

app.use(https_redirect);

global.appRoot = path.resolve(__dirname);
global.dbRegen = false;

require('./config/passport')(passport);
const database = require('./config/database');

console.log('\033c'); //Clears terminal
console.log('\x1b[36m%s\x1b[0m', `App Started @ ${appRoot}`);

// ================================ Database ================================ \\

require('./app/models/user');
require('./app/models/category');
require('./app/models/restaurant');
require('./app/models/review');

database.connect(null);

// ================================ View Engine ================================ \\

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: false, limit: '50mb'}));
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
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery-form/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery-validation/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/open-iconic/')));


// ================================ Routes ================================ \\

const index = require('./routes/index');
const signup = require('./routes/signup');
const restaurantNew = require('./routes/restaurant_new');
const restaurantEdit = require('./routes/restaurant_edit');
const restaurantsNearby = require('./routes/restaurants_nearby');
const contact = require('./routes/contact');
const search = require('./routes/search');
const user_management = require('./routes/user_management');
const restaurant = require('./routes/restaurant')(app.io);

app.use('/', index);
app.use('/signup', signup);
app.use('/restaurant/new', restaurantNew);
app.use('/restaurant/edit', restaurantEdit);
app.use('/restaurants-nearby', restaurantsNearby);
app.use('/contact', contact);
app.use('/search', search);
app.use('/user', user_management);
app.use('/restaurant', restaurant);
app.use((req, res) => {
    // catch 404 and forward to error handler
    res.render('errors/404');
});

module.exports = app;