import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * GET /api/inspirations
 * Get all inspirations with filters and pagination
 */
export const getAllInspirations = async (req: Request, res: Response) => {
  try {
    const { 
      categoryId, 
      theme, 
      tags, 
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

    if (categoryId) where.categoryId = categoryId;
    if (theme) where.theme = theme;
    if (tags) {
      where.tags = {
        hasSome: Array.isArray(tags) ? tags : [tags]
      };
    }
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [inspirations, total] = await Promise.all([
      prisma.inspiration.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [sortBy as string]: order },
        include: {
          category: true,
          likedBy: { select: { userId: true } }
        }
      }),
      prisma.inspiration.count({ where })
    ]);

    // Increment views count for displayed inspirations
    await prisma.inspiration.updateMany({
      where: { id: { in: inspirations.map(i => i.id) } },
      data: { views: { increment: 1 } }
    });

    res.json({ 
      success: true, 
      data: inspirations, 
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching inspirations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inspirations', message: error.message });
  }
};

/**
 * GET /api/inspirations/:id
 * Get a single inspiration by ID
 */
export const getInspirationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const inspiration = await prisma.inspiration.findUnique({
      where: { id },
      include: {
        category: true,
        likedBy: { select: { userId: true, createdAt: true } }
      }
    });

    if (!inspiration) {
      return res.status(404).json({ success: false, error: 'Inspiration not found' });
    }

    // Increment view count
    await prisma.inspiration.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    res.json({ success: true, data: inspiration });
  } catch (error: any) {
    console.error('Error fetching inspiration:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inspiration', message: error.message });
  }
};

/**
 * POST /api/inspirations
 * Create a new inspiration (admin/partner only)
 */
export const createInspiration = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      imageUrl,
      categoryId,
      theme,
      tags,
      photographerName,
      photographerEmail,
      partnerIds
    } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: title, imageUrl' 
      });
    }

    const inspiration = await prisma.inspiration.create({
      data: {
        title,
        description,
        imageUrl,
        categoryId,
        theme,
        tags: tags || [],
        photographerName,
        photographerEmail,
        partnerIds: partnerIds || [],
        status: 'PUBLISHED',
        likes: 0,
        views: 0
      }
    });

    res.status(201).json({ success: true, data: inspiration });
  } catch (error: any) {
    console.error('Error creating inspiration:', error);
    res.status(500).json({ success: false, error: 'Failed to create inspiration', message: error.message });
  }
};

/**
 * PUT /api/inspirations/:id
 * Update an inspiration
 */
export const updateInspiration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, categoryId, theme, tags, status } = req.body;

    const inspiration = await prisma.inspiration.findUnique({ where: { id } });
    if (!inspiration) {
      return res.status(404).json({ success: false, error: 'Inspiration not found' });
    }

    const updated = await prisma.inspiration.update({
      where: { id },
      data: { title, description, imageUrl, categoryId, theme, tags, status }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating inspiration:', error);
    res.status(500).json({ success: false, error: 'Failed to update inspiration', message: error.message });
  }
};

/**
 * DELETE /api/inspirations/:id
 * Delete an inspiration
 */
export const deleteInspiration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const inspiration = await prisma.inspiration.findUnique({ where: { id } });
    if (!inspiration) {
      return res.status(404).json({ success: false, error: 'Inspiration not found' });
    }

    // Delete related UserInspirations first
    await prisma.userInspiration.deleteMany({ where: { inspirationId: id } });

    // Delete the inspiration
    await prisma.inspiration.delete({ where: { id } });

    res.json({ success: true, message: 'Inspiration deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting inspiration:', error);
    res.status(500).json({ success: false, error: 'Failed to delete inspiration', message: error.message });
  }
};

/**
 * POST /api/inspirations/:id/like
 * Like an inspiration
 */
export const likeInspiration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing userId' });
    }

    const inspiration = await prisma.inspiration.findUnique({ where: { id } });
    if (!inspiration) {
      return res.status(404).json({ success: false, error: 'Inspiration not found' });
    }

    // Check if already liked
    const existingLike = await prisma.userInspiration.findFirst({
      where: { userId, inspirationId: id }
    });

    if (existingLike) {
      return res.status(400).json({ success: false, error: 'Already liked' });
    }

    // Create like and increment count
    await prisma.$transaction([
      prisma.userInspiration.create({
        data: { userId, inspirationId: id }
      }),
      prisma.inspiration.update({
        where: { id },
        data: { likes: { increment: 1 } }
      })
    ]);

    res.json({ success: true, message: 'Inspiration liked' });
  } catch (error: any) {
    console.error('Error liking inspiration:', error);
    res.status(500).json({ success: false, error: 'Failed to like inspiration', message: error.message });
  }
};

/**
 * DELETE /api/inspirations/:id/like
 * Unlike an inspiration
 */
export const unlikeInspiration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, error: 'Missing userId' });
    }

    const userInspiration = await prisma.userInspiration.findFirst({
      where: { userId, inspirationId: id }
    });

    if (!userInspiration) {
      return res.status(404).json({ success: false, error: 'Like not found' });
    }

    // Delete like and decrement count
    await prisma.$transaction([
      prisma.userInspiration.delete({ where: { id: userInspiration.id } }),
      prisma.inspiration.update({
        where: { id },
        data: { likes: { decrement: 1 } }
      })
    ]);

    res.json({ success: true, message: 'Inspiration unliked' });
  } catch (error: any) {
    console.error('Error unliking inspiration:', error);
    res.status(500).json({ success: false, error: 'Failed to unlike inspiration', message: error.message });
  }
};

/**
 * GET /api/inspirations/categories
 * Get all inspiration categories
 */
export const getInspirationCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.inspirationCategory.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });

    res.json({ success: true, data: categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch categories', message: error.message });
  }
};

/**
 * GET /api/inspirations/trends
 * Get all trends
 */
export const getTrends = async (req: Request, res: Response) => {
  try {
    const trends = await prisma.trend.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    });

    res.json({ success: true, data: trends });
  } catch (error: any) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trends', message: error.message });
  }
};
