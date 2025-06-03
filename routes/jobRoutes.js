import jobController from '../controllers/jobController.js';
import express from 'express';
const router = express.Router();

router.post('/add', jobController.createJob);
router.get('/getAll', jobController.getAllJobs);
router.get('/getById/:id', jobController.getJobById);
router.delete('/delete/:id', jobController.deleteJob);
router.put('/edit/:id', jobController.editJob);
router.get('/getByCompany/:company', jobController.getJobsByCompany);
router.get("/apply/:jobId", jobController.applyForJob);
router.get("/:jobId/applications", jobController.getApplicationsForJob);
router.post("/:applicationId/comment", jobController.addComment);
router.put("/:applicationId/edit", jobController.editApplication);
export default router;