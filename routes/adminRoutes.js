import express from 'express';
const router = express.Router();

import adminController from '../controllers/adminController.js';

router.post('/add', adminController.signup);
router.post('/signin', adminController.signin);
router.post('/verify', adminController.verifyUser);
router.delete('/delete/:id', adminController.deleteAdmin);
router.get("/getAll",adminController.getAllAdmins);
router.put("/edit/:id",adminController.editAdmin);
router.put("/changeRole/:id",adminController.changeRole);
export default router;