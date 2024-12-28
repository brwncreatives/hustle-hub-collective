export interface GoalsDefinition {
  Row: {
    categories: string[];
    created_at: string;
    description: string | null;
    id: string;
    quarter: string;
    status: string;
    title: string;
    updated_at: string;
    user_id: string;
  };
  Insert: {
    categories?: string[];
    created_at?: string;
    description?: string | null;
    id?: string;
    quarter: string;
    status?: string;
    title: string;
    updated_at?: string;
    user_id: string;
  };
  Update: {
    categories?: string[];
    created_at?: string;
    description?: string | null;
    id?: string;
    quarter?: string;
    status?: string;
    title?: string;
    updated_at?: string;
    user_id?: string;
  };
  Relationships: [];
}