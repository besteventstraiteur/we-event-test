export interface MiniSite {
  id: string;
  event_id: string;
  slug: string;
  title: string;
  theme: string;
  components: any[];
  is_public: boolean;
  custom_domain?: string;
  created_at: string;
}

export interface CreateMiniSiteDTO {
  event_id: string;
  slug: string;
  title: string;
  theme?: string;
  is_public?: boolean;
}
