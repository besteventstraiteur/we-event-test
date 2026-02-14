import { Router } from 'express';
import {
  getEventMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getGuestMenuChoices,
  saveGuestMenuChoice,
  deleteGuestMenuChoice
} from '../controllers/menu.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Menu items routes
router.get('/events/:eventId/menu-items', getEventMenuItems);
router.post('/events/:eventId/menu-items', createMenuItem);
router.put('/menu-items/:id', updateMenuItem);
router.delete('/menu-items/:id', deleteMenuItem);

// Guest menu choices routes
router.get('/events/:eventId/guest-menu-choices', getGuestMenuChoices);
router.post('/events/:eventId/guest-menu-choices', saveGuestMenuChoice);
router.delete('/guest-menu-choices/:id', deleteGuestMenuChoice);

export default router;
