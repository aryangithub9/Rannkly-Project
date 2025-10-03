import express from 'express';
const router = express.Router();
import { register, login, getMe } from '../controllers/Auth.Controller.js';
import { protect } from '../middleware/authMiddleware.js';
import { 
  registerValidation, 
  loginValidation, 
  validate 
} from '../utils/Validator.js';

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);

export default router;