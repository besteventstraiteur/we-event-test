import { Request, Response } from 'express';
// import { prisma } from '../prisma';

/**
 * GET /api/badges
 * Get all badges
 */
export const getAllBadges = async (req: Request, res: Response) => {
  try {
    const badges = await prisma.badge.findMany({
      where: { active: true },
      orderBy: { requiredPoints: 'asc' }
    });

    res.json({ success: true, data: badges });
  } catch (error: any) {
    console.error('Error fetching badges:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch badges', message: error.message });
  }
};

/**
 * GET /api/partners/:partnerId/badges
 * Get all badges for a partner
 */
export const getPartnerBadges = async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;

    const partnerBadges = await prisma.partnerBadge.findMany({
      where: { partnerId },
      include: { badge: true },
      orderBy: { awardedAt: 'desc' }
    });

    res.json({ success: true, data: partnerBadges });
  } catch (error: any) {
    console.error('Error fetching partner badges:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch partner badges', message: error.message });
  }
};

/**
 * POST /api/partners/:partnerId/badges
 * Award a badge to a partner
 */
export const awardBadge = async (req: Request, res: Response) => {
  try {
    const { partnerId } = req.params;
    const { badgeId } = req.body;

    if (!badgeId) {
      return res.status(400).json({ success: false, error: 'Missing badgeId' });
    }

    // Check if badge exists
    const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
    if (!badge) {
      return res.status(404).json({ success: false, error: 'Badge not found' });
    }

    // Check if partner already has this badge
    const existing = await prisma.partnerBadge.findFirst({
      where: { partnerId, badgeId }
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Partner already has this badge' });
    }

    const partnerBadge = await prisma.partnerBadge.create({
      data: { partnerId, badgeId },
      include: { badge: true }
    });

    res.status(201).json({ success: true, data: partnerBadge });
  } catch (error: any) {
    console.error('Error awarding badge:', error);
    res.status(500).json({ success: false, error: 'Failed to award badge', message: error.message });
  }
};
