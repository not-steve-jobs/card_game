const userModel = require('../models/user');
const crypto = require('crypto');

const sendMailer = require('../utils/nodemailer');
const { userValidate } = require('../validation/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

class User {
    async signup (req, res, next) {
        try {
            logger.info('User signup started - - -');
            const {error, value} = userValidate(req.body);
            if (error){
                logger.error('ValidationError', error.message);
                return res.status(400).json({
                    message: error
                });
            };
            const checkUser = await userModel.findOne({email: value.email});
            if (checkUser){
                logger.error('!User Already Exist.!!');
                return res.status(409).json({
                    message: 'This email address is already associated with another account.!!!'
                });
            };
            const verifyToken = crypto.randomBytes(16).toString('hex');
            const mailOptions = {
                to: value.email,
                subject: 'Account Verification Link',
                html: `<h1>Email Confirmation</h1>
                             <h2>Hello ${value.name}</h2>
                             <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
                             <a href=http://localhost:8080/api/confirm/${verifyToken}> Click here</a>
                             </div>`,
            };
            sendMailer.mailer(mailOptions);
            const user = new userModel({
                ...value,
                token: verifyToken
            });
            await user.save();
            return res.status(200).json(user)
        } catch (e) {
          logger.error('Signup Error - - -');
          next(e);
        };
    };

    async verify (req, res, next) {
        try{
            const { id } = req.params;
            const user = await userModel.findOne({token: id});
            if (!user){
                logger.error('USER NOT FOUND');
                return res.status(404).json({
                    message: 'USER NOT FOUND'
                });
            } else if(user.isVerified === true){
                logger.info('User has been already verified. Please Login');
                return res.status(200).json({
                    message: 'User has been already verified. Please Login'
                });
            };

            user.isVerified = true;
            await user.save();
            logger.info(`User has been successfully verified ID: ${user._id}`)
            return res.status(200).json({
                message: 'Your account has been successfully verified'
            });
        } catch (e) {
            logger.error(e);
            next(e);
        };
    };

    async login (req, res, next) {
        try {
            const {email, password} = req.body;
            const user = await userModel.findOne({email});
            if (!user){
                logger.error('User not found');
                return res.status(404).json({
                    message: 'User not found'
                });
            } else if (user.isVerified == false){
                logger.error('User dont verify');
                return res.status(200).json({
                    message: 'Please verify your account.!'
                });
            }
            if (user && (await bcrypt.compare(password, user.password))){
                const token = jwt.sign(
                    {user_id: user._id, email},
                    process.env.TOKEN_KEY,
                    { expiresIn: '8h'}
                );
                return res.status(200).json({
                    user,
                    access_token: token
                });
            } else {
                return res.status(404).json({
                    message: 'Invalid Credentials'
                });
            };
        } catch (e) {
            logger.error(`Login Error: ${e.message}`);
            next(e);
        };
    };

};

module.exports = new User();