export interface GoalRow {
  categories: string[];
  created_at: string;
  description: string | null;
  id: string;
  quarter: string;
  status: string;
  title: string;
  updated_at: string;
  user_id: string;
}

export interface GoalInsert {
  categories?: string[];
  created_at?: string;
  description?: string | null;
  id?: string;
  quarter: string;
  status?: string;
  title: string;
  updated_at?: string;
  user_id: string;
}

export interface GoalUpdate {
  categories?: string[];
  created_at?: string;
  description?: string | null;
  id?: string;
  quarter?: string;
  status?: string;
  title?: string;
  updated_at?: string;
  user_id?: string;
}