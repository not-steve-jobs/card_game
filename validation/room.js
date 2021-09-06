const Joi = require('joi');
const roomValidate = (data) => {
    const schema = Joi.object().keys({
        name: Joi.string(),
        max_gamer_count: Joi.number().min(2).max(4).required()
    });
    return schema.validate(data);
};

module.exports = { roomValidate };