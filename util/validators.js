module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be a valid email address';
        }
    }
    if (password === '') {
        errors.password = 'Password must not empty';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (password.trim() === '') {
        errors.password = 'Password must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateResetPasswordInput = (username, currentPassword, newPassword) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (currentPassword.trim() === '') {
        errors.currentPassword = 'Current Password must not be empty';
    }
    if (newPassword.trim() === '') {
        errors.newPassword = 'New Password must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateForgotPasswordInput = (username, email) => {
    const errors = {};
    if (username.trim() === '' && email.trim() === '') {
        errors.user = 'At least one from Username and Email must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};