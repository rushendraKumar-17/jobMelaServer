import jobController from '../controllers/jobController.js';
import express from 'express';
import tokenVerification from "../middleware/tokenVerification.js"
const router = express.Router();

router.post('/add', tokenVerification(["admin"]),jobController.createJob);
router.get('/getAll', jobController.getAllJobs);
router.get('/getById/:id', jobController.getJobById);
router.delete('/delete/:id',tokenVerification(["admin"]), jobController.deleteJob);
router.put('/edit/:id', tokenVerification(["admin"]),jobController.editJob);
router.get('/getByCompany/:company',jobController.getJobsByCompany);
router.get("/apply/:jobId",tokenVerification(["user"]), jobController.applyForJob);
router.get("/:jobId/applications", tokenVerification(["admin"]),jobController.getApplicationsForJob);
router.post("/:applicationId/comment", tokenVerification(["admin"]),jobController.addComment);
router.put("/:applicationId/edit", tokenVerification(["admin"]),jobController.editApplication);
export default router;