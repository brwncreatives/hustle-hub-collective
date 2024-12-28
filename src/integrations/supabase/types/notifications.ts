export interface NotificationsDefinition {
  Row: {
    created_at: string;
    id: string;
    is_read: boolean | null;
    message: string;
    user_id: string;
  };
  Insert: {
    created_at?: string;
    id?: string;
    is_read?: boolean | null;
    message: string;
    user_id: string;
  };
  Update: {
    created_at?: string;
    id?: string;
    is_read?: boolean | null;
    message?: string;
    user_id?: string;
  };
  Relationships: [];
}