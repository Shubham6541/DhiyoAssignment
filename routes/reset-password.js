const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');
const sendMail = require('../util/sendMail');
const fs = require('fs');

const resetPasswordResponse = async (req, res) => {
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function (err, user) {
        if (!user) {
            res.json({message: 'Password reset token is invalid or has expired.'});
        } else {
            fs.readFile('views/resetPassword.html', function (error, data) {
                if (error) {
                    res.writeHead(404);
                    res.write('Contents you are looking are Not Found');
                } else {
                    res.write(data);
                }
                res.end();
            });
        }
    });
}

const setPasswordResponseMail = async (req, res) => {
    const searchQuery = {resetPasswordToken: req.params.token};
    const updatedValues = {
        $set: {
            password: await bcrypt.hash(req.params.password, 12),
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
            modifiedDate: Date(Date.now())
        }
    };

    User.findOneAndUpdate(searchQuery, updatedValues, (err, user) => {
        console.log(user.email);
        if (err) throw err;
        const subject = 'Password Updated';
        const message = 'Hi, \n' +
            '\'This is a confirmation that the password for your account \'' + user.email + '\' has just been changed.\\n\''
        sendMail(user.email, subject, message);
        res.send({status: 'success', message: 'Success! Your password has been changed.'});
    });
}
router.get('/reset/:token', resetPasswordResponse);
router.post('/reset/:token/:password', setPasswordResponseMail);

module.exports = router;