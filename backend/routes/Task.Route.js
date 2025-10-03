import express from 'express';
const router = express.Router();
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/Task.Controller.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  taskValidation,
  updateTaskValidation,
  mongoIdValidation,
  validate
} from '../utils/Validator.js';

// Protect all task routes
router.use(protect);

// Stats route (must be before /:id route)
router.get('/stats', getTaskStats);

// Main task routes
router
  .route('/')
  .get(getTasks)
  .post(taskValidation, validate, createTask);

router
  .route('/:id')
  .get(mongoIdValidation, validate, getTask)
  .put(mongoIdValidation, updateTaskValidation, validate, updateTask)
  .delete(mongoIdValidation, validate, deleteTask);

export default router;