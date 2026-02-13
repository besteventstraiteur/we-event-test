export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  criteria: string;
  points: number;
  rarity: BadgeRarity;
  created_at: string;
}

export enum BadgeRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export interface PartnerBadge {
  id: string;
  partner_id: string;
  badge_id: string;
  earned_at: string;
}

export interface CreateBadgeDTO {
  name: string;
  description: string;
  icon_url: string;
  criteria: string;
  points: number;
  rarity: BadgeRarity;
}
