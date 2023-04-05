const nodemailer = require("nodemailer");

exports.sendMail = async (options) => {

    // 1- create the transporter 
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // define the mail options:

    const mailOptions = {
        from: "Makram BouGhannam <makramrboughannam@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3- Send the mail
    await transporter.sendMail(mailOptions);
};