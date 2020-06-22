const {SECRET_KEY} = require('../config');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY,
        {expiresIn: '1h'}
    );
}

module.exports = generateToken;