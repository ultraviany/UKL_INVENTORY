import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const createSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

const createValidation = async(
    req: Request,
    res: Response,
    next: NextFunction

) : Promise<any> => {
    const validation = createSchema.validate(req.body)
    if(validation.error){
       
        res.status(400)
        .json({
            message: validation
            .error
            .details
            .map(it => it.message).join()
        })
    }
    next()
}

const updateSchema = Joi.object({
    username: Joi.string().optional(),
    password: Joi.string().optional(),    

})


const updateValidation = async(
    req: Request,
    res: Response,
    next: NextFunction
) : Promise<any> => {
    const validation = updateSchema.validate(req.body)
    if(validation.error){
        res.status(400)
        .json({
            message: validation
            .error
            .details
            .map(it => it.message).join()
        }) 
    }
    next()
}

const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const authValidation = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    const validation = authSchema.validate(req.body)
    if(validation.error){
        res.status(400)
        .json({
            message: validation
            .error
            .details
            .map(it => it.message).join()
        })
    }
    next()
}
export {createValidation, updateValidation, authValidation}