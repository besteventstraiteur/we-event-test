import { Request, Response } from 'express';
// import { prisma } from '../prisma';

export const getContractsByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const contracts = await prisma.contract.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: contracts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch contracts', message: error.message });
  }
};

export const getContractById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contract = await prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      return res.status(404).json({ success: false, error: 'Contract not found' });
    }
    res.json({ success: true, data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch contract', message: error.message });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const { bookingId, contractNumber, clientEmail, clientName, partnerEmail, partnerName, content } = req.body;
    if (!bookingId || !clientEmail || !partnerEmail || !content) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const contract = await prisma.contract.create({
      data: { 
        bookingId, 
        contractNumber: contractNumber || `CTR-${Date.now()}`, 
        clientEmail, 
        clientName, 
        partnerEmail, 
        partnerName, 
        content, 
        status: 'DRAFT' 
      }
    });
    res.status(201).json({ success: true, data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create contract', message: error.message });
  }
};

export const signContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { signatureData } = req.body;
    const contract = await prisma.contract.update({
      where: { id },
      data: { status: 'SIGNED', signedAt: new Date(), signatureData }
    });
    res.json({ success: true, data: contract });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to sign contract', message: error.message });
  }
};
