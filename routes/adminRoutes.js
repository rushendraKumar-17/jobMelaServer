import express from 'express';
const router = express.Router();

import adminController from '../controllers/adminController.js';
import tokenVerification from '../middleware/tokenVerification.js';

router.post('/add', tokenVerification(["super-admin"]),adminController.signup);
// router.post('/signin', tokenVerification,adminController.signin);
// router.post('/verify', tokenVerification,adminController.verifyUser);
router.delete('/delete/:id', tokenVerification(["super-admin"]),adminController.deleteAdmin);
router.get("/getAll",tokenVerification(["super-admin"]),adminController.getAllAdmins);
router.put("/edit/:id",tokenVerification(["super-admin"]),adminController.editAdmin);
router.put("/changeRole/:id",tokenVerification(["super-admin"]),adminController.changeRole);
router.get("/report",tokenVerification(["admin"]),adminController.getReport);
export default router;