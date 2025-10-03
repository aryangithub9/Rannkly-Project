import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/User.Controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import {
  updateUserValidation,
  mongoIdValidation,
  validate
} from '../utils/Validator.js';

// Protect all user routes
router.use(protect);

// Stats route - Manager and Admin only
router.get('/stats', authorize('Manager', 'Admin'), getUserStats);

// Get all users - Manager and Admin only
router.get('/', authorize('Manager', 'Admin'), getUsers);

// User-specific routes
router
  .route('/:id')
  .get(mongoIdValidation, validate, getUser)
  .put(mongoIdValidation, updateUserValidation, validate, updateUser)
  .delete(mongoIdValidation, validate, authorize('Admin'), deleteUser);

export default router;