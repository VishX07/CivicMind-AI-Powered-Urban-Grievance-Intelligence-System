// routes/testRoutes.js
import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/protected', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Protected route accessed successfully',
    user: req.user,
  });
});

export default router;
