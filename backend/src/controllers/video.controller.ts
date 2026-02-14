import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * GET /api/events/:eventId/videos
 * Get all videos for an event with optional filters
 */
export const getEventVideos = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { type, uploaderEmail, status } = req.query;

    const where: any = { eventId };

    if (type) where.type = type;
    if (uploaderEmail) where.uploaderEmail = uploaderEmail as string;
    if (status) where.status = status;

    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    res.json({ success: true, data: videos, count: videos.length });
  } catch (error: any) {
    console.error('Error fetching event videos:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch videos', message: error.message });
  }
};

/**
 * POST /api/events/:eventId/videos
 * Upload a new video to an event
 */
export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { 
      title, 
      url, 
      thumbnailUrl, 
      uploaderEmail, 
      uploaderName, 
      type, 
      duration, 
      description 
    } = req.body;

    // Validate required fields
    if (!url || !uploaderEmail) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: url, uploaderEmail' 
      });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const newVideo = await prisma.video.create({
      data: {
        eventId,
        title: title || 'Untitled Video',
        url,
        thumbnailUrl,
        uploaderEmail,
        uploaderName: uploaderName || uploaderEmail,
        type: type || 'PRO',
        duration: duration || '00:00',
        description,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({ success: true, data: newVideo });
  } catch (error: any) {
    console.error('Error uploading video:', error);
    res.status(500).json({ success: false, error: 'Failed to upload video', message: error.message });
  }
};

/**
 * GET /api/videos/:id
 * Get a single video by ID
 */
export const getVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    res.json({ success: true, data: video });
  } catch (error: any) {
    console.error('Error fetching video:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch video', message: error.message });
  }
};

/**
 * PUT /api/videos/:id
 * Update a video
 */
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnailUrl, status } = req.body;

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    const updatedVideo = await prisma.video.update({
      where: { id },
      data: { title, description, thumbnailUrl, status }
    });

    res.json({ success: true, data: updatedVideo });
  } catch (error: any) {
    console.error('Error updating video:', error);
    res.status(500).json({ success: false, error: 'Failed to update video', message: error.message });
  }
};

/**
 * DELETE /api/videos/:id
 * Delete a video
 */
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    // Delete all comments first
    await prisma.videoComment.deleteMany({ where: { videoId: id } });
    
    // Delete the video
    await prisma.video.delete({ where: { id } });

    res.json({ success: true, message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting video:', error);
    res.status(500).json({ success: false, error: 'Failed to delete video', message: error.message });
  }
};

/**
 * POST /api/videos/:id/comments
 * Add a comment to a video (with timeline support)
 */
export const addVideoComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { authorEmail, authorName, content, timecode, selectionStart, selectionEnd } = req.body;

    if (!authorEmail || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: authorEmail, content' 
      });
    }

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video not found' });
    }

    const comment = await prisma.videoComment.create({
      data: {
        videoId: id,
        authorEmail,
        authorName: authorName || authorEmail,
        content,
        timecode,
        selectionStart,
        selectionEnd
      }
    });

    res.status(201).json({ success: true, data: comment });
  } catch (error: any) {
    console.error('Error adding video comment:', error);
    res.status(500).json({ success: false, error: 'Failed to add comment', message: error.message });
  }
};

/**
 * DELETE /api/videos/:videoId/comments/:commentId
 * Delete a video comment
 */
export const deleteVideoComment = async (req: Request, res: Response) => {
  try {
    const { videoId, commentId } = req.params;

    const comment = await prisma.videoComment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    if (comment.videoId !== videoId) {
      return res.status(400).json({ success: false, error: 'Comment does not belong to this video' });
    }

    await prisma.videoComment.delete({ where: { id: commentId } });

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ success: false, error: 'Failed to delete comment', message: error.message });
  }
};
