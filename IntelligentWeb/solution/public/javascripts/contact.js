var nodemailer = require('nodemailer');

app.post('/contact', function (req, res) {

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'worgarside.dev@gmail.com',
            pass: 'passw3rd'
        }
    });

    var mailOptions = {
        from: req.body.email,
        to: 'worgarside.dev@gmail.com\'',
        subject: 'help',
        text: req.body.message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

})