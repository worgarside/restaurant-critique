/**
 * A configuration file for the MongoDB database.
 * In production, the username and password will be move to environment variables
 * @author Will Garside
 */

// ================ Middleware ================ \\

const mongoose = require('mongoose');
const nodemailer = require('./nodemailer');
const os = require('os');
const database = {
    username: 'worgarside',
    password: 'V9hG0P3a025bnbTY',
    name: 'restaurant_critique',
    url: 'restaurant-critique-gct1h.mongodb.net'
};

// ================ Database Manager ================ \\

/**
 * Connects to the remote database with login information and returns the database connection
 * @param {function} nextFunction A function to be run after the database has been connected to
 * @returns {mongoose.connection} Mongoose connection Promise, with DB connection object after fulfillment
 */
function connect(nextFunction) {
    // noinspection JSUnresolvedFunction - Parameters are correct for Mongoose connection
    return mongoose.connect(
        `mongodb+srv://${database.username}:${database.password}@${database.url}/`,
        {dbName: database.name}
    )
        .then(() => {
            console.log('\x1b[95m%s\x1b[0m', `Connected to mongodb+srv://${database.username}@${database.url}`);
            if (nextFunction) {
                nextFunction();
            }
        })
        .catch((err) => {
            console.log(`Failed to connect to DB: ${err}`);
            const to = 'worgarside@gmail.com';
            const subject = 'MongoDB Connection Failure';
            const body = `
                <p>Someone has failed to connect to the MongoDB deployment from ${os.hostname()}, 
                which is a ${os.type()}: ${os.platform()}${os.arch()} at ${new Date().toISOString()}</p>
            `;

            //Email allows for diagnostics and testing
            nodemailer.sendEmail(to, subject, body,'',exitIfDBConnectionFailed);
        });
}

/**
 * A helper function to be passed to the Nodemailer config if the connection fails
 */
function exitIfDBConnectionFailed(){
    process.exit(1)
}

module.exports.connect = connect;