/**
 * Configuration.template file for sending emails.
 * Uses Nodemailer middleware to create the transport and Gmail to send the email
 * The Gmail login info is in this file - in production this wll be moved to environment variables
 * @author Will Garside, Greta Ramaneckaite
 */

// ================ Middleware ================ \\

const nodemailer = require('nodemailer');
const restaurantCritiqueAccount = {
    email: 'worgarside.dev@gmail.com',
    password: 'mfdobnadqxkrxnch'
};

// ================ Email Manager ================ \\

/**
 * Send an email with nodemailer and Gmail from the accouet defined above
 * @param {String} to The recipient of the email
 * @param {String} subject Email subject content
 * @param {String} body The main body of the email
 * @param {String} from The sender's name to be added to the email (e.g. 'Support Request', 'User Confirmation', etc.)
 * @param {*} nextFunction A function to be run after sending the email
 */
function sendEmail(to, subject, body, from = `"Restaurant Critique" <no-reply@restaurantcritique.com>`, nextFunction=undefined) {
    //'from' can be set to empty string to allow default value whilst still using the nextFunction param
    if (from === ''){
        from = `"Restaurant Critique" <no-reply@restaurantcritique.com>`
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: restaurantCritiqueAccount.email,
            pass: restaurantCritiqueAccount.password
        }
    });

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        html: body
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(`Email error: ${err}`);
        } else {
            console.log(`Email sent to ${to} with subject '${subject}'`);
        }

        if (nextFunction) {
            nextFunction();
        }
    });

}

module.exports.sendEmail = sendEmail;