import { Router } from "express"; 
import { createValidation,returnValidation, usageValidation } from "../Middleware/InventoryValidation";
import { analyzeItemUsage, analyzeUsage, createBorrow, returnItem } from "../Controller/inventoryController";
import { verifyToken } from "../Middleware/authorization";
import authorizeAdmin from "../Middleware/authorizeAdmin";

const router = Router()

router.post(`/`, [createValidation], createBorrow)

router.post(`/return`,[returnValidation, authorizeAdmin], returnItem)

router.post(`/inventory/usage-report`, [verifyToken, authorizeAdmin, usageValidation], analyzeUsage)

// router.get(`/:id`, readInventory)

// router.put(`/:id`,[updateValidation], updateInventory)

// router.delete(`/:id`, deleteInventory)

export default router