import { Request, Response } from 'express';
import { prisma } from '../server';

export const getInvoicesByBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const invoices = await prisma.invoice.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: invoices });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch invoices', message: error.message });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }
    res.json({ success: true, data: invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to fetch invoice', message: error.message });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const { bookingId, invoiceNumber, clientEmail, clientName, providerName, serviceDescription, amount, dueDate } = req.body;
    if (!bookingId || !clientEmail || !amount) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const invoice = await prisma.invoice.create({
      data: { 
        bookingId, 
        invoiceNumber: invoiceNumber || `INV-${Date.now()}`, 
        clientEmail, 
        clientName, 
        providerName, 
        serviceDescription, 
        amount, 
        dueDate,
        status: 'PENDING' 
      }
    });
    res.status(201).json({ success: true, data: invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create invoice', message: error.message });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, paidAt, stripePaymentIntentId } = req.body;
    const invoice = await prisma.invoice.update({
      where: { id },
      data: { status, paidAt, stripePaymentIntentId }
    });
    res.json({ success: true, data: invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update invoice', message: error.message });
  }
};
