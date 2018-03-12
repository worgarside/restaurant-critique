var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var http           = require('http'),
    MongoClient      = require('mongodb').MongoClient,
    Server           = require('mongodb').Server,
    parser           = require('body-parser'),
    CollectionDriver = require('./collectionDriver').mongoWrapper;


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var mongoHost = 'localHost';
var mongoPort = 27017;
var mongoWrapper;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
var url = "mongodb://localhost:27017/";

mongoClient.connect(function(err, mongoClient) {
    if (!mongoClient) {
        console.error("Error! Datbase connection failed.");
        process.exit(1);
    } else{
        console.log("Connection established to",url);
    }
    var db = mongoClient.db("restaurant_critique");
    mongoWrapper = new CollectionDriver(db);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(logger('dev'));
app.use(parser.json());
app.use(parser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/scripts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/popper.js/dist/umd/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/scripts', express.static(path.join(__dirname, '/node_modules/open-iconic/')));


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