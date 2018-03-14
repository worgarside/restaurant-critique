// -------- Middleware -------- \\

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoClientObject = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');
const app = express();

// -------- Database -------- \\

var url = "mongodb://localhost:27017/";
const dbName = "restaurant_critique";
var db;

mongoClientObject.connect(url, function (err, client) {
    assert.equal(null, err);

    if (err) return console.log(err);
    if (!client) {
        console.error("Error! Database connection failed.");
        process.exit(1);
    } else {
        console.log("Connection established to", url);
        db = client.db(dbName);
    }
});

//EXAMPLE ADD CATEGORY TO DB
app.use('/insertation', function () {
    db.collection("categories").insertOne({name: "Fast Food"}, function (err, res) {
        if (err) return console.log(err);
    });
});


// -------- View Engine -------- \\

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/scripts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/popper.js/dist/umd/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/open-iconic/')));

// -------- Routes -------- \\

var index = require('./routes/index');
var users = require('./routes/users');

app.use('/', index);
app.use('/users', users);


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