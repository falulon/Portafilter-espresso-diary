const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.coffeeTypeSchema = Joi.object({
    coffee: Joi.object({
        name: Joi.string().required().escapeHTML(),
        weight: Joi.number().required().min(0),
        date: Joi.date(),
        roastLevel: Joi.number()    
        
    }).required()
});


module.exports.drinkTypeSchema = Joi.object({
    drink: Joi.object({
        type: Joi.string().required().escapeHTML(),
        date: Joi.date(),
        temperature: Joi.number().min(0).optional().allow(null).allow(''),
        grindLevel: Joi.number().optional().allow(null).allow(''),
        tampingLevel: Joi.number().min(0).max(2).optional().allow(null).allow(''),
        nextTimeNote: Joi.string().optional().allow(null).allow('').escapeHTML(),
        infusionLength: Joi.string().optional().allow(null).allow('').escapeHTML(),
        drinkWeight: Joi.number().optional().allow(null).allow(''),
        weight: Joi.number().min(0).optional().allow(null).allow(''),
    comment: Joi.string().optional().allow(null).allow('').escapeHTML(),
    nextTimeNote: Joi.string().optional().allow(null).allow('').escapeHTML()
                   
    }).required()
});

