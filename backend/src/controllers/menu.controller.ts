import { Request, Response } from 'express';
// import { prisma } from '../prisma';

/**
 * GET /api/events/:eventId/menu-items
 * Get all menu items for an event
 */
export const getEventMenuItems = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { category } = req.query;

    const where: any = { eventId };
    if (category) where.category = category;

    const menuItems = await prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });

    res.json({ success: true, data: menuItems, count: menuItems.length });
  } catch (error: any) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch menu items', message: error.message });
  }
};

/**
 * POST /api/events/:eventId/menu-items
 * Create a new menu item
 */
export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      name,
      category,
      description,
      allergens,
      dietaryTags,
      pricePerPerson,
      available
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: name, category' 
      });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        eventId,
        name,
        category,
        description,
        allergens: allergens || [],
        dietaryTags: dietaryTags || [],
        pricePerPerson,
        available: available !== undefined ? available : true
      }
    });

    res.status(201).json({ success: true, data: menuItem });
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ success: false, error: 'Failed to create menu item', message: error.message });
  }
};

/**
 * PUT /api/menu-items/:id
 * Update a menu item
 */
export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, allergens, dietaryTags, pricePerPerson, available } = req.body;

    const menuItem = await prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { name, description, allergens, dietaryTags, pricePerPerson, available }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ success: false, error: 'Failed to update menu item', message: error.message });
  }
};

/**
 * DELETE /api/menu-items/:id
 * Delete a menu item
 */
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const menuItem = await prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }

    await prisma.menuItem.delete({ where: { id } });

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ success: false, error: 'Failed to delete menu item', message: error.message });
  }
};

/**
 * GET /api/events/:eventId/guest-menu-choices
 * Get all guest menu choices for an event
 */
export const getGuestMenuChoices = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const choices = await prisma.guestMenuChoice.findMany({
      where: { eventId },
      orderBy: { tableNumber: 'asc' }
    });

    res.json({ success: true, data: choices, count: choices.length });
  } catch (error: any) {
    console.error('Error fetching guest choices:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch guest choices', message: error.message });
  }
};

/**
 * POST /api/events/:eventId/guest-menu-choices
 * Create or update a guest menu choice
 */
export const saveGuestMenuChoice = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      guestName,
      guestEmail,
      selectedStarter,
      selectedMain,
      selectedDessert,
      allergies,
      specialRequests,
      tableNumber
    } = req.body;

    if (!guestName) {
      return res.status(400).json({ success: false, error: 'Missing required field: guestName' });
    }

    // Check if choice already exists for this guest
    let choice = await prisma.guestMenuChoice.findFirst({
      where: { eventId, guestEmail }
    });

    if (choice) {
      // Update existing choice
      choice = await prisma.guestMenuChoice.update({
        where: { id: choice.id },
        data: {
          guestName,
          selectedStarter,
          selectedMain,
          selectedDessert,
          allergies,
          specialRequests,
          tableNumber
        }
      });
    } else {
      // Create new choice
      choice = await prisma.guestMenuChoice.create({
        data: {
          eventId,
          guestName,
          guestEmail,
          selectedStarter,
          selectedMain,
          selectedDessert,
          allergies,
          specialRequests,
          tableNumber
        }
      });
    }

    res.json({ success: true, data: choice });
  } catch (error: any) {
    console.error('Error saving guest choice:', error);
    res.status(500).json({ success: false, error: 'Failed to save guest choice', message: error.message });
  }
};

/**
 * DELETE /api/guest-menu-choices/:id
 * Delete a guest menu choice
 */
export const deleteGuestMenuChoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const choice = await prisma.guestMenuChoice.findUnique({ where: { id } });
    if (!choice) {
      return res.status(404).json({ success: false, error: 'Guest choice not found' });
    }

    await prisma.guestMenuChoice.delete({ where: { id } });

    res.json({ success: true, message: 'Guest choice deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting guest choice:', error);
    res.status(500).json({ success: false, error: 'Failed to delete guest choice', message: error.message });
  }
};
