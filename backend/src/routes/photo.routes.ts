import { Router } from 'express';
import {
  getEventPhotos,
  uploadPhoto,
  getPhotoById,
  updatePhoto,
  deletePhoto,
  likePhoto,
  unlikePhoto
} from '../controllers/photo.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Event photos routes
router.get('/events/:eventId/photos', getEventPhotos);
router.post('/events/:eventId/photos', uploadPhoto);

// Single photo routes
router.get('/photos/:id', getPhotoById);
router.put('/photos/:id', updatePhoto);
router.delete('/photos/:id', deletePhoto);

// Like/Unlike routes
router.post('/photos/:id/like', likePhoto);
router.delete('/photos/:id/like', unlikePhoto);

export default router;
