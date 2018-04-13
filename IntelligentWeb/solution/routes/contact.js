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

router.use(bodyParser.urlencoded({extended: true}));

//================ POST Method ================\\

/**
 * Sends the support request and a confirmation email on the Contact form submission
 */
router.post('/', (req, res) => {
    sendSupportRequest(req);
    sendConfirmationEmail(req);
    res.render('contact-submitted');
});

/**
 * Send the support request email to Restaurant Critique with request details
 * @param req The client request object containing the body of info
 */
function sendSupportRequest(req) {
    const to = 'worgarside.dev@gmail.com'; // This would be e.g. support@restaurantcritique.com
    const subject = `Support Request: ${req.body.email}`;
    const body = `<p>Name: ${req.body.name} </p> <p>Message: ${req.body.message}</p>`;
    const from = `"${req.body.name}" <${req.body.email}>`;

    nodemailer.sendEmail(to, subject, body, from);
}

/**
 * Sends an email to the user confirming their support request submission
 * @param req The client request object containing the body of info
 */
function sendConfirmationEmail(req) {
    const to = req.body.email;
    const subject = 'Support Request Confirmation';
    const body = `<p>Thank you for your email, we will reply as soon as possible.<p> <p>Restaurant Critique</p>`;
    const from = "'Restaurant Critique' <no-reply@restaurantcritique.com>";

    nodemailer.sendEmail(to, subject, body, from);
}

module.exports = router;
