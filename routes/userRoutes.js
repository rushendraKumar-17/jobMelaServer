import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();


router.post('/signup',userController.signUp );
router.put("/edit/:id",userController.editProfile);
router.post('/signin', userController.signIn );
router.get('/profile', userController.getProfile );
router.post('/verify-email', userController.verifyEmail );
router.get("/getById/:id",userController.getById);
router.get("/getEnrolledJobs/:id",userController.getAppliedJobs);
export default router;