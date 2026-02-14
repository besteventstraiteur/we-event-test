import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * GET /api/podcasts
 * Get all podcasts with filters and pagination
 */
export const getAllPodcasts = async (req: Request, res: Response) => {
  try {
    const { 
      type, 
      theme, 
      providerId, 
      search, 
      page = '1', 
      limit = '20',
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { status: 'PUBLISHED' };

    if (type) where.type = type;
    if (theme) where.theme = theme;
    if (providerId) where.providerId = providerId;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [podcasts, total] = await Promise.all([
      prisma.podcast.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy as string]: order }
      }),
      prisma.podcast.count({ where })
    ]);

    res.json({ 
      success: true, 
      data: podcasts, 
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching podcasts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch podcasts', message: error.message });
  }
};

/**
 * GET /api/podcasts/:id
 * Get a single podcast by ID
 */
export const getPodcastById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const podcast = await prisma.podcast.findUnique({
      where: { id }
    });

    if (!podcast) {
      return res.status(404).json({ success: false, error: 'Podcast not found' });
    }

    // Increment listens count
    await prisma.podcast.update({
      where: { id },
      data: { listens: { increment: 1 } }
    });

    res.json({ success: true, data: podcast });
  } catch (error: any) {
    console.error('Error fetching podcast:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch podcast', message: error.message });
  }
};

/**
 * POST /api/podcasts
 * Create a new podcast (admin/provider only)
 */
export const createPodcast = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      providerId,
      providerName,
      type,
      audioUrl,
      coverEmoji,
      duration,
      theme
    } = req.body;

    if (!title || !audioUrl || !providerId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: title, audioUrl, providerId' 
      });
    }

    const podcast = await prisma.podcast.create({
      data: {
        title,
        description,
        providerId,
        providerName,
        type: type || 'PODCAST',
        audioUrl,
        coverEmoji: coverEmoji || '🎙️',
        duration: duration || '00:00',
        theme,
        listens: 0,
        rating: 0,
        ratingsCount: 0,
        status: 'PUBLISHED'
      }
    });

    res.status(201).json({ success: true, data: podcast });
  } catch (error: any) {
    console.error('Error creating podcast:', error);
    res.status(500).json({ success: false, error: 'Failed to create podcast', message: error.message });
  }
};

/**
 * PUT /api/podcasts/:id
 * Update a podcast
 */
export const updatePodcast = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, audioUrl, coverEmoji, duration, theme, status } = req.body;

    const podcast = await prisma.podcast.findUnique({ where: { id } });
    if (!podcast) {
      return res.status(404).json({ success: false, error: 'Podcast not found' });
    }

    const updated = await prisma.podcast.update({
      where: { id },
      data: { title, description, audioUrl, coverEmoji, duration, theme, status }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating podcast:', error);
    res.status(500).json({ success: false, error: 'Failed to update podcast', message: error.message });
  }
};

/**
 * DELETE /api/podcasts/:id
 * Delete a podcast
 */
export const deletePodcast = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const podcast = await prisma.podcast.findUnique({ where: { id } });
    if (!podcast) {
      return res.status(404).json({ success: false, error: 'Podcast not found' });
    }

    await prisma.podcast.delete({ where: { id } });

    res.json({ success: true, message: 'Podcast deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting podcast:', error);
    res.status(500).json({ success: false, error: 'Failed to delete podcast', message: error.message });
  }
};

/**
 * POST /api/podcasts/:id/rate
 * Rate a podcast
 */
export const ratePodcast = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Invalid rating (must be 1-5)' });
    }

    const podcast = await prisma.podcast.findUnique({ where: { id } });
    if (!podcast) {
      return res.status(404).json({ success: false, error: 'Podcast not found' });
    }

    // Calculate new average rating
    const currentTotal = podcast.rating * podcast.ratingsCount;
    const newCount = podcast.ratingsCount + 1;
    const newRating = (currentTotal + rating) / newCount;

    const updated = await prisma.podcast.update({
      where: { id },
      data: {
        rating: newRating,
        ratingsCount: newCount
      }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error rating podcast:', error);
    res.status(500).json({ success: false, error: 'Failed to rate podcast', message: error.message });
  }
};
