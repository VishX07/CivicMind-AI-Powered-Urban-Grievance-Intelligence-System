// routes/adminRoutes.js
import express from 'express';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';
import {
  getAllComplaints,
  updateComplaint,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/complaints', auth, roleCheck, getAllComplaints);
router.patch('/complaints/:id', auth, roleCheck, updateComplaint);

export default router;
