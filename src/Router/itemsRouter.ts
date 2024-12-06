import { Router } from "express";
import { createItems, deleteItem, readItems, updateItem } from "../Controller/itemsController";
import { createValidation, updateValidation } from "../Middleware/itemValidation";
import { verifyToken } from "../Middleware/authorization";
import authorizeAdmin from "../Middleware/authorizeAdmin";

const router = Router()

router.post(`/`, [createValidation, verifyToken, authorizeAdmin], createItems)
router.get('/inventory/:id?',[verifyToken], readItems)
router.put('/inventory/:id', [updateValidation, verifyToken, authorizeAdmin], updateItem)
router.delete('/inventory/:id',authorizeAdmin, deleteItem)

export default router