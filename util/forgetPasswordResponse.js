const crypto = require('crypto');
const User = require('../models/User');
const sendMail = require('./sendMail');

const updateUser = (username, token) => {
    const newValues = {$set: {resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000}};
    User.updateOne({username: username}, newValues, function (err, res) {
        if (err) {
            throw err;
        }
    });
};

const forgotPasswordResponse = async (username, email) => {
    const token = await crypto.randomBytes(20).toString('hex');
    updateUser(username, token);
    const message = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://localhost:8080/api/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n';
    const subject = 'Password Reset for Dhiyo application';
    return await sendMail(email, subject, message);
}

module.exports = forgotPasswordResponse;