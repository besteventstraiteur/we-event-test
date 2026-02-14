import { Router } from 'express';
import {
  getAllInspirations,
  getInspirationById,
  createInspiration,
  updateInspiration,
  deleteInspiration,
  likeInspiration,
  unlikeInspiration,
  getInspirationCategories,
  getTrends
} from '../controllers/inspiration.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (no auth needed)
router.get('/inspirations', getAllInspirations);
router.get('/inspirations/categories', getInspirationCategories);
router.get('/inspirations/trends', getTrends);
router.get('/inspirations/:id', getInspirationById);

// Protected routes (auth required)
router.post('/inspirations', authenticateToken, createInspiration);
router.put('/inspirations/:id', authenticateToken, updateInspiration);
router.delete('/inspirations/:id', authenticateToken, deleteInspiration);
router.post('/inspirations/:id/like', authenticateToken, likeInspiration);
router.delete('/inspirations/:id/like', authenticateToken, unlikeInspiration);

export default router;
