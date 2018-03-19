const nodemailer = require('nodemailer');

app.post('/contact', (req, res) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'worgarside.dev@gmail.com',
            pass: 'passw3rd'
        }
    });

    const mailOptions = {
        from: req.body.email,
        to: 'worgarside.dev@gmail.com\'',
        subject: 'help',
        text: req.body.message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
});

// TODO: is this file necessary?