import { Router } from 'express';
import {
  getAllBadges,
  getPartnerBadges,
  awardBadge
} from '../controllers/badge.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/badges', getAllBadges);

// Protected routes
router.get('/partners/:partnerId/badges', authenticateToken, getPartnerBadges);
router.post('/partners/:partnerId/badges', authenticateToken, awardBadge);

export default router;
