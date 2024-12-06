import { Router } from "express";
import { createValidation,updateValidation,authValidation } from "../Middleware/UserValidation";
import { authentication,createUser,readUser,updateUser,deleteUser } from "../Controller/userController";
import { verifyToken } from "../Middleware/authorization";
const router = Router()

router.post(`/`, createUser)

router.get(`/`, [verifyToken],readUser)

router.put(`/:id`,[updateValidation, verifyToken], updateUser)

router.delete(`/:id`, verifyToken, deleteUser)

router.post(`/api/auth/login`, [authValidation], authentication )

export default router