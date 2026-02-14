import { Router } from 'express';
import { getAllAmbassadors, getAmbassadorById, createAmbassador, updateAmbassador } from '../controllers/ambassador.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/ambassadors', getAllAmbassadors);
router.get('/ambassadors/:id', getAmbassadorById);
router.post('/ambassadors', createAmbassador);
router.put('/ambassadors/:id', updateAmbassador);

export default router;
