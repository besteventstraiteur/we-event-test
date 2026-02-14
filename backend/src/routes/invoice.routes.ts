import { Router } from 'express';
import { getInvoicesByBooking, getInvoiceById, createInvoice, updateInvoice } from '../controllers/invoice.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/bookings/:bookingId/invoices', getInvoicesByBooking);
router.get('/invoices/:id', getInvoiceById);
router.post('/invoices', createInvoice);
router.put('/invoices/:id', updateInvoice);

export default router;
