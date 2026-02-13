export interface PlatformConfig {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  updated_at: string;
}

export interface UpdateConfigDTO {
  value: any;
}
