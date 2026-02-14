import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * GET /api/events/:eventId/site
 * Get event mini-site configuration
 */
export const getEventSite = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const eventSite = await prisma.eventSite.findUnique({
      where: { eventId }
    });

    if (!eventSite) {
      return res.status(404).json({ success: false, error: 'Event site not found' });
    }

    res.json({ success: true, data: eventSite });
  } catch (error: any) {
    console.error('Error fetching event site:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch event site', message: error.message });
  }
};

/**
 * POST /api/events/:eventId/site
 * Create or update event mini-site configuration
 */
export const saveEventSite = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      slug,
      title,
      coverImage,
      welcomeMessage,
      modules,
      crowdfundingUrl,
      theme,
      primaryColor,
      schedule,
      published
    } = req.body;

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check if site already exists
    let eventSite = await prisma.eventSite.findUnique({ where: { eventId } });

    if (eventSite) {
      // Update existing site
      eventSite = await prisma.eventSite.update({
        where: { eventId },
        data: {
          slug,
          title,
          coverImage,
          welcomeMessage,
          modules,
          crowdfundingUrl,
          theme,
          primaryColor,
          schedule,
          published
        }
      });
    } else {
      // Create new site
      eventSite = await prisma.eventSite.create({
        data: {
          eventId,
          slug: slug || `event-${eventId}`,
          title: title || event.name,
          coverImage,
          welcomeMessage,
          modules: modules || {},
          crowdfundingUrl,
          theme: theme || 'elegant',
          primaryColor: primaryColor || '#1e3a5f',
          schedule: schedule || [],
          published: published || false
        }
      });
    }

    res.json({ success: true, data: eventSite });
  } catch (error: any) {
    console.error('Error saving event site:', error);
    res.status(500).json({ success: false, error: 'Failed to save event site', message: error.message });
  }
};

/**
 * GET /api/event-sites/:slug
 * Get event mini-site by slug (public)
 */
export const getEventSiteBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const eventSite = await prisma.eventSite.findUnique({
      where: { slug },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            date: true,
            location: true,
            description: true
          }
        }
      }
    });

    if (!eventSite) {
      return res.status(404).json({ success: false, error: 'Event site not found' });
    }

    if (!eventSite.published) {
      return res.status(403).json({ success: false, error: 'Event site is not published' });
    }

    res.json({ success: true, data: eventSite });
  } catch (error: any) {
    console.error('Error fetching event site by slug:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch event site', message: error.message });
  }
};
