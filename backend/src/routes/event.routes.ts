import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  res.json({ success: true, data: { events: [] } });
});

router.post('/', async (req, res) => {
  res.json({ success: true, message: 'Event created' });
});

export default router;
