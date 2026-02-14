import { Router } from 'express';
import { getContractsByBooking, getContractById, createContract, signContract } from '../controllers/contract.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/bookings/:bookingId/contracts', getContractsByBooking);
router.get('/contracts/:id', getContractById);
router.post('/contracts', createContract);
router.post('/contracts/:id/sign', signContract);

export default router;
