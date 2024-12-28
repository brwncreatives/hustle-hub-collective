export interface NotificationRow {
  id: string;
  user_id: string;
  message: string;
  is_read: boolean | null;
  created_at: string;
}

export interface NotificationInsert {
  id?: string;
  user_id: string;
  message: string;
  is_read?: boolean | null;
  created_at?: string;
}

export interface NotificationUpdate {
  id?: string;
  user_id?: string;
  message?: string;
  is_read?: boolean | null;
  created_at?: string;
}