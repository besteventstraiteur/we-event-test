import { Router } from 'express';
import {
  getEventPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlist.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Event playlists routes
router.get('/events/:eventId/playlists', getEventPlaylists);
router.post('/events/:eventId/playlists', createPlaylist);

// Single playlist routes
router.get('/playlists/:id', getPlaylistById);
router.put('/playlists/:id', updatePlaylist);
router.delete('/playlists/:id', deletePlaylist);

// Playlist songs management
router.post('/playlists/:id/songs', addSongToPlaylist);
router.delete('/playlists/:id/songs/:songIndex', removeSongFromPlaylist);

export default router;
