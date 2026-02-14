import { Router } from 'express';
import {
  getAllPodcasts,
  getPodcastById,
  createPodcast,
  updatePodcast,
  deletePodcast,
  ratePodcast
} from '../controllers/podcast.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/podcasts', getAllPodcasts);
router.get('/podcasts/:id', getPodcastById);

// Protected routes
router.post('/podcasts', authenticateToken, createPodcast);
router.put('/podcasts/:id', authenticateToken, updatePodcast);
router.delete('/podcasts/:id', authenticateToken, deletePodcast);
router.post('/podcasts/:id/rate', authenticateToken, ratePodcast);

export default router;
