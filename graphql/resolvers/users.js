const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

const {
    validateRegisterInput,
    validateLoginInput,
    validateResetPasswordInput,
    validateForgotPasswordInput
} = require('../../util/validators');
const {SECRET_KEY} = require('../../config');
const User = require('../../models/User');

function generateToken(user) {
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

module.exports = {
    Mutation: {
        async login({username, password}) {
            console.log(username, password);
            const {errors, valid} = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }

            const user = await User.findOne({username});

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong crendetials';
                throw new UserInputError('Wrong crendetials', {errors});
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(

            {
                registerInput: {username, email, password, confirmPassword}
            }
        ) {
            // Validate user data
            const {valid, errors} = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }
            // TODO: Make sure user doesnt already exist
            const user = await User.findOne({username});
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        },

        async resetPassword({username, currentPassword, newPassword}) {
            const {errors, valid} = validateResetPasswordInput(username, currentPassword, newPassword);

            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }

            const user = await User.findOne({username});

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }

            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                errors.general = 'Wrong crendetials';
                throw new UserInputError('Wrong crendetials', {errors});
            }
            user.password = await bcrypt.hash(newPassword, 12);
            user.save();
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },

        async forgotPassword( {username, email}) {
            const {errors, valid} = validateForgotPasswordInput(username, email);
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }
            let user;
            if (username) {
                user = await User.findOne({username});
            } else {
                user = await User.findOne({email});
            }

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }

            return {
                message: "Email Sent",
                email: user.email
            };
        },
    }
};