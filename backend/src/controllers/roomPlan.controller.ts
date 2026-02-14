import { Request, Response } from 'express';
import { prisma } from '../server';

/**
 * GET /api/events/:eventId/room-plans
 * Get all room plans for an event
 */
export const getEventRoomPlans = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;

    const roomPlans = await prisma.roomPlan.findMany({
      where: { eventId },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ success: true, data: roomPlans, count: roomPlans.length });
  } catch (error: any) {
    console.error('Error fetching room plans:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch room plans', message: error.message });
  }
};

/**
 * GET /api/room-plans/:id
 * Get a single room plan by ID
 */
export const getRoomPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const roomPlan = await prisma.roomPlan.findUnique({
      where: { id }
    });

    if (!roomPlan) {
      return res.status(404).json({ success: false, error: 'Room plan not found' });
    }

    res.json({ success: true, data: roomPlan });
  } catch (error: any) {
    console.error('Error fetching room plan:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch room plan', message: error.message });
  }
};

/**
 * POST /api/events/:eventId/room-plans
 * Create a new room plan
 */
export const createRoomPlan = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      name,
      width,
      length,
      capacity,
      floorMaterial,
      wallMaterial,
      elements
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Missing required field: name' });
    }

    // Check if event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    const roomPlan = await prisma.roomPlan.create({
      data: {
        eventId,
        name,
        width,
        length,
        capacity,
        floorMaterial,
        wallMaterial,
        elements: elements || []
      }
    });

    res.status(201).json({ success: true, data: roomPlan });
  } catch (error: any) {
    console.error('Error creating room plan:', error);
    res.status(500).json({ success: false, error: 'Failed to create room plan', message: error.message });
  }
};

/**
 * PUT /api/room-plans/:id
 * Update a room plan
 */
export const updateRoomPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, width, length, capacity, floorMaterial, wallMaterial, elements } = req.body;

    const roomPlan = await prisma.roomPlan.findUnique({ where: { id } });
    if (!roomPlan) {
      return res.status(404).json({ success: false, error: 'Room plan not found' });
    }

    const updated = await prisma.roomPlan.update({
      where: { id },
      data: { name, width, length, capacity, floorMaterial, wallMaterial, elements }
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating room plan:', error);
    res.status(500).json({ success: false, error: 'Failed to update room plan', message: error.message });
  }
};

/**
 * DELETE /api/room-plans/:id
 * Delete a room plan
 */
export const deleteRoomPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const roomPlan = await prisma.roomPlan.findUnique({ where: { id } });
    if (!roomPlan) {
      return res.status(404).json({ success: false, error: 'Room plan not found' });
    }

    await prisma.roomPlan.delete({ where: { id } });

    res.json({ success: true, message: 'Room plan deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting room plan:', error);
    res.status(500).json({ success: false, error: 'Failed to delete room plan', message: error.message });
  }
};
