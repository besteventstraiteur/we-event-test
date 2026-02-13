export interface Invoice {
  id: string;
  event_id: string;
  partner_id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: InvoiceStatus;
  payment_method?: string;
  paid_at?: string;
  due_date?: string;
  items: InvoiceItem[];
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export interface CreateInvoiceDTO {
  event_id: string;
  partner_id: string;
  amount: number;
  tax_amount?: number;
  currency?: string;
  due_date?: string;
  items: Omit<InvoiceItem, 'id'>[];
}

export interface UpdateInvoiceDTO {
  amount?: number;
  tax_amount?: number;
  status?: InvoiceStatus;
  due_date?: string;
  items?: Omit<InvoiceItem, 'id'>[];
}
