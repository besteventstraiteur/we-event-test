import { Request, Response } from 'express';
// import { prisma } from '../prisma';

export const getAllDisputes = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = status;
    
    const disputes = await prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: disputes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch disputes', message: error.message });
  }
};

export const getDisputeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dispute = await prisma.dispute.findUnique({ where: { id } });
    if (!dispute) {
      return res.status(404).json({ success: false, error: 'Dispute not found' });
    }
    res.json({ success: true, data: dispute });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch dispute', message: error.message });
  }
};

export const createDispute = async (req: Request, res: Response) => {
  try {
    const { bookingId, clientEmail, partnerEmail, reason, description } = req.body;
    if (!bookingId || !clientEmail || !partnerEmail || !reason) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const dispute = await prisma.dispute.create({
      data: { bookingId, clientEmail, partnerEmail, reason, description, status: 'OPEN' }
    });
    res.status(201).json({ success: true, data: dispute });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create dispute', message: error.message });
  }
};

export const updateDispute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, resolution, adminNotes } = req.body;
    const dispute = await prisma.dispute.update({
      where: { id },
      data: { status, resolution, adminNotes, resolvedAt: status === 'RESOLVED' ? new Date() : undefined }
    });
    res.json({ success: true, data: dispute });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update dispute', message: error.message });
  }
};
