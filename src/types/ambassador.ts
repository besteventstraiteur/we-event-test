export interface Ambassador {
  id: string;
  user_id: string;
  name: string;
  email: string;
  code: string;
  referrals_count: number;
  commission_earned: number;
  status: AmbassadorStatus;
  created_at: string;
}

export enum AmbassadorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

export interface CreateAmbassadorDTO {
  user_id: string;
  name: string;
  email: string;
  code: string;
}
