import { Router } from 'express';
import { getAllDisputes, getDisputeById, createDispute, updateDispute } from '../controllers/dispute.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateToken);

router.get('/disputes', getAllDisputes);
router.get('/disputes/:id', getDisputeById);
router.post('/disputes', createDispute);
router.put('/disputes/:id', updateDispute);

export default router;
