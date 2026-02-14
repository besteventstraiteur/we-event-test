import { Router } from 'express';
import {
  getEventVideos,
  uploadVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  addVideoComment,
  deleteVideoComment
} from '../controllers/video.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Event videos routes
router.get('/events/:eventId/videos', getEventVideos);
router.post('/events/:eventId/videos', uploadVideo);

// Single video routes
router.get('/videos/:id', getVideoById);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', deleteVideo);

// Video comments routes
router.post('/videos/:id/comments', addVideoComment);
router.delete('/videos/:videoId/comments/:commentId', deleteVideoComment);

export default router;
