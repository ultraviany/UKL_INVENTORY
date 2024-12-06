import jwt from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";
import {promises} from "dns"

const verifyToken = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) : Promise<any> => {
    try {
        /**read token from header */
        const header = req.headers.authorization
        const [type, token] = header ? 
            header.split(" "): []

        const signature = process.env.SECRET || ""
        const isVerivied = jwt.verify(token,signature)
        if(!isVerivied) {
            res.status(401).json({
                message: `Unauthorized`
            })
        }
        next()

    } catch (error) {
        res.status(401).json({
            message: error
        })
    }
}

export { verifyToken }