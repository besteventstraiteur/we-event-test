import { Router } from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

router.get('/', getBookings);
router.get('/:id', getBookingById);

router.post(
  '/',
  [
    body('packageId').optional().isUUID(),
    body('businessId').isUUID().withMessage('Business ID is required'),
    body('eventDate').isISO8601().withMessage('Valid event date is required'),
    body('numberOfGuests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
    body('totalPrice').isFloat({ min: 0 }).withMessage('Total price must be positive'),
    validate,
  ],
  createBooking
);

router.patch('/:id/status', authorize('PROVIDER', 'ADMIN'), updateBookingStatus);
router.patch('/:id/cancel', cancelBooking);

export default router;
