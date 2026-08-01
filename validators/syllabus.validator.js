const Joi = require("joi");

exports.createSubjectValidator = Joi.object({

    subject: Joi.string()
        .trim()
        .required(),

    chapters: Joi.array().items(

        Joi.object({

            name: Joi.string().required(),

            tuitionCompleted: Joi.boolean(),

            schoolCompleted: Joi.boolean(),

            testCompleted: Joi.boolean()

        })

    ).required()

});