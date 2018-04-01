// ================ Middleware ================ \\

const nodemailer = require('nodemailer');
const restaurantCritiqueAccount = {email: 'worgarside.dev@gmail.com', password: 'mfdobnadqxkrxnch'};

// ================ Email Manager ================ \\

function sendEmail(to, subject, body, from = `"Restaurant Critique" <no-reply@restaurantcritique.com>`) {
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
    });

}

module.exports.sendEmail = sendEmail;