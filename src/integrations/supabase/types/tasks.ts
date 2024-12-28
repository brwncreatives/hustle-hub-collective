export interface TaskRow {
  id: string;
  goal_id: string;
  title: string;
  completed: boolean;
  is_recurring: boolean;
  week: number | null;
  created_at: string;
  updated_at: string;
}

export interface TaskInsert {
  id?: string;
  goal_id: string;
  title: string;
  completed?: boolean;
  is_recurring?: boolean;
  week?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface TaskUpdate {
  id?: string;
  goal_id?: string;
  title?: string;
  completed?: boolean;
  is_recurring?: boolean;
  week?: number | null;
  created_at?: string;
  updated_at?: string;
}