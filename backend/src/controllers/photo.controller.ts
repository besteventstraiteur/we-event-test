import { Request, Response } from 'express';
import { PrismaClient, PhotoType, PhotoCategory } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/events/:eventId/photos
 * Get all photos for an event
 */
export const getEventPhotos = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { type, category, uploaderEmail } = req.query;

    const where: any = { eventId };
    
    if (type) where.type = type as PhotoType;
    if (category) where.category = category as PhotoCategory;
    if (uploaderEmail) where.uploaderEmail = uploaderEmail;

    const photos = await prisma.eventPhoto.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: photos,
      count: photos.length
    });
  } catch (error: any) {
    console.error('Error fetching event photos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch photos',
      message: error.message
    });
  }
};

/**
 * POST /api/events/:eventId/photos
 * Upload a new photo
 */
export const uploadPhoto = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      url,
      thumbnailUrl,
      uploaderEmail,
      uploaderName,
      type,
      category,
      tags,
      caption
    } = req.body;

    // Validate required fields
    if (!url || !uploaderEmail || !uploaderName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: url, uploaderEmail, uploaderName'
      });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    const photo = await prisma.eventPhoto.create({
      data: {
        eventId,
        url,
        thumbnailUrl,
        uploaderEmail,
        uploaderName,
        type: type || 'GUEST',
        category: category || 'AUTRE',
        tags: tags || [],
        caption
      }
    });

    res.status(201).json({
      success: true,
      data: photo,
      message: 'Photo uploaded successfully'
    });
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload photo',
      message: error.message
    });
  }
};

/**
 * GET /api/photos/:id
 * Get single photo by ID
 */
export const getPhotoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const photo = await prisma.eventPhoto.findUnique({
      where: { id }
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }

    res.json({
      success: true,
      data: photo
    });
  } catch (error: any) {
    console.error('Error fetching photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch photo',
      message: error.message
    });
  }
};

/**
 * PUT /api/photos/:id
 * Update photo
 */
export const updatePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { caption, category, tags } = req.body;

    const photo = await prisma.eventPhoto.update({
      where: { id },
      data: {
        caption,
        category,
        tags
      }
    });

    res.json({
      success: true,
      data: photo,
      message: 'Photo updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update photo',
      message: error.message
    });
  }
};

/**
 * DELETE /api/photos/:id
 * Delete photo
 */
export const deletePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.eventPhoto.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete photo',
      message: error.message
    });
  }
};

/**
 * POST /api/photos/:id/like
 * Like a photo
 */
export const likePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'userEmail is required'
      });
    }

    const photo = await prisma.eventPhoto.findUnique({
      where: { id }
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }

    // Get current liked users
    const likedBy = (photo.likedBy as string[]) || [];
    
    // Check if user already liked
    if (likedBy.includes(userEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Photo already liked by this user'
      });
    }

    // Add like
    const updatedPhoto = await prisma.eventPhoto.update({
      where: { id },
      data: {
        likes: photo.likes + 1,
        likedBy: [...likedBy, userEmail]
      }
    });

    res.json({
      success: true,
      data: updatedPhoto,
      message: 'Photo liked successfully'
    });
  } catch (error: any) {
    console.error('Error liking photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like photo',
      message: error.message
    });
  }
};

/**
 * DELETE /api/photos/:id/like
 * Unlike a photo
 */
export const unlikePhoto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        error: 'userEmail is required'
      });
    }

    const photo = await prisma.eventPhoto.findUnique({
      where: { id }
    });

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: 'Photo not found'
      });
    }

    // Get current liked users
    const likedBy = (photo.likedBy as string[]) || [];
    
    // Check if user has liked
    if (!likedBy.includes(userEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Photo not liked by this user'
      });
    }

    // Remove like
    const updatedLikedBy = likedBy.filter(email => email !== userEmail);
    const updatedPhoto = await prisma.eventPhoto.update({
      where: { id },
      data: {
        likes: Math.max(0, photo.likes - 1),
        likedBy: updatedLikedBy
      }
    });

    res.json({
      success: true,
      data: updatedPhoto,
      message: 'Photo unliked successfully'
    });
  } catch (error: any) {
    console.error('Error unliking photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unlike photo',
      message: error.message
    });
  }
};
