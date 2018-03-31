//================ Middleware ================\\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('../config/nodemailer');

router.use(bodyParser.urlencoded({extended: true}));

//================ POST Method ================\\

router.post('/', (req, res) => {
    sendSupportRequest(req);
    sendConfirmationEmail(req);
    res.render('contact-submitted');
});

function sendSupportRequest(req) {
    const to = 'worgarside.dev@gmail.com'; // This would be suuport@restaurantcritique.com
    const subject = `Support Request: ${req.body.email}`;
    const body = `<p>Name: ${req.body.name} </p> <p>Message: ${req.body.message}</p>`;
    const from = `"${req.body.name}" <${req.body.email}>`;

    nodemailer.sendEmail(to, subject, body, from);
}

function sendConfirmationEmail(req) {
    const to = req.body.email;
    const subject = 'Support Request Confirmation3';
    const body = `<p>Thank you for your email, we will reply as soon as possible.<p> <p>Restaurant Critique</p>`;
    const from = "'Restaurant Critique' <no-reply@restaurantcritique.com>";

    nodemailer.sendEmail(to, subject, body, from);
}

module.exports = router;
