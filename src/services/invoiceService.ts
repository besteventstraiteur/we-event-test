import { apiClient } from './api-client';
import { ApiResponse } from '../types/api';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '../types/invoice';

class InvoiceService {
  async getInvoices(eventId?: string): Promise<ApiResponse<Invoice[]>> {
    return apiClient.get<Invoice[]>('/invoices', { params: { event_id: eventId } });
  }

  async getInvoiceById(invoiceId: string): Promise<ApiResponse<Invoice>> {
    return apiClient.get<Invoice>(`/invoices/${invoiceId}`);
  }

  async createInvoice(data: CreateInvoiceDTO): Promise<ApiResponse<Invoice>> {
    return apiClient.post<Invoice>('/invoices', data);
  }

  async updateInvoice(invoiceId: string, data: UpdateInvoiceDTO): Promise<ApiResponse<Invoice>> {
    return apiClient.patch<Invoice>(`/invoices/${invoiceId}`, data);
  }

  async markAsPaid(invoiceId: string, paymentMethod: string): Promise<ApiResponse<Invoice>> {
    return apiClient.post<Invoice>(`/invoices/${invoiceId}/mark-paid`, { payment_method: paymentMethod });
  }

  async generatePDF(invoiceId: string): Promise<ApiResponse<{ pdf_url: string }>> {
    return apiClient.post<{ pdf_url: string }>(`/invoices/${invoiceId}/generate-pdf`);
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;
