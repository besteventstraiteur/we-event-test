import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getProviderPackages,
} from '../controllers/package.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Public routes
router.get('/', getPackages);
router.get('/:id', getPackageById);
router.get('/provider/:businessId', getProviderPackages);

// Protected routes (Provider only)
router.post(
  '/',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  [
    body('name').notEmpty().withMessage('Package name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description').optional().trim(),
    body('categoryId').optional().isUUID(),
    body('minCapacity').optional().isInt({ min: 1 }),
    body('maxCapacity').optional().isInt({ min: 1 }),
    validate,
  ],
  createPackage
);

router.put(
  '/:id',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  updatePackage
);

router.delete(
  '/:id',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  deletePackage
);

export default router;
