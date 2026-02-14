import { Request, Response } from 'express';
// import { prisma } from '../prisma';

export const getAllAmbassadors = async (req: Request, res: Response) => {
  try {
    const ambassadors = await prisma.ambassador.findMany({
      where: { active: true },
      orderBy: { totalCommission: 'desc' }
    });
    res.json({ success: true, data: ambassadors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch ambassadors', message: error.message });
  }
};

export const getAmbassadorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ambassador = await prisma.ambassador.findUnique({ where: { id } });
    if (!ambassador) {
      return res.status(404).json({ success: false, error: 'Ambassador not found' });
    }
    res.json({ success: true, data: ambassador });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch ambassador', message: error.message });
  }
};

export const createAmbassador = async (req: Request, res: Response) => {
  try {
    const { email, fullName, phone, referralCode, commissionRate } = req.body;
    if (!email || !fullName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const ambassador = await prisma.ambassador.create({
      data: { email, fullName, phone, referralCode, commissionRate: commissionRate || 10, active: true }
    });
    res.status(201).json({ success: true, data: ambassador });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create ambassador', message: error.message });
  }
};

export const updateAmbassador = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phone, commissionRate, active } = req.body;
    const ambassador = await prisma.ambassador.update({
      where: { id },
      data: { fullName, phone, commissionRate, active }
    });
    res.json({ success: true, data: ambassador });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update ambassador', message: error.message });
  }
};
