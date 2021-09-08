require('dotenv').config();
const { logger } = require('./logger');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(
    {
        // host: 'smtp.mail.ru',
        // port: 465,
        // secure: true, // true for 465, false for other ports
        // auth: {
        //     user: 'sendmail.testovich@mail.ru',
        //     pass: process.env.EMAIL_PASSWORD
        // }
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "3a6c9f94a072bf",
            pass: "333a73ed55c02b"
        }
    },
    {
        from: 'AntiPoker <sendmail.testovich@mail.ru>'
    }
);

exports.mailer = (message) => {
    transporter.sendMail(message, (err, info) => {
        if (err) return logger.error(err);
        return  logger.info('Email sent:', info);
    });
};