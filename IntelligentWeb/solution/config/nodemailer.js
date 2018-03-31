//================ Middleware ================\\

const nodemailer = require('nodemailer');
const restaurantCritiqueAccount = {email: 'worgarside.dev@gmail.com', password: 'mfdobnadqxkrxnch'};

//================ Email Manager ================\\

function sendEmail(to, subject, body, from = `"Restaurant Critique" <restaurantCritiqueAccount.email>`) {
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

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(`Email error: ${err}`);
        }
        else {
            console.log(`Email sent: ${JSON.stringify(info)}`);
        }
    });

}

module.exports.sendEmail = sendEmail;