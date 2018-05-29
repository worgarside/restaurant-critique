/**
 * Route manager for the Contact page
 * Makes use of the Nodemailer config file to send emails to and from Restaurant Critique
 * @author Will Garside, Greta Ramaneckaite
 */

//================ Middleware ================\\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const nodemailer = require('../config/nodemailer');

const mongoose = require('mongoose');
const User = mongoose.model('User');

router.use(bodyParser.urlencoded({extended: true}));

// ================================ POST Method ================================ \\

/**
 * Sends the support request and a confirmation email on the Contact form submission
 * @param {Object} req  The client request object containing the body of info
 * @param {Object} res The client response object to be sent with render info
 * @function postContactForm
 */
router.post('/', (req, res) => {
    let refNum;
    if (!req.body.reference) {
        refNum = new Date().getTime();
    } else {
        refNum = req.body.reference;
    }

    sendSupportRequest(req, refNum);
    sendConfirmationEmail(req, refNum);

    User.findByIdAndUpdate(
        req.body.email,
        {$push: {'supportRequests': {reference: refNum, content: req.body.message}}},
        (err) => {
            if (err) {
                console.log(`Error: ${err}`);
            }
        });
    res.render('contact_submitted');
});

/**
 * Send the support request email to Restaurant Critique with request details
 * @param {Object} req The client request object containing the body of info
 * @param {Number} reference The support request reference number
 */
function sendSupportRequest(req, reference) {
    const to = 'worgarside.dev@gmail.com'; // This would be e.g. support@restaurantcritique.com
    const subject = `Support Request: ${req.body.email}`;
    const body = `<p>Name: ${req.body.name}</p> <p>Message: ${req.body.message}</p><p>Ref: ${reference}</p>`;
    const from = `"${req.body.name}" <${req.body.email}>`;

    nodemailer.sendEmail(to, subject, body, from);
}

/**
 * Sends an email to the user confirming their support request submission
 * @param {Object} req The client request object containing the body of info
 * @param {Number} reference The support request reference number
 */
function sendConfirmationEmail(req, reference) {
    const to = req.body.email;
    const subject = 'Support Request Confirmation';
    const body = `<p>Thank you for your email, we will reply as soon as possible.<p><p>Your unique reference ID is ${reference}</p><p>Restaurant Critique</p>`;
    const from = "'Restaurant Critique' <no-reply@restaurantcritique.com>";

    nodemailer.sendEmail(to, subject, body, from);
}

module.exports = router;
