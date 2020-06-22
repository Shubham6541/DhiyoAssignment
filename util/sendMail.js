const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    service: 'gmail',
    tls: true,
    auth: {
        user: 'kumarshub6541@gmail.com',
        pass: 'Shubham0608@'
    }
});

const sendMail = function (userEmail, subject, message) {
    const mailOptions = {
        from: 'kumarshub6541@gmail.com',
        to: userEmail,
        subject: subject,
        text: message
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return {
                message: "Email can not be sent",
                errorMessage: error
            };
        } else {
            console.log('Email sent: ' + info.response);
            return {message: "Email sent to your registered email address"};
        }
    });
}

module.exports = sendMail;
