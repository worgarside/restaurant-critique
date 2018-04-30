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

router.use(bodyParser.urlencoded({extended: true}));

// ================ POST Method ================ \\

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

module.exports = router;
