import { Router } from 'express';
import {
  getEventSite,
  saveEventSite,
  getEventSiteBySlug
} from '../controllers/eventSite.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public route
router.get('/event-sites/:slug', getEventSiteBySlug);

// Protected routes
router.get('/events/:eventId/site', authenticateToken, getEventSite);
router.post('/events/:eventId/site', authenticateToken, saveEventSite);

export default router;
