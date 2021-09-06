const Joi = require('joi');
const userValidate = (data) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
};

module.exports = { userValidate };