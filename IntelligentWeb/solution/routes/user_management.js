/**
 * User signup management, uses passport configuration file
 * @author Will Garside
 */

// ================ Middleware ================ \\

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt-nodejs');

router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Methods ================ \\

router.post('/update_name', (req, res) => {
    const name = req.body.name;

    User.findByIdAndUpdate(req.body._id, {name: name}, {new: true}, (err, user) => {
        if (err) {
            console.log(err);
            res.send(false);
        } else {
            console.log(`Name updated successfully: '${user.name.first} ${user.name.last}'`);
            res.send(user.name);
        }
    });
});

router.post('/update_postcode', (req, res) => {
    const postcode = req.body.postcode;

    User.findByIdAndUpdate(req.body._id, {postcode: postcode}, {new: true}, (err, user) => {
        if (err) {
            console.log(err);
            res.send(false);
        } else {
            console.log(`Postcode updated successfully: '${user.postcode}'`);
            res.send(user.postcode);
        }
    });
});

router.post('/update_password', (req, res) => {
    User.findOne({_id: req.body._id},  (err, user) => {
        user.comparePassword(req.body.password.old, (err, matched)=>{
            if (err){
                console.log(`Error: ${err}`);
                res.send('0');
            }

            if (matched){
                user.password = req.body.password.new;
                user.save()
                    .then(()=>{
                        res.send('1');
                    })
                    .catch((err)=>{
                        console.log(`Unable to save user: ${err}`);
                        res.send('2');
                    })
            }else{
                console.log('oldPassword <> user.password');
                res.send('0');
            }
        });
    });
});

module.exports = router;
