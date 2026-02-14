import { Response } from 'express';
// import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.user!;
    const where: any = {};

    if (role === 'CLIENT') {
      where.clientId = req.user!.id;
    } else if (role === 'PROVIDER') {
      const business = await prisma.businessProfile.findUnique({
        where: { userId: req.user!.id },
      });
      if (business) {
        where.businessId = business.id;
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        package: true,
        business: {
          select: {
            id: true,
            businessName: true,
            logo: true,
            phone: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: { bookings } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        package: true,
        business: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        event: true,
        rating: true,
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    res.json({ success: true, data: { booking } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { packageId, businessId, eventId, eventDate, numberOfGuests, totalPrice, notes } = req.body;

    const booking = await prisma.booking.create({
      data: {
        clientId: req.user!.id,
        packageId,
        businessId,
        eventId,
        bookingDate: new Date(),
        eventDate: new Date(eventDate),
        numberOfGuests: parseInt(numberOfGuests),
        totalPrice: parseFloat(totalPrice),
        notes,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: {
        package: true,
        business: {
          select: {
            businessName: true,
            logo: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        ...(status === 'CONFIRMED' && { confirmedAt: new Date() }),
        ...(status === 'COMPLETED' && { completedAt: new Date() }),
      },
    });

    res.json({
      success: true,
      message: 'Booking status updated',
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
};
