import { Router } from 'express';
import {
  getEventRoomPlans,
  getRoomPlanById,
  createRoomPlan,
  updateRoomPlan,
  deleteRoomPlan
} from '../controllers/roomPlan.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Event room plans routes
router.get('/events/:eventId/room-plans', getEventRoomPlans);
router.post('/events/:eventId/room-plans', createRoomPlan);

// Single room plan routes
router.get('/room-plans/:id', getRoomPlanById);
router.put('/room-plans/:id', updateRoomPlan);
router.delete('/room-plans/:id', deleteRoomPlan);

export default router;
