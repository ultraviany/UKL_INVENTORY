import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// create a rule/schema for adding new medicine
const createSchema = Joi.object({
    user_id: Joi.number().required(),
    item_id: Joi.number().required(),
    borrow_date: Joi.date().required(),
    return_date: Joi.date().required()
});

const createValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = createSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
}

// update a rule/schema for adding new inventory
const returnSchema = Joi.object({
    borrow_id: Joi.number().min(1).required(),
    return_date: Joi.date().required(),
});

const returnValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = returnSchema.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
};

// update a rule/schema for adding new inventory
const usageReport = Joi.object({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    group_by: Joi.string().valid("category", "location").required(),
});

const usageValidation = (req: Request, res: Response, next: NextFunction): void => {
    const validate = usageReport.validate(req.body, { abortEarly: false }); // To get all errors
    if (validate.error) {
        res.status(400).json({
            message: validate.error.details.map(it => it.message).join(", "), // Error messages separated by comma
        });
        return
    }
    next();
};

export { createValidation, returnValidation, usageValidation };