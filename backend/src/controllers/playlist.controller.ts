import { Request, Response } from 'express';
// import { prisma } from '../prisma';

/**
 * GET /api/events/:eventId/playlists
 * Get all playlists for an event
 */
export const getEventPlaylists = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const playlists = await prisma.playlist.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: playlists, count: playlists.length });
  } catch (error: any) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch playlists', message: error.message });
  }
};

/**
 * GET /api/playlists/:id
 * Get a single playlist by ID
 */
export const getPlaylistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({
      where: { id }
    });

    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    res.json({ success: true, data: playlist });
  } catch (error: any) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch playlist', message: error.message });
  }
};

/**
 * POST /api/events/:eventId/playlists
 * Create a new playlist for an event
 */
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      name,
      songs,
      avoidSongs,
      mood,
      djPartnerId,
      djPartnerName
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Missing required field: name' });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const playlist = await prisma.playlist.create({
      data: {
        eventId,
        name,
        songs: songs || [],
        avoidSongs: avoidSongs || [],
        mood,
        djPartnerId,
        djPartnerName,
        status: 'DRAFT'
      }
    });

    res.status(201).json({ success: true, data: playlist });
  } catch (error: any) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ success: false, error: 'Failed to create playlist', message: error.message });
  }
};

/**
 * PUT /api/playlists/:id
 * Update a playlist
 */
export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, songs, avoidSongs, mood, status } = req.body;

    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    const updated = await prisma.playlist.update({
      where: { id },
      data: { name, songs, avoidSongs, mood, status }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ success: false, error: 'Failed to update playlist', message: error.message });
  }
};

/**
 * DELETE /api/playlists/:id
 * Delete a playlist
 */
export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    await prisma.playlist.delete({ where: { id } });

    res.json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ success: false, error: 'Failed to delete playlist', message: error.message });
  }
};

/**
 * POST /api/playlists/:id/songs
 * Add a song to a playlist
 */
export const addSongToPlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, artist, duration, moment } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: title, artist' 
      });
    }

    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    const newSong = { title, artist, duration, moment };
    const updatedSongs = [...(playlist.songs as any[]), newSong];

    const updated = await prisma.playlist.update({
      where: { id },
      data: { songs: updatedSongs }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error adding song:', error);
    res.status(500).json({ success: false, error: 'Failed to add song', message: error.message });
  }
};

/**
 * DELETE /api/playlists/:id/songs/:songIndex
 * Remove a song from a playlist
 */
export const removeSongFromPlaylist = async (req: Request, res: Response) => {
  try {
    const { id, songIndex } = req.params;
    const index = parseInt(songIndex);

    const playlist = await prisma.playlist.findUnique({ where: { id } });
    if (!playlist) {
      return res.status(404).json({ success: false, error: 'Playlist not found' });
    }

    const songs = playlist.songs as any[];
    if (index < 0 || index >= songs.length) {
      return res.status(400).json({ success: false, error: 'Invalid song index' });
    }

    songs.splice(index, 1);

    const updated = await prisma.playlist.update({
      where: { id },
      data: { songs }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error removing song:', error);
    res.status(500).json({ success: false, error: 'Failed to remove song', message: error.message });
  }
};
