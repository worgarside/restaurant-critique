/**
 * Database generation file - overwrites existing data to regenerate the collections with the db_populate file
 * @author WIll Garside
 */

// ================ Middleware ================ \\

const mongoose = require('mongoose');
const path = require('path');
global.appRoot = path.resolve(__dirname);
require('./app/models/user');
require('./app/models/category');
require('./app/models/restaurant');
require('./app/models/review');
const DatabasePopulation = require('./app/db_populate');

// Set a global flag to let the model Schema know if they should send any emails (used to avoid spam emails basically)
global.dbRegen = true;

const database = require('./config/database');

// ================ Database ================ \\

database.connect(initialiseDatabase);

/**
 * Drops all existing collections and initialise list of insertion Promise objects for fulfilment
 */
function initialiseDatabase() {
    const collections = ["users", "categories", "restaurants", "reviews"];

    const conn = mongoose.connection;
    const db = conn.db;
    const dropPromises = [];

    console.log("Dropping database");
    for (let i = 0; i < collections.length; i++) {
        dropPromises.push(db.dropCollection(collections[i]));
    }

    Promise.all(dropPromises)
        .catch((err) => {
            console.log(`DB drop failed: ${err}`);
        })
        .then(() => {
            db.collection('restaurants').createIndex({location: "2dsphere"}).catch((err) => {
                console.log(`Indexing failed: ${err}`);
            }).then(() => {
                populateCollections(conn);
            });
        });
}

/**
 * Populates all four collections with the hard-coded test data in the db_populate file
 * @param {Connection} conn Mongoose connection object to keep DB connection alive
 * @see app/db_populate.js
 */
function populateCollections(conn) {
    const insertPromises = [];
    console.log("Populating collections");

    // Run the functions in the db_populate file, pass the promise array for Promise checking
    DatabasePopulation.populateFunction(insertPromises);

    // Wait for all insertions to complete before continuing
    Promise.all(insertPromises)
        .catch((err) => {
            // Categories can be duplicated if Restaurants save before Categories
            if ((!err.errmsg.includes('duplicate key')) && (!err.errmsg.includes('categories'))){
                console.log(`Error on population: ${err}`);
            }
        })
        .then(() => {
            conn.close().catch((err) => {
                console.log(`Unable to close connection: ${err}`);
            });
        });
}
