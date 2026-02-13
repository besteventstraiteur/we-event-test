export interface FloorPlan {
  id: string;
  event_id: string;
  name: string;
  layout_data: any;
  tables: Table[];
  created_at: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  x: number;
  y: number;
  shape: 'round' | 'square' | 'rectangle';
  guests?: string[];
}

export interface CreateFloorPlanDTO {
  event_id: string;
  name: string;
  layout_data?: any;
  tables?: Omit<Table, 'id'>[];
}
