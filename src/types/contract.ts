export interface Contract {
  id: string;
  event_id: string;
  partner_id: string;
  client_id: string;
  title: string;
  content: string;
  amount: number;
  currency: string;
  status: ContractStatus;
  signed_by_client: boolean;
  signed_by_partner: boolean;
  client_signature_date?: string;
  partner_signature_date?: string;
  valid_until?: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SIGNED = 'signed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface CreateContractDTO {
  event_id: string;
  partner_id: string;
  title: string;
  content: string;
  amount: number;
  currency?: string;
  valid_until?: string;
}

export interface UpdateContractDTO {
  title?: string;
  content?: string;
  amount?: number;
  status?: ContractStatus;
  valid_until?: string;
}
