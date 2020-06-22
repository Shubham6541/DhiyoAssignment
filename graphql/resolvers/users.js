const bcrypt = require('bcryptjs');
const {UserInputError} = require('apollo-server');
const generateToken = require('../../util/generateToken');
const {
    validateRegisterInput,
    validateLoginInput,
    validateResetPasswordInput,
    validateForgotPasswordInput
} = require('../../util/validators');
const forgotPasswordResponse = require('../../util/forgetPasswordResponse');
const User = require('../../models/User');

module.exports = {
    Mutation: {
        login: async ({username, password}) => {
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
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token,
            };
        },

        register: async ({registerInput: {username, email, password, confirmPassword}}) => {
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

        resetPassword: async ({username, currentPassword, newPassword}) => {
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

        forgotPassword: async ({username, email}) => {
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
            const response = await forgotPasswordResponse(user.username, user.email);
            return response;
        },
    }
};