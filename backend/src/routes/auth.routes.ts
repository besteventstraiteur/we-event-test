import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  updateProfile,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Register
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('role').isIn(['CLIENT', 'PROVIDER']).withMessage('Invalid role'),
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    validate,
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

// Refresh token
router.post('/refresh-token', refreshToken);

// Get current user
router.get('/me', authenticate, getCurrentUser);

// Update profile
router.put('/profile', authenticate, updateProfile);

export default router;
