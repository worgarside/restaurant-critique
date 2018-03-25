//================Middleware================\\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

router.use(bodyParser.urlencoded({extended:true}));

const EMAIL = 'worgarside.dev@gmail.com';
const PASSWORD = 'mfdobnadqxkrxnch';

//================POSTMethod================\\

router.post('/',function(req,res){

    nodemailer.createTestAccount(function(err,account){
        var transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user: EMAIL,
                pass: PASSWORD
            }
        });


        var mailOptions={
            from: req.body.name + '' + req.body.email,
            to: EMAIL,
            subject:'Support Request from ' + req.body.email,
            html: 'Name: ' + req.body.name + '<br> <br> Message: ' + req.body.message
        };

        transporter.sendMail(mailOptions,function(err,info){
            if(err)
                console.log(err);
            else
                console.log(info);

            var confirmMail = {
                from: 'Restaurant Critique from ' + EMAIL,
                to: req.body.email,
                subject: 'Support Request from Restaurant Critique',
                html: 'Thank you for your email, we will reply as soon as possible. <br> <br> Restaurant Critique'
            }

            transporter.sendMail(confirmMail,function(err,info){
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
