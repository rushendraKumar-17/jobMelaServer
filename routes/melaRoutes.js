import express from "express";
import melaController from "../controllers/melaController.js";
const router = express.Router();

router.get("/getReport/:id",melaController.getReport);
router.post("/create",melaController.create);
router.get("/getMela/:id",melaController.getMela);
export default router;