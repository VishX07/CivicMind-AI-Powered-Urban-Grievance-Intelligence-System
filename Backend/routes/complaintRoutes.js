// routes/complaintRoutes.js (UPDATE)
import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
} from '../controllers/complaintController.js';

const router = express.Router();

router.post('/', auth, upload.single('image'), createComplaint);
router.get('/my', auth, getMyComplaints);
router.get('/:id', auth, getComplaintById);

export default router;
