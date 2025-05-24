import express from 'express';
import { getAllRecruiterInterests } from '../controllers/statController.js'; // Adjust the import path as necessary

const router = express.Router();

router.get('/', getAllRecruiterInterests); // GET /api/recruiter-interests

export default router;
