//================Middleware================\\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({extended:true}));

const EMAIL = 'worgarside.dev@gmail.com';
const PASSWORD = 'mfdobnadqxkrxnch';

//================POST Method================\\

router.post('/', (req,res) => {

    nodemailer.createTestAccount((err,account) => {
        if(err)
            console.log(err);

        let transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: EMAIL,
                pass: PASSWORD
            }
        });


        let mailOptions={
            from: req.body.name + '' + req.body.email,
            to: EMAIL,
            subject:'Support Request from ' + req.body.email,
            html: '<p>Name: ${req.body.name} </p> <p>Message: ${req.body.message}</p>'
        };

        transporter.sendMail(mailOptions, (err,info) => {
            if(err)
                console.log(err);
            else
                console.log(info);

            let confirmMail = {
                from: 'Restaurant Critique enquiry from ${EMAIL}',
                to: req.body.email,
                subject: 'Support Request from Restaurant Critique',
                html: '<p>Thank you for your email, we will reply as soon as possible.<\p> <p>Restaurant Critique</p>'
            }

            transporter.sendMail(confirmMail,(err,info) =>{
                if(err)
                    console.log(err);
                else
                    console.log(info);
            })
        });
    });
    res.render('contact-submitted');

});

module.exports = router;
